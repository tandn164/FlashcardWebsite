import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnUserSnapshot = (user) => {
  const db = firebase.firestore();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      setUsers([])
      return
    }
    let ref = db.collection('users');
    let unsubscribe = ref.onSnapshot((snapshot) => {
      let arr = [];
      snapshot.forEach(user => {
        arr.push({
          id: user.id,
          ...user.data()
        })
      });
      setUsers(arr);
    }, error => console.log("Error: ", error.message))

    return () => unsubscribe();
  }, [user]);

  return { users };
}

export default useOnUserSnapshot;