import { useSelector } from 'react-redux';
import SearchForm from '../SearchForm/SearchForm'
import './Header.css'
import { RootState } from '../../redux/store';

function Header() {
    const user = useSelector((state: RootState) => state.user.user);

    const firstNameInitial = user?.first_name.charAt(0).toUpperCase();
    const lastNameInitial = user?.last_name.charAt(0).toUpperCase();

    return (
        <div className='Header'>
            <div className='header-left'>
                <SearchForm />
            </div>
            <button>{firstNameInitial}{lastNameInitial}</button>
        </div>
    )
}

export default Header