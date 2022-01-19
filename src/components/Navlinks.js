import React, {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";

const Navlinks = ({ closeMenu, userName }) => {
  const [firstChar, setFirstChar] = useState('');
  const [bgColor, setBgColor] = useState('');

  const getFirstChar = () => {
    if (userName) {
      setFirstChar(userName.charAt(0).toUpperCase());
    }
  }

  useEffect(() => {
    setBgColor('#' + getRandomColor());
    getFirstChar();
  },[userName]);

  const getRandomColor = () => {
    return Math.floor(Math.random()*16777215).toString(16)
  }

  return (
    <div style={{position: 'relative', display: 'flex'}}>
      <div className="avatar-btn" style={{backgroundColor: `${bgColor}`}}>
        <div className="name">{firstChar}</div>
      </div>
      <div className="avt-links">
        <ul>
        <li>
          <NavLink
            to="/my-account"
            className="link"
            onClick={() => closeMenu()}
          >
            プロフィール
          </NavLink>
        </li>
        <li>
          <NavLink to="/log-out" className="link" onClick={() => closeMenu()}>
            ログアウト
          </NavLink>
        </li>
        </ul>
      </div>
      <div style={{height: '36px', display: 'flex', alignItems: 'center', marginLeft: '8px', fontSize: '20px', color: 'white'}}>{userName}</div>
    </div>
  );
};

export default Navlinks;
