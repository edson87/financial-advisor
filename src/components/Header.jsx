import {Link} from "react-router-dom";

import '../styles/Header.scss';
import HomeImage from '../assets/images/home.ico'

function Header() {
    return (
        <header className="header">
            <Link to='/'>
                <button className='float-start'> 
                    <img src={HomeImage} alt="Home" className='home' /> 
                </button>
            </Link>
            <span className='title'>Financial Advisor</span>
        </header>
    );
}

export default Header;