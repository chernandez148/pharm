import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { RootState } from "../../redux/store";
import { usePostMutation } from "../../hooks/usePostMutation";
import { usePatchMutation } from "../../hooks/usePatchMutation";
import { useFetchByID } from "../../hooks/useFetchByID";

import fetchPrescriptionByID from "../../services/prescriptions/getPrescriptionByID";
import postPrescription from "../../services/prescriptions/postPrescription";
import patchPrescriptionByID from "../../services/prescriptions/patchPrescriptionByID";

import { Prescription, PrescriptionValues } from "../../types/prescriptions";

import PatientSelection from "../PatientSelection/PatientSelection";
import { MdKeyboardArrowDown } from "react-icons/md";

import "./PrescriptionForm.css";
import { Patient, PatientValues } from "../../types/patient";
import patchPatientByID from "../../services/patients/patchPatientByID";

// Validation Schema
const prescriptionSchema = Yup.object().shape({
    patient_id: Yup.number().required("Patient is required").min(1, "Patient is required"),
    medication: Yup.string().required("Medication is required"),
    dosage: Yup.string().required("Dosage is required"),
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

    const createPrescription = usePostMutation<Prescription, PrescriptionValues>(["prescriptions"], postPrescription);
    const updatePrescription = usePatchMutation<Prescription, PrescriptionValues>(["prescriptions"], (values) =>
        patchPrescriptionByID(values, accessToken)
    );

    const prescription = prescriptionData?.prescription || {};

    const [togglePatientSelection, setTogglePatientSelection] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<{ id: number | null; patient: string }>({
        id: null,
        patient: "",
    });
    console.log(selectedPatient)
    useEffect(() => {
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

            if (prescriptionID) {
                await updatePrescription.mutateAsync({ ...values, id: prescriptionID });
                toast.success("Prescription updated successfully");
            } else {
                await createPrescription.mutateAsync(values);
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
                    directions_for_use: prescription.directions_for_use || "",
                    quantity: prescription.quantity || 0,
                    refills: prescription.refills || 0,
                    date_of_prescription: prescription.date_of_prescription || "",
                    date_last_filled: prescription.date_last_filled || "",
                    prescriber_full_name: prescription.prescriber_full_name || "",
                    prescriber_dea_number: prescription.prescriber_dea_number || "",
                    prescriber_contact_info: prescription.prescriber_contact_info || "",
                    pharmacy_ids: prescription.pharmacies?.map(pharmacy => pharmacy.id) || [user.pharmacy_id], // Map pharmacy ids if available
                }}
                validationSchema={prescriptionSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue }) => (
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

                            {/* Rest of your form fields remain the same */}
                            <fieldset>
                                <legend>Prescription Info</legend>

                                <label>Medication</label>
                                <Field name="medication" />
                                <ErrorMessage name="medication" component="div" className="error" />

                                <label>Dosage</label>
                                <Field name="dosage" />
                                <ErrorMessage name="dosage" component="div" className="error" />

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