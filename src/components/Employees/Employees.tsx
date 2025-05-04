import './Employees.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { useFetchByID } from "../../hooks/useFetchByID";
import fetchEmployeesByPharmacyID from "../../services/employees/getEmployees";
import { Employee } from "../../types/employees";
import { setUserID } from "../../redux/slices/userID";
import { FaEye, FaSort } from 'react-icons/fa6';
import { IoMdMore } from 'react-icons/io';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoTrashSharp } from 'react-icons/io5';
import { AiOutlinePlus } from 'react-icons/ai';
import formatUserRole from '../../utils/formatUserRoles';
import { FiCheckCircle } from 'react-icons/fi';

function Employees() {
  const user = useSelector((state: RootState) => state.user.user);
  const [ID, setID] = useState(null)
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
        <div className='employee-action-item'>
          <button title='New Employee' onClick={() => navigate(`/new_employee`)}>
            {AiOutlinePlus({})}
          </button>
          <button disabled={!ID} title='View Employee' onClick={() => dispatch(setUserID(ID))}>
            {FaEye({})}
          </button>
          {(formatUserRole(user.role) === "Pharmacist" || formatUserRole(user.role) === "Admin") && (
            <button disabled={!ID} title='Approve Employee'>{FiCheckCircle({})}</button>
          )}
          <button disabled={!ID} title='Edit Employee' onClick={() => navigate(`/edit_employee/${ID}`)}>
            {CiEdit({})}
          </button>
          <button disabled={!ID} title='Delete Employee' onClick={() => navigate(`/delete_employee/${ID}`)}>
            {IoTrashSharp({})}
          </button>
        </div>
      </div>
      <div className="employee-wrapper">
        <div className="table">
          <div className="table-header">
            <p># <button>{FaSort({})}</button></p>
            <p>Full Name <button>{FaSort({})}</button></p>
            <p>Username <button>{FaSort({})}</button></p>
            <p>Email <button>{FaSort({})}</button></p>
            <p>Role <button>{FaSort({})}</button></p>
            <p>Select</p>
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
                    <button
                      className='moreBtn'
                    >
                      <input
                        type='radio'
                        checked={ID === user.id}
                        onChange={() => setID(user.id)}
                      />
                    </button>
                  </p>
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
