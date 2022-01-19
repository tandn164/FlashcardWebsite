import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnDecksSnapshot = (user) => {
  const db = firebase.firestore();
  const [decks, setDecks] = useState([]);

  // Get decks from collection where owner is the current user.
  useEffect(() => {
    if (!user) {
      setDecks([])
      return
    }
    let ref = db.collection('decks');    
    let unsubscribe = ref.onSnapshot((snapshot) => {
      let arr = [];
      snapshot.forEach(deck => arr.push({
        id: deck.id,
        ...deck.data()
      }));
      setDecks(arr);
    }, error => console.log("Error: ", error.message))

    return () => unsubscribe();
  }, [user]);

  return { decks };
}

export default useOnDecksSnapshot;