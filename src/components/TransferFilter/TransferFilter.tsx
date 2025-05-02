import { Transfer } from "../../types/transfer";

const TransferFilter = ({ 
    currentFilter, 
    onFilterChange,
    setToggleFilter,
    filters
  }: {
    currentFilter: Transfer[];
    onFilterChange: (filter: Transfer[]) => void;
    setToggleFilter: (value: boolean) => void;
    filters: {
      all: Transfer[];
      sent: Transfer[];
      received: Transfer[];
    };
  }) => {
    const filterOptions = [
      { label: 'None', value: filters.all },
      { label: 'Requests Sent', value: filters.sent },
      { label: 'Requests Received', value: filters.received }
    ];
  
    return (
      <div className='filterModel'>
        <p>Filter By</p>
        <div style={{ padding: ".25rem 0" }}>
          {filterOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => {
                onFilterChange(option.value)
                setToggleFilter(false)
            }}
              style={{ fontWeight: currentFilter === option.value ? 600 : 400 }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  export default TransferFilter