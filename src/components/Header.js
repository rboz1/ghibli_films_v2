import React from 'react';
import {ReactComponent as Logo} from './TotoroLogo.svg';
import '../styles/Header.css';

const Header = () => {
    return(
        <header>
            <nav>
                <Logo />
                <h1>Ghibli Film Library</h1>
            </nav>
        </header>
    )
}

export default Header;