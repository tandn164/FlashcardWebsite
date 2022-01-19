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
 
 const Upgrade = ({
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
           <Route exact path="/upgrade">
             <div>
               <PageHeading
                 title="アップグレード"
               />
               <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                 <div>{`利用可能なお金: ${userStatus?.coin ?? 0} 円`}</div>
                 <button style={{width: 100, height: 30, borderRadius: 10, background: 'green', color: 'white', fontSize: 10}} onClick={() => {
                   history.push('/buy-coin')
                 }}>お金を入金する</button>
               </div>
               <h3>
                   {isPrenium() ? "現在プレミアム機能を使用しています" : "現在トライアル機能を使用しています"}
               </h3>
               {!isPrenium() && <div className="account-data">
                   <h4>これらの機能のロックを解除するには、100円/月でプレミアムにアップグレードしてください： </h4>
                   <h5 style={{color: 'green'}}>・フラッシュカードの無制限の作成セット</h5>
                   <h5 style={{color: 'orange'}}>・他の人のフラッシュカードのセットを無制限に保存</h5>
                   <button className="btn btn-tertiary" onClick={() => {
                       if ((userStatus?.coin ?? 0) < 100) {
                           alert.show("お金が足りない場合は、アップグレードするためにお金を追加入金してください")
                       } else {
                           dbMethods.updateUser(user, userStatus?.coin - 100, true)
                       }
                   }}>
                     <span>100円/月でプレミアムにアップグレード</span><FontAwesomeIcon icon={faAngleRight} className="icon" />
                   </button>
               </div>}
               <h4>これらの機能のロックを解除するには、500円/月でVIPにアップグレードしてください： </h4>
                   <h5 style={{color: 'green'}}>・フラッシュカードのテストをカスタマイズします</h5>
                   <h5 style={{color: 'orange'}}>・フラッシュカードからコンテストを作成する</h5>
                   <h5 style={{color: 'blue'}}>・セットをダウンロードし、テストし、doc、pdf、..でコンテストします</h5>
                   <button className="btn btn-tertiary" onClick={() => {
                       alert.show('機能は開発中です')
                    }}>
                     <span>500円/月でVIPにアップグレード</span><FontAwesomeIcon icon={faAngleRight} className="icon" />
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
 
 export default Upgrade;