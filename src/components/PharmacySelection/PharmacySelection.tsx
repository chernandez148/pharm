import './PharmacySelection.css';
import { useFetch } from '../../hooks/useFetch';
import { useFormikContext } from 'formik';
import fetchPharmacies from '../../services/pharmacies/fetchPharmacies';
import SearchForm from '../SearchForm/SearchForm';

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
    let setFieldValue: ((field: string, value: any) => void) | undefined;

    try {
        const formik = useFormikContext<any>();
        setFieldValue = formik?.setFieldValue;
    } catch (error) {
        // Not inside a Formik context
        setFieldValue = undefined;
    }

    const { data: pharmaciesData, isLoading, error } = useFetch({
        queryKey: "pharmacies",
        queryFn: fetchPharmacies,
    });
    const pharmacies: Pharmacy[] = pharmaciesData?.pharmacies || [];

    return (
        <div
            className="PharmacySelection"
            style={{ width: togglePharmacySelection ? '400px' : '0' }}
        >
            <div className="pharmacy-selection-wrapper">
                <h3>Pharmacy Selection</h3>
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
                                    if (setFieldValue) {
                                        setFieldValue('from_pharmacy_id', pharmacy.id);
                                    }
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
