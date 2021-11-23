import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnSavedDecksSnapshot = (user) => {
    const db = firebase.firestore();
    const [decks, setDecks] = useState([]);
    useEffect(() => {
      if (!user) {
        setDecks([]);
        return;
      }

      let unsubscribe = db.collection('users').doc(user.uid).onSnapshot((snapshot) => {
        let arr = [];
        snapshot.data().save_decks.forEach(deck => arr.push(deck));
        setDecks(arr)
      }, error => console.log("Error: ", error.message))
      return () => unsubscribe();
    }, [user]);
    return { decks };
  }

  export default useOnSavedDecksSnapshot;