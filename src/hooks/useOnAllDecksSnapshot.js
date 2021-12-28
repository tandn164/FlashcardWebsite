import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnAllDecksSnapshot = () => {
  const db = firebase.firestore();
  const [allDecks, setDecks] = useState([]);

  useEffect(() => {
    let ref = db.collection('decks');
    let unsubscribe = ref.where("isPublic", "==", true).onSnapshot((snapshot) => {
      let arr = [];
      snapshot.forEach(deck => arr.push(deck.data()));
      setDecks(arr);
    }, error => console.log("Error: ", error.message))

    return () => unsubscribe();
  }, []);

  return { allDecks };
}

export default useOnAllDecksSnapshot;