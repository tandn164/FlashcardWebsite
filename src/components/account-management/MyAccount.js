/**
 * Shows the My Account page and sets up the useAuth
 * hook to be used on ChangePassword, UpdateEmail and
 * DeleteAccount components.
 */

import React, { useState, useContext, useEffect } from 'react';
import { firebaseAuth } from '../../provider/AuthProvider';
import { Link, Switch, Route, useHistory } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faTrash } from '@fortawesome/free-solid-svg-icons';

import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import PageHeading from '../PageHeading';
import UpdateProfile from './UpdateProfile';

const MyAccount = () => {
  const { user } = useContext(firebaseAuth);
  const [inputs, setInputs] = useState({ 
    email: user.email || "",
    password: "", 
    newPassword: "", 
    username: user.displayName || "", 
    avatarUrl: user.photoUrl || ""});

  const { 
    loading, 
    error, 
    status, 
    handleChangeEmail, 
    handleChangePassword, 
    handleDeleteAccount,
    resetStatus
  } = useAuth(inputs.username, inputs.email, inputs.password, inputs.newPassword);

  const history = useHistory();

  const handleChange = e => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  }

  if (!user) {
    history.push("/log-in");
  }

  return (
    <div className="my-account">
      <div className="my-account-inner" style={{width: '50%', margin: '0 auto'}}>
        <Switch>
          <Route exact path="/my-account">
            <div>
              <PageHeading
                title="アカウント"
              />
              <div className="account-data">
                  <Link to="/my-account/change-email" className="btn btn-tertiary">
                    <span>メールを更新する</span><FontAwesomeIcon icon={faAngleRight} className="icon" />
                  </Link>
              </div>
              <div className="account-data">
                <Link to="/my-account/change-password" className="btn btn-tertiary">
                  <span>パスワードを変更してください</span><FontAwesomeIcon icon={faAngleRight} className="icon" />
                </Link>
              </div>
              <div className="account-data">
                <Link to="/my-account/delete-account" className="btn btn-warning">
                  <FontAwesomeIcon icon={faTrash} />&nbsp;&nbsp;&nbsp;アカウントを削除する
                </Link>
              </div>
            </div>
          </Route>

          <Route exact path="/my-account/change-email">
            <UpdateProfile 
              handleChange={handleChange}
              inputs={inputs}
              loading={loading}
              onSubmit={handleChangeEmail}
              error={error}
              status={status}
              onBack={resetStatus}
            />
          </Route>

          <Route exact path="/my-account/change-password">
            <ChangePassword 
              handleChange={handleChange}
              loading={loading}
              inputs={inputs}
              onSubmit={handleChangePassword}
              error={error}
              status={status}
            />
          </Route>
          
          <Route exact path="/my-account/delete-account">
            <DeleteAccount 
              handleChange={handleChange}
              inputs={inputs}
              onSubmit={handleDeleteAccount}
              error={error}
            />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default MyAccount;