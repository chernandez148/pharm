import { useDispatch, useSelector } from 'react-redux';
import SearchForm from '../SearchForm/SearchForm'
import './Header.css'
import { RootState } from '../../redux/store';
import { useState } from 'react';
import { setUser } from '../../redux/slices/user';

function Header() {
    const user = useSelector((state: RootState) => state.user.user);
    const [modalBoxToggle, setModalBoxToggle] = useState(false)
    const dispatch = useDispatch()

    const firstNameInitial = user?.first_name.charAt(0).toUpperCase();
    const lastNameInitial = user?.last_name.charAt(0).toUpperCase();

    const handleModalBox = () => {
        setModalBoxToggle((prevToggle) => !prevToggle)
    }

    return (
        <div className='Header'>
            <div className='header-left'>
                <SearchForm />
            </div>
            <button className='profile-btn' onClick={() => handleModalBox()}>{firstNameInitial}{lastNameInitial}</button>
            <div className='logout-btn' style={{ display: modalBoxToggle ? "flex" : "none" }}>
            <button  onClick={() => {
        dispatch(setUser(null))
        localStorage.removeItem("user")
        localStorage.removeItem("access_token")
      }}>Logout</button>
            </div>
        </div>
    )
}

export default Header