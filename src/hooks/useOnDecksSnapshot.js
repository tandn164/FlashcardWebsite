import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnDecksSnapshot = (user) => {
  const db = firebase.firestore();
  const [decks, setDecks] = useState([]);

  // Get decks from collection where owner is the current user.
  useEffect(() => {
    if (!user) {
      setDecks([]);
      return;
    }

    let ref = db.collection('decks');
    let unsubscribe = ref.where("owner", "==", user.uid).onSnapshot((snapshot) => {
      let arr = [];
      snapshot.forEach(deck => arr.push({
        id: deck.id,
        saveCount: deck.data().saved_users?.length ?? 0,
        ...deck.data()
      }));
      setDecks(arr);
    }, error => console.log("Error: ", error.message))

    return () => unsubscribe();
  }, [user]);

  return { decks };
}

export default useOnDecksSnapshot;