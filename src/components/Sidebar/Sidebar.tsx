import React from "react";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaPrescription } from "react-icons/fa";
import { FaPrescriptionBottle } from "react-icons/fa6";
import { FaFilePrescription } from "react-icons/fa6";
import { FaHospital } from "react-icons/fa6";
import { TbReportAnalytics } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { BiSupport } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { FaExclamation } from "react-icons/fa6";
import "./Sidebar.css";

function Sidebar() {
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user);
  return (
    <div className="Sidebar">
      <div className="sidebar-logo">
        <Link to="/">{FaPrescription({})} RxConnect</Link>
      </div>
      <div className="pharmacy-info">
        {FaHospital({})}
        <div>
          <p>{user.pharmacy.name}</p>
          <p>{user.pharmacy.phone_number}</p>
        </div>
      </div>
      <nav>
        <div>
          <Link to="/">{MdDashboard({})} Dashboard</Link>
          <p>Patient Managment</p>
          <Link to="/patients">{FaUsers({})} Patients</Link>
          <Link to="/prescriptions">
            {FaPrescriptionBottle({})} Prescriptions
          </Link>
          <Link to="/transfer">{FaFilePrescription({})} Transfers</Link>
          <p>Staff Managment</p>
          <Link to="/employees">{FaUsers({})} Pharmacist & Staff</Link>
        </div>
        <div>
          <Link to="/audit_log">{TbReportAnalytics({})} Audit Log</Link>
          <Link to="/contact">{BiSupport({})} Contact & Support</Link>
          <Link to="/settings">{IoMdSettings({})} Settings</Link>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
