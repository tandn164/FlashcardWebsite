 import React, { useState, useContext, useEffect } from 'react';
 import { Link, Switch, Route, useHistory } from 'react-router-dom';
 import { firebaseAuth } from '../provider/AuthProvider';
  
 import DeckList from './decks-and-cards/DeckList';
 import PageHeading from './PageHeading';
 
 const SavedDecks = ({
   saveDecks,
 }) => {
   const { user } = useContext(firebaseAuth);
   const history = useHistory();
 
   if (!user) {
     history.push("/log-in");
   }
 
   return (
     <div className="dashboard">
         <Switch>
           <Route path="/app/saved">
             <div style={{ display: 'flex' }}>
               <div style={{ width: '100%', margin: '0 auto', paddingRight: 30 }}>
                 <PageHeading
                   title="保存したセット"
                 />
                 <div>
                   <DeckList
                     decks={saveDecks}
                   />
                 </div>
               </div>
             </div>
           </Route>
         </Switch>
     </div>
   );
 }
 
 export default SavedDecks;