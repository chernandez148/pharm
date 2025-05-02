import { useDispatch, useSelector } from "react-redux";
import SearchForm from "../SearchForm/SearchForm";
import "./Header.css";
import { RootState } from "../../redux/store";
import { useState } from "react";
import { setUser } from "../../redux/slices/user";
import { CiBellOn } from "react-icons/ci";
import formatUserRole from "../../utils/formatUserRoles";

function Header() {
  const user = useSelector((state: RootState) => state.user.user);
  const [modalBoxToggle, setModalBoxToggle] = useState(false);
  const dispatch = useDispatch();

  const firstNameInitial = user?.first_name.charAt(0).toUpperCase();
  const lastNameInitial = user?.last_name.charAt(0).toUpperCase();

  const handleModalBox = () => {
    setModalBoxToggle((prevToggle) => !prevToggle);
  };

  return (
    <div className="Header">
      <div className="header-left">
        <SearchForm />
      </div>
      <div className="header-right">
        <button>{CiBellOn({})}</button>
        <div className="employee-info">
            <button className="profile-btn" onClick={() => handleModalBox()}>
                {firstNameInitial}
                {lastNameInitial}
            </button>
            <div className="employee-name">
                <p>{user.first_name} {user.last_name}</p>
                <p>{formatUserRole(user.role)}</p>
            </div>
        </div>
 
      </div>
      <div
        className="logout-btn"
        style={{ display: modalBoxToggle ? "flex" : "none" }}
      >
        <button
          onClick={() => {
            dispatch(setUser(null));
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
