import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { usePostMutation } from "../../hooks/usePostMutation";
import { usePatchMutation } from "../../hooks/usePatchMutation";
import { Patient, PatientValues } from "../../types/patient";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import postPatient from "../../services/patients/postPatient";
import patchPatientByID from "../../services/patients/patchPatientByID";
import { useParams, useNavigate } from "react-router-dom";
import fetchPatientsByID from "../../services/patients/getPatientByID";
import { useFetchByID } from "../../hooks/useFetchByID";
import { toast } from "react-toastify";

// Validation schema
const patientSchema = Yup.object().shape({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    dob: Yup.date().required("Required"),
    sex: Yup.string().required("Required"),
    phone_number: Yup.string(),
    email: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    pharmacy_ids: Yup.array().of(Yup.number()).required("Required"),
});

const PatientForm = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
    const accessToken = useSelector((state: RootState) => state.accessToken.accessToken);
    const { patient_id } = useParams<{ patient_id: string }>();
    const patientID = patient_id ? Number(patient_id) : null;

    const { data: patientData, isLoading, isError } = useFetchByID({
        queryKey: "patient",
        queryFn: fetchPatientsByID,
        id: patientID,
        token: accessToken
    });

    const postMutation = usePostMutation<Patient, PatientValues>(["patients"], postPatient);
    const patchMutation = usePatchMutation<Patient, PatientValues>(
        ["patients"],
        (values: PatientValues) => patchPatientByID(values, accessToken)
    );

    const patient = patientData?.patient || {};
    const [formattedDob, setFormattedDob] = useState("");

    useEffect(() => {
        if (patient.dob) {
            const date = new Date(patient.dob);
            if (!isNaN(date.getTime())) {
                setFormattedDob(date.toISOString().split("T")[0]);
            }
        }
    }, [patient.dob]);

    const handleSubmit = async (
        values: PatientValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            if (!accessToken) {
                throw new Error("No access token available");
            }

            if (patientID) {
                await patchMutation.mutateAsync({ ...values, id: patientID });
                toast.success("Patient updated successfully");
            } else {
                await postMutation.mutateAsync(values);
                toast.success("Patient created successfully");
            }
            navigate("/patients");
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Failed to save patient data");
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading patient data</div>;

    return (
        <div className="TransferForm">
            <Formik
                enableReinitialize
                initialValues={{
                    first_name: patient.first_name || "",
                    last_name: patient.last_name || "",
                    dob: formattedDob || "",
                    sex: patient.sex || "",
                    phone_number: patient.phone_number || "",
                    email: patient.email || "",
                    address: patient.address || "",
                    pharmacy_ids: [user?.pharmacy_id],
                }}
                validationSchema={patientSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="transfer-form">
                        <h2>{patientID ? "Edit Patient" : "New Patient"}</h2>
                        <div className="transfer-form-wrapper">
                            <fieldset>
                                <legend>Patient Info</legend>
                                <label>First Name</label>
                                <Field name="first_name" />
                                <ErrorMessage name="first_name" component="div" className="error" />

                                <label>Last Name</label>
                                <Field name="last_name" />
                                <ErrorMessage name="last_name" component="div" className="error" />

                                <label>Date of Birth</label>
                                <Field name="dob" type="date" />
                                <ErrorMessage name="dob" component="div" className="error" />

                                <label>Sex</label>
                                <Field name="sex" as="select">
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Field>
                                <ErrorMessage name="sex" component="div" className="error" />

                                <label>Phone Number</label>
                                <Field name="phone_number" />
                                <ErrorMessage name="phone_number" component="div" className="error" />

                                <label>Email</label>
                                <Field name="email" />
                                <ErrorMessage name="email" component="div" className="error" />

                                <label>Address</label>
                                <Field name="address" />
                                <ErrorMessage name="address" component="div" className="error" />
                            </fieldset>

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Processing..." : patientID ? "Update Patient" : "Add Patient"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default PatientForm;