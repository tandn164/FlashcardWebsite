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
    console.log(bgColor);
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
        <li style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
          {userName}
        </li>
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
    </div>
  );
};

export default Navlinks;
