import React, { useState } from "react";
import PharmacySelection from "../PharmacySelection/PharmacySelection";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./TransferForm.css";
import TransferSummary from "../TransferSummery/TransferSummary";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import postTransfer from "../../services/transfers/postTransfer";
import { usePostMutation } from "../../hooks/usePostMutation";
import { Transfer, TransferValues } from "../../types/transfer";

// Transfer validation schema
const transferSchema = Yup.object().shape({
    patient_first_name: Yup.string().required("Required"),
    patient_last_name: Yup.string().required("Required"),
    patient_dob: Yup.date().required("Required"),
    patient_phone_number: Yup.string(),
    medication_name: Yup.string().required("Required"),
    requested_by: Yup.number().required("Required"),
    // from_pharmacy_id: Yup.number().required("Required"),
    to_pharmacy_id: Yup.number().required("Required"),
    transfer_status: Yup.string().required("Required"),
});

const TransferForm = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [togglePharmacySelection, setTogglePharmacySelection] = useState(false);
    const [selectedPharmacy, setSelectedPharmacy] = useState<{ id: number | null; pharmacy: string }>({
        id: null,
        pharmacy: "",
    });

    const { mutate } = usePostMutation<Transfer, TransferValues>(
        ["transfers"],
        postTransfer
    );

    return (
        <div className="TransferForm">
            <Formik
                initialValues={{
                    patient_first_name: "",
                    patient_last_name: "",
                    patient_dob: "",
                    patient_phone_number: "",
                    medication_name: "",
                    requested_by: user.user.id,
                    from_pharmacy_id: selectedPharmacy.id || null,
                    to_pharmacy_id: user.user.pharmacy_id,
                    transfer_status: "pending",
                }}
                validationSchema={transferSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    console.log(values)
                    try {
                        mutate(values);
                    } catch (error) {
                        console.error("New transfer request failed:", error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ values }) => (
                    <>
                        <Form className="transfer-form">
                            <h2>New Transfer Request</h2>
                            <div className="transfer-form-wrapper">
                                <fieldset>
                                    <legend>Patient Info</legend>
                                    <label>First Name</label>
                                    <Field name="patient_first_name" />
                                    <ErrorMessage name="patient_first_name" component="div" className="error" />

                                    <label>Last Name</label>
                                    <Field name="patient_last_name" />
                                    <ErrorMessage name="patient_last_name" component="div" className="error" />

                                    <label>Date of Birth</label>
                                    <Field name="patient_dob" type="date" />
                                    <ErrorMessage name="patient_dob" component="div" className="error" />

                                    <label>Phone Number</label>
                                    <Field name="patient_phone_number" />
                                </fieldset>

                                <fieldset>
                                    <legend>Prescription Info</legend>
                                    <label>Medication Name</label>
                                    <Field name="medication_name" />
                                    <ErrorMessage name="medication_name" component="div" className="error" />
                                </fieldset>

                                <fieldset>
                                    <legend>Transfer Info</legend>

                                    <label>Requested By:</label>
                                    <input
                                        disabled
                                        value={`${user.user.first_name} ${user.user.last_name}`}
                                    />

                                    <label>From Pharmacy</label>
                                    <button type="button" className="dropdown-button" onClick={() => setTogglePharmacySelection(true)}>
                                        <p>{selectedPharmacy.pharmacy ? selectedPharmacy.pharmacy : "Select Pharmacy"}</p>
                                        {MdKeyboardArrowDown({})}
                                    </button>
                                    <PharmacySelection
                                        togglePharmacySelection={togglePharmacySelection}
                                        setTogglePharmacySelection={setTogglePharmacySelection}
                                        setSelectedPharmacy={setSelectedPharmacy}
                                    />
                                    <ErrorMessage name="from_pharmacy_id" component="div" className="error" />

                                    <label>To Pharmacy</label>
                                    {user?.user && (
                                        <input
                                            disabled
                                            value={user.pharmacy.name}
                                        />
                                    )}
                                    <ErrorMessage name="to_pharmacy_id" component="div" className="error" />

                                    <label>Status</label>
                                    <Field as="select" name="transfer_status">
                                        <option value="pending">PENDING</option>
                                        <option value="in_progress">IN PROGRESS</option>
                                        <option value="completed">COMPLETED</option>
                                        <option value="cancelled">CANCELLED</option>
                                    </Field>
                                    <ErrorMessage name="transfer_status" component="div" className="error" />
                                </fieldset>

                                <button type="submit">Start Transfer</button>
                            </div>
                        </Form>

                        <TransferSummary values={values} selectedPharmacy={selectedPharmacy} />
                    </>
                )}
            </Formik>
        </div>
    );
};

export default TransferForm;
