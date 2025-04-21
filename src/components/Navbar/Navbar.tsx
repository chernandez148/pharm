import React from 'react';
import { Link } from 'react-router-dom';
import { BiTransferAlt } from 'react-icons/bi'; // ✅ make sure this is correct
import './Navbar.css';

function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar-brand">
                <Link to="/">RxConnect</Link>
            </div>
            <nav>
                <Link to="/transfer">
                    Transfers
                </Link>
            </nav>
        </div>
    );
}

export default Navbar;
