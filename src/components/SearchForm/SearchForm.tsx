import React, { useState } from 'react'
import { GoSearch } from "react-icons/go";
import './SearchForm.css'

function SearchForm() {
    const [searchInput, setSearchInput] = useState("")

    return (
        <div className='SearchForm'>
            {GoSearch({})}
            <input
                placeholder='Search...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />
        </div>
    )
}

export default SearchForm
