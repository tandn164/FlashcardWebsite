import React, { useContext, useState } from 'react';
 import { Link, useHistory, Switch, Route } from 'react-router-dom';

 import { firebaseAuth } from '../../provider/AuthProvider';

 const Admin = ({
   users,
 }) => {
   const { user } = useContext(firebaseAuth);
   const history = useHistory();
   const role = localStorage.getItem('role')

   if (!user) {
     history.push("/log-in");
   }

   if (role != 'admin') {
    history.push("/");
   }

   return (
     <Switch>
       <Route path="/admin">
         <>
           <header className="hero">
             <section>
               <div className="hero-content">
                 <div className="buttons">
                   <>
                     <div
                       className="btn btn-cta"
                     >
                       ダッシュボード
                     </div>
                   </>
                 </div>
               </div>
             </section>
           </header>

           <section className="public-decks">

           </section>
         </>
       </Route>
     </Switch>
   );
 }

 export default Admin;