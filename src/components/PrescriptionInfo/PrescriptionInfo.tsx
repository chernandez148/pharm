import { useState } from "react";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../utils/dateUtils";
import { setPrescriptionID } from "../../redux/slices/prescriptionID";
import PharmacySelection from "../PharmacySelection/PharmacySelection";
import sendPrescriptionByID from "../../services/prescriptions/sendPrescriptionByID";
import { usePatchMutation } from "../../hooks/usePatchMutation";
import { Prescription, PrescriptionValues } from "../../types/prescriptions";
import { Transfer, TransferValues } from "../../types/transfer";
import { useFetchByID } from "../../hooks/useFetchByID";
import fetchPrescriptionByID from "../../services/prescriptions/getPrescriptionByID";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Patient, PatientValues } from "../../types/patient";
import patchPatientByID from "../../services/patients/patchPatientByID";
import './PrescriptionInfo.css'
import patchTransferByID from "../../services/transfers/patchTransferByID";
import fetchTransfersByPharmacyID from "../../services/transfers/getTransfersByPharmacyID";
import 'react-toastify/dist/ReactToastify.css';

function PrescriptionInfo() {
  const user = useSelector((state: RootState) => state.user.user)
  const accessToken = useSelector(
    (state: RootState) => state.accessToken.accessToken
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);
  const [togglePharmacySelection, setTogglePharmacySelection] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<{
    id: number | null;
    pharmacy: string;
  }>({
    id: null,
    pharmacy: "",
  });

  const prescriptionID = useSelector(
    (state: RootState) => state.prescriptionID.prescriptionID
  );
  const {
    data: prescriptionData,
    isLoading,
    isError,
  } = useFetchByID({
    queryKey: "prescription",
    id: prescriptionID,
    queryFn: fetchPrescriptionByID,
  });

  const { data: transfersData } = useFetchByID({
    queryKey: "transfers",
    queryFn: fetchTransfersByPharmacyID,
    id: user?.pharmacy_id,
  });

  const prescription = prescriptionData?.prescription || {};

  const transfersReceived = transfersData?.transfers.filter((transfer: any) => {
    // Null checks for required fields
    if (!transfer?.from_pharmacy || !prescription?.patient) {
      return false;
    }

    // Compare pharmacy IDs (number comparison)
    const samePharmacy = transfer.from_pharmacy.id === user?.pharmacy_id;

    // Compare patient names (case insensitive)
    const sameFirstName = transfer.patient_first_name?.toLowerCase() ===
      prescription.patient.first_name?.toLowerCase();
    const sameLastName = transfer.patient_last_name?.toLowerCase() ===
      prescription.patient.last_name?.toLowerCase();

    // Compare phone numbers (normalized)
    const normalizePhone = (phone: string) => phone?.replace(/\D/g, '');
    const samePhone = normalizePhone(transfer.patient_phone_number) ===
      normalizePhone(prescription.patient.phone_number);

    // Compare dates (if needed)
    const transferDob = new Date(transfer.patient_dob);
    const patientDob = new Date(prescription.patient.dob);
    const sameDob = transferDob.getTime() === patientDob.getTime();

    return samePharmacy && sameFirstName && sameLastName && samePhone && sameDob;
  }) || [];

  const transferID = transfersReceived.length > 0 ? transfersReceived[0].id : null;

  const updatePrescription = usePatchMutation<Prescription, PrescriptionValues>(
    ["prescriptions"],
    (values) => sendPrescriptionByID(values)
  );
  const updatePatient = usePatchMutation<Patient, PatientValues>(
    ['patients'],
    (values) => patchPatientByID(values, accessToken)
  )
  const updateTransfer = usePatchMutation<Transfer, TransferValues>(
    ['transfers'],
    (values) => patchTransferByID(values)
  )

  const handleSubmit = async () => {
    if (!selectedPharmacy.id) {
      toast.warning("Please select a pharmacy first");
      return;
    }

    if (!accessToken) {
      toast.error("Authentication required");
      navigate("/login");
      return;
    }

    if (!prescriptionID || !prescription?.patient?.id) {
      toast.error("Missing required data");
      return;
    }

    if (transfersReceived.length === 0) {
      toast.error("No matching transfer request found. Patient information does not match.");
      return;
    }

    setSubmitting(true);

    try {
      // Format date once for all requests
      const completedAt = new Date().toISOString().replace('Z', '').replace(/\.\d{3}$/, '');

      // Execute requests in parallel when possible
      const requests = [
        updatePrescription.mutateAsync({
          id: prescriptionID,
          pharmacy_ids: [
            ...prescription.pharmacies.map((pharmacy: { id: number }) => pharmacy.id),
            selectedPharmacy.id,
          ],
        }),
        updatePatient.mutateAsync({
          id: prescription.patient.id,
          pharmacy_ids: [
            ...prescription.pharmacies.map((pharmacy: { id: number }) => pharmacy.id),
            selectedPharmacy.id,
          ],
        }),
        updateTransfer.mutateAsync({
          id: transferID,
          prescription_id: prescription.id,
          transfer_status: "completed",
          completed_by: user.id,
          completed_at: completedAt,
        }),
      ];

      // Wait for all requests to complete
      await Promise.all(requests);

      toast.success("Prescription sent to pharmacy successfully");
      navigate("/prescriptions");

    } catch (error) {
      console.error("Submission failed:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to send prescription to pharmacy";
      toast.error(errorMessage);

      // Optionally rollback successful operations if needed
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div></div>;
  if (isError) return <div>Error loading prescription.</div>;
  if (!prescriptionID) return null;

  const patient = prescription.patient || {};
  const prescriber = prescription.prescriber || {};

  return (
    <div
      className={`PrescriptionInfo ${prescriptionID ? 'open' : ''}`}
    >
      <h3>Prescription Info</h3>
      <div className="prescription-info-wrapper">
        <p>
          <strong>Private Info:</strong>
        </p>
        <p>
          {`${patient.first_name || "N/A"} ${patient.last_name || ""}`.trim()}
        </p>
        <p>{patient.email || "N/A"}</p>
        <p>{formatDate(patient.dob).formattedDate || "N/A"}</p>
        <p>{patient.sex || "N/A"}</p>

        <br />
        <p>
          <strong>Contact Info:</strong>
        </p>
        <p>{patient.address || "N/A"}</p>
        <p>{patient.phone_number || "N/A"}</p>

        <br />
        <p>
          <strong>Prescription Info:</strong>
        </p>
        <p>
          <strong>Medication:</strong> {prescription.medication || "N/A"}
        </p>
        <p>
          <strong>Dosage:</strong> {prescription.dosage || "N/A"}
        </p>
        <p>
          <strong>Quantity:</strong> {prescription.quantity || "N/A"}
        </p>
        <p>
          <strong>Refills:</strong> {prescription.refills ?? "N/A"}
        </p>
        <p style={{ textWrap: "wrap" }}>
          <strong>Directions for Use:</strong>{" "}
          {prescription.directions_for_use || "N/A"}
        </p>
        <p>
          <strong>Date Prescribed:</strong>{" "}
          {formatDate(prescription.date_of_prescription).formattedDate || "N/A"}
        </p>
        <p>
          <strong>Date Last Filled:</strong>{" "}
          {formatDate(prescription.date_last_filled).formattedDate || "N/A"}
        </p>

        <br />
        <p>
          <strong>Prescriber Info:</strong>
        </p>
        <p>
          <strong>Name:</strong> {prescriber.full_name || "N/A"}
        </p>
        <p>
          <strong>DEA Number:</strong> {prescriber.dea_number || "N/A"}
        </p>
        <p>
          <strong>Contact:</strong> {prescriber.contact_info || "N/A"}
        </p>
      </div>

      <div className="prescription-info-action-buttons">
        <button
          style={{ margin: "1rem" }}
          onClick={() => {
            dispatch(setPrescriptionID(null));
            setSelectedPharmacy({ id: null, pharmacy: "" });
          }}
        >
          Close
        </button>

        {!selectedPharmacy.id ? (
          <>
            <button
              onClick={() => setTogglePharmacySelection(true)}
              style={{ margin: "1rem" }}
            >
              Send To
            </button>
            <PharmacySelection
              togglePharmacySelection={togglePharmacySelection}
              setTogglePharmacySelection={setTogglePharmacySelection}
              setSelectedPharmacy={setSelectedPharmacy}
            />
          </>
        ) : (
          <button
            onClick={handleSubmit}
            style={{ marginLeft: "1rem" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Now"}
          </button>
        )}
      </div>
    </div>
  );
}

export default PrescriptionInfo;