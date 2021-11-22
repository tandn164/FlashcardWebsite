import React from 'react';
import { NavLink } from 'react-router-dom';

const Navlinks = ({
  closeMenu
}) => {
  return (
    <ul>
        <li>
          <NavLink to="/my-account" className="link" onClick={() => closeMenu()}>
            My account
          </NavLink>
        </li>
        <li>
          <NavLink to="/log-out" className="link" onClick={() => closeMenu()}>
            Log out
          </NavLink>
        </li>
    </ul>
  )
}

export default Navlinks;