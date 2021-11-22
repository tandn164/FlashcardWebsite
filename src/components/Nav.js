import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { firebaseAuth } from '../provider/AuthProvider';


import Navlinks from './Navlinks';

const Nav = ({
  onClick,
  isMenuOpen,
  mobile=false
}) => {
  const [navClasses, setNavClasses] = useState("navbar");
  const btnClasses= "btn btn-hamburger small-screen-only " + (isMenuOpen && "open"); 
  let location = useLocation();
  const { user } = useContext(firebaseAuth);

  useEffect(() => {

    if (mobile) {
      setNavClasses("navbar");
      return;
    }

    if (location.pathname !== "/") {
      setNavClasses("navbar light");
      return;
    }

    setNavClasses("navbar");
  }, [location, mobile])

  if (!user) {
    return null
  }

  return (
    <header className={navClasses} style={{background: '#526CC6'}}>
      <div className="navbar-inner">
        <Link to="/" className="logo">
          Flash Cards
        </Link>
        <div className="right-nav">
          <nav className="large-screen-only">
            <Navlinks closeMenu={() => null}/>
          </nav>
          <button 
            className={btnClasses}
            name="toggle-menu"
            onClick={onClick}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Nav;