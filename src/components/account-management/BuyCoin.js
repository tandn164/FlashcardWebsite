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
import { useAlert } from 'react-alert';
import { dbMethods } from '../../firebase/dbMethods';
 
 const BuyCoin = ({
    userStatus,
  }) => {
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

   const alert = useAlert();
 
   const handleChange = e => {
     const { name, value } = e.target;
     setInputs(prev => ({ ...prev, [name]: value }));
   }
 
   if (!user) {
     history.push("/log-in");
   }

   const isPrenium = () => {
       return userStatus?.isPrenium ?? false
   }
 
   return (
     <div className="my-account">
       <div className="my-account-inner" style={{width: '50%', margin: '0 auto'}}>
         <Switch>
           <Route exact path="/buy-coin">
             <div>
               <PageHeading
                 title="コインを買う"
               />
               <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                 <div>{`利用可能なコイン: ${userStatus?.coin ?? 0} コイン`}</div>
                 <button style={{width: 100, height: 30, borderRadius: 10, background: 'rgb(234, 178, 174)', fontSize: 10}} onClick={() => {
                     history.push('/upgrade')
                  }}>アップグレード</button>
               </div>
               <div className="account-data">
                   <h4>100コインを買う</h4>
                   <button className="btn btn-tertiary" onClick={() => {
                       dbMethods.updateUser(user, (userStatus?.coin?? 0) + 100, userStatus?.isPrenium ?? false)
                    }}>
                     <span>50円から100コイン買う</span><FontAwesomeIcon icon={faAngleRight} className="icon" />
                   </button>
               </div>
               <h4>1000コインを買う</h4>
                   <button className="btn btn-tertiary" onClick={() => {
                       dbMethods.updateUser(user, (userStatus?.coin?? 0) + 1000, userStatus?.isPrenium ?? false)
                    }}>
                     <span>500円から1000コイン買う</span><FontAwesomeIcon icon={faAngleRight} className="icon" />
                   </button>
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
 
 export default BuyCoin;