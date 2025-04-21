import { useFormikContext } from 'formik';
import { usePharmacies } from '../../hooks/usePharmacies';
import SearchForm from '../SearchForm/SearchForm';
import './PharmacySelection.css';

type Pharmacy = {
    id: number;
    name: string;
    phone_number: string;
    address: string;
};

function PharmacySelection({
    togglePharmacySelection,
    setTogglePharmacySelection,
    setSelectedPharmacy,
}: {
    togglePharmacySelection: boolean;
    setTogglePharmacySelection: (value: boolean) => void;
    setSelectedPharmacy: (value: { pharmacy: string; id: number }) => void;
}) {
    const { setFieldValue } = useFormikContext<any>(); // 👈 or replace `any` with your form's actual type
    const { data: pharmaciesData, isLoading, error } = usePharmacies();

    const pharmacies: Pharmacy[] = pharmaciesData?.pharmacies || [];

    return (
        <div
            className="PharmacySelection"
            style={{ width: togglePharmacySelection ? '400px' : '0' }}
        >
            <div className="pharmacy-selection-wrapper">
                <h2>Pharmacy Selection</h2>
                <SearchForm />
                {isLoading && <p>Loading...</p>}
                {error && <p>Error loading pharmacies.</p>}

                <ul>
                    {pharmacies.map((pharmacy) => (
                        <li key={pharmacy.id}>
                            <div>
                                <strong>{pharmacy.name}</strong>
                                <br />
                                <small>{pharmacy.phone_number}</small>
                                <br />
                                <small>{pharmacy.address}</small>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedPharmacy({
                                        id: pharmacy.id,
                                        pharmacy: pharmacy.name,
                                    });
                                    setFieldValue('from_pharmacy_id', pharmacy.id); // ✅ Sets correct value for form
                                    setTogglePharmacySelection(false);
                                }}
                            >
                                Select
                            </button>
                        </li>
                    ))}
                </ul>

                <button onClick={() => setTogglePharmacySelection(false)}>Close</button>
            </div>
        </div>
    );
}

export default PharmacySelection;
