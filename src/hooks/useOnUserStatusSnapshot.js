import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnUserStatusSnapshot = (user) => {
    const db = firebase.firestore();
    const [userStatus, setUserStatus] = useState();
  
    useEffect(() => {
      if (!user) {
        setUserStatus([]);
        return;
      }
  
      let ref = db.collection('users');
      let unsubscribe = ref.doc(user.uid).onSnapshot((snapshot) => {
        let status = {
          isActive: snapshot.data().isActive,
          isPrenium: snapshot.data().isPrenium,
          coin: snapshot.data().coin
        }
        setUserStatus(status)
        localStorage.setItem('isActive', JSON.stringify(snapshot.data().isActive))
        localStorage.setItem('isPrenium', JSON.stringify(snapshot.data().isPrenium))
        localStorage.setItem('coin', JSON.stringify(snapshot.data().coin))
      }, error => console.log("Error: ", error.message))
  
      return () => unsubscribe();
    }, []);
  
    return { userStatus };
  }

  export default useOnUserStatusSnapshot;