import "./TransferForm.css";
import { useEffect, useState } from "react";
import PharmacySelection from "../PharmacySelection/PharmacySelection";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { usePostMutation } from "../../hooks/usePostMutation";
import { Transfer, TransferValues } from "../../types/transfer";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchByID } from "../../hooks/useFetchByID";
import { usePatchMutation } from "../../hooks/usePatchMutation";
import fetchTransfersByID from "../../services/transfers/getTransferByID";
import postTransfer from "../../services/transfers/postTransfer";
import patchTransferByID from "../../services/transfers/patchTransferByID";

// Validation schema
const transferSchema = Yup.object().shape({
    patient_first_name: Yup.string().required("Required"),
    patient_last_name: Yup.string().required("Required"),
    patient_dob: Yup.date().required("Required"),
    patient_phone_number: Yup.string(),
    medication_name: Yup.string().required("Required"),
    requested_by: Yup.number().required("Required"),
    from_pharmacy_id: Yup.number().required("Required"),
    to_pharmacy_id: Yup.number().required("Required"),
    transfer_status: Yup.string().required("Required"),
});

const TransferForm = () => {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user.user);
    const [togglePharmacySelection, setTogglePharmacySelection] = useState(false);
    const { transfer_id } = useParams<{ transfer_id: string }>();
    const transferID = Number(transfer_id);

    const {
        data: transferData,
        isLoading,
        isError,
    } = useFetchByID({
        queryKey: "transfer",
        queryFn: fetchTransfersByID,
        id: transferID,
    });

    const postMutation = usePostMutation<Transfer, TransferValues>(["transfers"], postTransfer);
    const patchMutation = usePatchMutation<Transfer, TransferValues>(["transfers"], patchTransferByID);

    const transfer = transferData?.transfer || {};

    const [selectedPharmacy, setSelectedPharmacy] = useState<{
        id: number | null;
        pharmacy: string;
    }>({
        id: transfer?.from_pharmacy?.id || null,
        pharmacy: transfer?.from_pharmacy?.name || "",
    });

    // Format the date correctly for the input field
    const [formattedDob, setFormattedDob] = useState("");
    useEffect(() => {
        if (transfer.patient_dob) {
            const formattedDate = new Date(transfer.patient_dob).toISOString().split("T")[0]; // Formats to 'yyyy-MM-dd'
            setFormattedDob(formattedDate);
        }
    }, [transfer.patient_dob]);

    if (transferID && (isLoading || !transferData)) {
        return <div>Loading transfer data...</div>;
    }

    if (isError) {
        return <div>Error loading transfer data.</div>;
    }

    return (
        <div className="TransferForm">
            <Formik
                enableReinitialize
                initialValues={{
                    patient_first_name: transfer.patient_first_name || "",
                    patient_last_name: transfer.patient_last_name || "",
                    patient_dob: formattedDob || "",
                    patient_phone_number: transfer.patient_phone_number || "",
                    medication_name: transfer.medication_name || "",
                    requested_by: user.id,
                    from_pharmacy_id: selectedPharmacy.id || transfer.from_pharmacy_id || null,
                    to_pharmacy_id: user.pharmacy_id,
                    transfer_status: transfer.transfer_status || "pending",
                }}
                validationSchema={transferSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        if (transferID) {
                            patchMutation.mutate({ ...values, id: transferID });
                        } else {
                            postMutation.mutate(values);
                        }
                    } catch (error) {
                        console.error("Transfer request failed:", error);
                    } finally {
                        setSubmitting(false);
                        navigate("/transfer");
                    }
                }}
            >
                {() => (
                    <>
                        <Form className="transfer-form">
                            <h2>{transferID ? "Edit Transfer Request" : "New Transfer Request"}</h2>
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
                                    <input disabled value={`${user.first_name} ${user.last_name}`} />

                                    <label>From Pharmacy</label>
                                    <button
                                        type="button"
                                        className="dropdown-button"
                                        onClick={() => setTogglePharmacySelection(true)}
                                    >
                                        <p>{selectedPharmacy.pharmacy || "Select Pharmacy"}</p>
                                        {MdKeyboardArrowDown({})}
                                    </button>
                                    <PharmacySelection
                                        togglePharmacySelection={togglePharmacySelection}
                                        setTogglePharmacySelection={setTogglePharmacySelection}
                                        setSelectedPharmacy={setSelectedPharmacy}
                                    />
                                    <ErrorMessage name="from_pharmacy_id" component="div" className="error" />

                                    <label>To Pharmacy</label>
                                    {user && <input disabled value={user.pharmacy.name} />}
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

                                <button type="submit">
                                    {transferID ? "Update Transfer" : "Start Transfer"}
                                </button>
                            </div>
                        </Form>
                    </>
                )}
            </Formik>
        </div>
    );
};

export default TransferForm;
