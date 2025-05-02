import './Employees.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { useFetchByID } from "../../hooks/useFetchByID";
import fetchEmployeesByPharmacyID from "../../services/employees/getEmployees";
import { Employee } from "../../types/employees";
import { setUserID } from "../../redux/slices/userID";
import { FaSort } from 'react-icons/fa6';
import { IoMdMore } from 'react-icons/io';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoTrashSharp } from 'react-icons/io5';

function Employees() {
  const user = useSelector((state: RootState) => state.user.user);
  const [toggleOptionBox, setToggleOptionBox] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {
    data: usersData,
    isLoading,
    isError,
  } = useFetchByID({
    queryKey: "patients",
    queryFn: fetchEmployeesByPharmacyID,
    id: user.pharmacy_id,
  });

  if (isLoading) return <div>Loading employees...</div>;
  if (isError) return <div>Error loading employees.</div>;

  const users = usersData?.users || [];

  return (
    <div className="Employees">
      <div className="employees-header">
        <h3>Employees</h3>
        <Link to="/new_employee">+ Add</Link>
      </div>
      <div className="employee-wrapper">
        <div className="table">
          <div className="table-header">
            <p># <button>{FaSort({})}</button></p>
            <p>Full Name <button>{FaSort({})}</button></p>
            <p>Username <button>{FaSort({})}</button></p>
            <p>Email <button>{FaSort({})}</button></p>
            <p>Role <button>{FaSort({})}</button></p>
            <p>Action</p>
          </div>
          <div className="table-body">
            {users?.map((user: Employee, index: number) => {
              return (
                <div className="table-row" key={user.id}>
                  <p>{index + 1}</p>
                  <p>{`${user.first_name} ${user.last_name}`}</p>
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                  <p>{user.role}</p>
                  <p>
                    <button className='viewBtn'>View</button>
                    <button className='moreBtn' onClick={() => {
                        setToggleOptionBox((prevToggle) => !prevToggle)
                    }}>{IoMdMore({})}</button>
                </p>
                <div className='optionBox' style={{ display: toggleOptionBox ? "block" : "none" }}>
                    <button onClick={() => navigate(`/edit_user/${user.id}`)}>{CiEdit({})} Edit</button>
                    <button onClick={() => navigate(`/delete_user/${user.id}`)}>{IoTrashSharp({})} Delete</button>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employees;
