import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { MdKeyboardArrowDown } from "react-icons/md";

import { RootState } from "../../redux/store";
import { usePostMutation } from "../../hooks/usePostMutation";
import { usePatchMutation } from "../../hooks/usePatchMutation";
import { useFetchByID } from "../../hooks/useFetchByID";
import fetchPrescriptionByID from "../../services/prescriptions/getPrescriptionByID";
import postPrescription from "../../services/prescriptions/postPrescription";
import patchPrescriptionByID from "../../services/prescriptions/patchPrescriptionByID";
import { Prescription, PrescriptionValues } from "../../types/prescriptions";
import PatientSelection from "../PatientSelection/PatientSelection";
import "./PrescriptionForm.css";

// Updated Validation Schema
const prescriptionSchema = Yup.object().shape({
    patient_id: Yup.number().required("Patient is required").min(1, "Patient is required"),
    medication: Yup.string().required("Medication is required"),
    dosage: Yup.string().required("Dosage is required"),
    is_controlled: Yup.boolean().required("Please specify if medication is controlled"),
    directions_for_use: Yup.string().required("Directions are required"),
    quantity: Yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
    refills: Yup.number().required("Refills are required").min(0, "Refills cannot be negative"),
    date_of_prescription: Yup.date().required("Date of Prescription is required"),
    date_last_filled: Yup.date().required("Date Last Filled is required"),
    prescriber_full_name: Yup.string(),
    prescriber_dea_number: Yup.string(),
    prescriber_contact_info: Yup.string(),
});

