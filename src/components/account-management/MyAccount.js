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

const MyAccount = ({userStatus}) => {
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

  const isPrenium = () => {
    return userStatus?.isPrenium ?? false
  }
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
                subTitle={isPrenium() ? "プレミアム" : "トライアル"}
                subTitleStyles={{color: isPrenium() ? 'green' : 'red', textAlign: 'center'}}
              />
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <div>{`利用可能なコイン: ${userStatus?.coin ?? 0} コイン`}</div>
                <button style={{width: 100, height: 30, borderRadius: 10, background: 'green', color: 'white', fontSize: 10}} onClick={() => {
                  history.push('/buy-coin')
                }}>コインを買う</button>
                <button style={{width: 100, height: 30, borderRadius: 10, background: 'rgb(234, 178, 174)', fontSize: 10}} onClick={() => {
                  history.push('/upgrade')
                }}>アップグレード</button>

              </div>
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