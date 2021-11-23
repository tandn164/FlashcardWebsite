import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnSavedDecksSnapshot = (user) => {
    const db = firebase.firestore();
    const [saveDecks, setDecks] = useState([]);
    useEffect(() => {
      if (!user) {
        setDecks([]);
        return;
      }

      let unsubscribe = db.collection('users').doc(user.uid).onSnapshot((snapshot) => {
        let arr = [];
        snapshot.data().save_decks.forEach(deck => arr.push(deck));
        setDecks(arr)
        localStorage.setItem('save_decks', JSON.stringify(arr))
      }, error => console.log("Error: ", error.message))
      return () => unsubscribe();
    }, [user]);
    return { saveDecks };
  }

  export default useOnSavedDecksSnapshot;