const PrescriptionForm = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
    const accessToken = useSelector((state: RootState) => state.accessToken.accessToken);
    const { prescription_id } = useParams<{ prescription_id: string }>();
    const prescriptionID = prescription_id ? Number(prescription_id) : null;

    const { data: prescriptionData, isLoading, isError } = useFetchByID({
        queryKey: "prescription",
        queryFn: fetchPrescriptionByID,
        id: prescriptionID,
        token: accessToken,
    });

    const createPrescription = usePostMutation<Prescription, PrescriptionValues>(
        ["prescriptions"], 
        postPrescription
    );
    const updatePrescription = usePatchMutation<Prescription, PrescriptionValues>(
        ["prescriptions"], 
        (values) => patchPrescriptionByID(values, accessToken)
    );

    const prescription = prescriptionData?.prescription || {};
    const [togglePatientSelection, setTogglePatientSelection] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<{ id: number | null; patient: string }>({
        id: null,
        patient: "",
    });
    const [formattedDateOfPrescription, setFormattedDateOfPrescription] = useState("");
    const [formattedDateLastFilled, setFormattedDateLastFilled] = useState("");

    useEffect(() => {
        if (prescription.date_of_prescription) {
            const date = new Date(prescription.date_of_prescription);
            if (!isNaN(date.getTime())) {
                setFormattedDateOfPrescription(date.toISOString().split("T")[0]);
            }
        }
        if (prescription.date_last_filled) {
            const date = new Date(prescription.date_last_filled);
            if (!isNaN(date.getTime())) {
                setFormattedDateLastFilled(date.toISOString().split("T")[0]);
            }
        }
        if (prescription?.patient) {
            setSelectedPatient({
                id: prescription.patient.id,
                patient: `${prescription.patient.first_name} ${prescription.patient.last_name}`,
            });
        }
    }, [prescription]);

    const handleSubmit = async (values: PrescriptionValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            if (!accessToken) throw new Error("No access token available");

            // Ensure is_controlled is a proper boolean before sending to API
            const processedValues = {
                ...values,
                is_controlled: Boolean(values.is_controlled),
            };

            if (prescriptionID) {
                await updatePrescription.mutateAsync({ ...processedValues, id: prescriptionID });
                toast.success("Prescription updated successfully");
            } else {
                await createPrescription.mutateAsync(processedValues);
                toast.success("Prescription created successfully");
            }

            navigate("/prescriptions");
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Failed to save prescription data");
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading prescription data</div>;

    return (
        <div className="PrescriptionForm">
            <Formik
                enableReinitialize
                initialValues={{
                    patient_id: selectedPatient.id || prescription.patient_id || "",
                    medication: prescription.medication || "",
                    dosage: prescription.dosage || "",
                    is_controlled: prescription.is_controlled || false,
                    directions_for_use: prescription.directions_for_use || "",
                    quantity: prescription.quantity || 0,
                    refills: prescription.refills || 0,
                    date_of_prescription: formattedDateOfPrescription || "",
                    date_last_filled: formattedDateLastFilled || "",
                    prescriber_full_name: prescription.prescriber_full_name || "",
                    prescriber_dea_number: prescription.prescriber_dea_number || "",
                    prescriber_contact_info: prescription.prescriber_contact_info || "",
                    pharmacy_ids: prescription.pharmacies?.map(pharmacy => pharmacy.id) || [user.pharmacy_id],
                }}
                validationSchema={prescriptionSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className="prescription-form">
                        <h2>{prescriptionID ? "Edit Prescription" : "New Prescription"}</h2>

                        <div className="prescription-form-wrapper">
                            <fieldset>
                                <legend>Patient Info</legend>

                                <label>Patient Name</label>
                                <button
                                    type="button"
                                    className="dropdown-button"
                                    onClick={() => setTogglePatientSelection(true)}
                                >
                                    <p>{selectedPatient.patient || "Select Patient"}</p>
                                    {MdKeyboardArrowDown({})}
                                </button>

                                <PatientSelection
                                    togglePatientSelection={togglePatientSelection}
                                    setTogglePatientSelection={setTogglePatientSelection}
                                    setSelectedPatient={(patient) => {
                                        setSelectedPatient(patient);
                                        setFieldValue("patient_id", patient.id);
                                    }}
                                />
                                <ErrorMessage name="patient_id" component="div" className="error" />
                            </fieldset>

                            <fieldset>
                                <legend>Prescription Info</legend>

                                <label>Medication</label>
                                <Field name="medication" />
                                <ErrorMessage name="medication" component="div" className="error" />

                                <label>Dosage</label>
                                <Field name="dosage" />
                                <ErrorMessage name="dosage" component="div" className="error" />

                                <div className="form-group">
                                    <label>Is Controlled?</label>
                                    <div className="radio-group">
                                        <label style={{ marginRight: ".5rem" }}>
                                            <input 
                                                name="is_controlled" 
                                                type="radio" 
                                                checked={values.is_controlled === true}
                                                onChange={() => setFieldValue("is_controlled", true)}
                                                className="radio-input"
                                            />
                                            <span className="radio-label">Yes</span>
                                        </label>
                                        <label>
                                            <input 
                                                name="is_controlled" 
                                                type="radio" 
                                                checked={values.is_controlled === false}
                                                onChange={() => setFieldValue("is_controlled", false)}
                                                className="radio-input"
                                            />
                                            <span className="radio-label">No</span>
                                        </label>
                                    </div>
                                    <ErrorMessage name="is_controlled" component="div" className="error" />
                                </div>
                                
                                <label>Directions For Use</label>
                                <Field name="directions_for_use" as="textarea" />
                                <ErrorMessage name="directions_for_use" component="div" className="error" />

                                <label>Quantity</label>
                                <Field name="quantity" type="number" min="0" />
                                <ErrorMessage name="quantity" component="div" className="error" />

                                <label>Refills</label>
                                <Field name="refills" type="number" min="0" />
                                <ErrorMessage name="refills" component="div" className="error" />

                                <label>Date of Prescription</label>
                                <Field name="date_of_prescription" type="date" />
                                <ErrorMessage name="date_of_prescription" component="div" className="error" />

                                <label>Date Last Filled</label>
                                <Field name="date_last_filled" type="date" />
                                <ErrorMessage name="date_last_filled" component="div" className="error" />
                            </fieldset>

                            <fieldset>
                                <legend>Prescriber Info</legend>

                                <label>Prescriber's Full Name</label>
                                <Field name="prescriber_full_name" />
                                <ErrorMessage name="prescriber_full_name" component="div" className="error" />

                                <label>Prescriber's DEA Number</label>
                                <Field name="prescriber_dea_number" />
                                <ErrorMessage name="prescriber_dea_number" component="div" className="error" />

                                <label>Prescriber's Contact Info</label>
                                <Field name="prescriber_contact_info" />
                                <ErrorMessage name="prescriber_contact_info" component="div" className="error" />
                            </fieldset>

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Processing..." : prescriptionID ? "Update Prescription" : "Add Prescription"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default PrescriptionForm;