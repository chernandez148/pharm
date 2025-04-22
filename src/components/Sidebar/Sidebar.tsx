import React from 'react';
import { Link } from 'react-router-dom';
import { BiTransferAlt } from 'react-icons/bi'; // ✅ make sure this is correct
import './Sidebar.css';

function Sidebar() {
    return (
        <div className="Sidebar">
            <div className="sidebar-brand">
                <Link to="/">RxConnect</Link>
            </div>
            <nav>
                <Link to="/transfer">
                    Transfers
                </Link>
                <Link to="/patients">
                    Patients
                </Link>
                <Link to="/prescriptions">
                    Prescriptions
                </Link>
            </nav>
        </div>
    );
}

export default Sidebar;
