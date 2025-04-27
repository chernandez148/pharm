import { useState } from 'react';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../../utils/dateUtils';
import { setPrescriptionID } from '../../redux/slices/prescriptionID';
import PharmacySelection from '../PharmacySelection/PharmacySelection';
import sendPrescriptionByID from '../../services/prescriptions/sendPrescriptionByID';
import { usePatchMutation } from '../../hooks/usePatchMutation';
import { Prescription, PrescriptionValues } from '../../types/prescriptions';
import { useFetchByID } from '../../hooks/useFetchByID';
import fetchPrescriptionByID from '../../services/prescriptions/getPrescriptionByID';

function PrescriptionInfo() {
    const [togglePharmacySelection, setTogglePharmacySelection] = useState(false);
    const [selectedPharmacy, setSelectedPharmacy] = useState<{ id: number | null; pharmacy: string }>({
        id: null,
        pharmacy: '',
    });

    const prescriptionID = useSelector((state: RootState) => state.prescriptionID.prescriptionID);
    const { data: prescriptionData, isLoading, isError } = useFetchByID({
        queryKey: "prescription",
        id: prescriptionID,
        queryFn: fetchPrescriptionByID,
    });

    const dispatch = useDispatch();

    const prescription = prescriptionData?.prescription || {};

    const { mutate, isPending: isSending } = usePatchMutation<Prescription, PrescriptionValues>(
        ['prescriptions'],
        sendPrescriptionByID
    );

    // Early returns for loading and error states
    if (!prescriptionID || isLoading) return null;
    if (isError) return <div>Error loading prescription.</div>;

    const patient = prescription.patient || {};
    const prescriber = prescription.prescriber || {};

    return (
        <div
            className='PatientInfo'
            style={{
                width: prescriptionID ? '300px' : '0',
                transition: 'width 0.3s ease',
            }}
        >
            <h3>Patient Info</h3>
            <div className='patient-info-wrapper'>
                <p><strong>Private Info:</strong></p>
                <p>{`${patient.first_name || 'N/A'} ${patient.last_name || ''}`.trim()}</p>
                <p>{patient.email || 'N/A'}</p>
                <p>{formatDate(patient.dob) || 'N/A'}</p>
                <p>{patient.sex || 'N/A'}</p>

                <br />
                <p><strong>Contact Info:</strong></p>
                <p>{patient.address || 'N/A'}</p>
                <p>{patient.phone_number || 'N/A'}</p>

                <br />
                <p><strong>Prescription Info:</strong></p>
                <p><strong>Medication:</strong> {prescription.medication || 'N/A'}</p>
                <p><strong>Dosage:</strong> {prescription.dosage || 'N/A'}</p>
                <p><strong>Quantity:</strong> {prescription.quantity || 'N/A'}</p>
                <p><strong>Refills:</strong> {prescription.refills ?? 'N/A'}</p>
                <p style={{ textWrap: "wrap" }}><strong>Directions for Use:</strong> {prescription.directions_for_use || 'N/A'}</p>
                <p><strong>Date Prescribed:</strong> {formatDate(prescription.date_of_prescription) || 'N/A'}</p>
                <p><strong>Date Last Filled:</strong> {formatDate(prescription.date_last_filled) || 'N/A'}</p>

                <br />
                <p><strong>Prescriber Info:</strong></p>
                <p><strong>Name:</strong> {prescriber.full_name || 'N/A'}</p>
                <p><strong>DEA Number:</strong> {prescriber.dea_number || 'N/A'}</p>
                <p><strong>Contact:</strong> {prescriber.contact_info || 'N/A'}</p>
            </div>

            <button
                style={{ margin: '1rem' }}
                onClick={() => {
                    dispatch(setPrescriptionID(null));
                    setSelectedPharmacy({ id: null, pharmacy: '' });
                }}
            >
                Close
            </button>

            {!selectedPharmacy.id ? (
                <>
                    <button
                        onClick={() => setTogglePharmacySelection(true)}
                        style={{ marginLeft: '1rem' }}
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
                    onClick={() =>
                        mutate(
                            { id: prescriptionID, pharmacy_ids: [...prescription.pharmacies.map((pharmacy: any) => pharmacy.id), selectedPharmacy.id] },
                            {
                                onSuccess: () => {
                                    dispatch(setPrescriptionID(null));
                                    setSelectedPharmacy({ id: null, pharmacy: '' });
                                },
                            }
                        )
                    }
                    style={{ marginLeft: '1rem' }}
                    disabled={isSending}
                >
                    {isSending ? 'Sending...' : 'Send Now'}
                </button>
            )}
        </div>
    );
}

export default PrescriptionInfo;
