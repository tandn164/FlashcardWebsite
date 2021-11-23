import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnAllDecksSnapshot = () => {
  const db = firebase.firestore();
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    let ref = db.collection('decks');
    let unsubscribe = ref.onSnapshot((snapshot) => {
      let arr = [];
      snapshot.forEach(deck => arr.push(deck.data()));
      setDecks(arr);
    }, error => console.log("Error: ", error.message))

    return () => unsubscribe();
  }, []);

  return { decks };
}

export default useOnAllDecksSnapshot;