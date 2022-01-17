import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { firebaseAuth } from '../provider/AuthProvider';


import Navlinks from './Navlinks';
import TextInput from './TextInput';

const Nav = ({
  onClick,
  isMenuOpen,
  mobile=false,
  onSearch,
}) => {
  const [navClasses, setNavClasses] = useState("navbar");
  const btnClasses= "btn btn-hamburger small-screen-only " + (isMenuOpen && "open"); 
  let location = useLocation();
  const { user } = useContext(firebaseAuth);
  const [searchText, setSearchText] = useState('');

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
        <div className="logo">
        <Link to="/" className="logo" >
        ディスカバリー
        </Link>
        <div style={{height: 30, width: 2, backgroundColor: 'black', marginLeft: 20, marginRight: 20}}></div>
        <Link to="/app" className="logo">
          私のフラッシュカード
        </Link>
          </div>
          <input
          style={{outline: 'unset', height: 30, borderRadius: 15, paddingLeft: 10, borderColor: 'white'}}
          id="search"
          name="search"
          placeholder='検索する'
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value)
            onSearch(e.target.value)
          }}
        />
          
        <div className="right-nav">
          <nav className="large-screen-only">
            <Navlinks closeMenu={() => null } userName={user.displayName}/>
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