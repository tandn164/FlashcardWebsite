import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnAllDecksSnapshot = (user) => {
  const db = firebase.firestore();
  const [allDecks, setDecks] = useState([]);

  useEffect(() => {
    if (!user) {
      setDecks([]);
      return;
    }
    let ref = db.collection('decks');

    let unsubscribe = ref.where("isPublic", "==", true).onSnapshot((snapshot) => {
      let arr = [];
      snapshot.forEach(deck => {
        let data = {
          id: deck.id,
          saveCount: deck.data().saved_users.length,
          ...deck.data()
        };
        arr.push(data)
      });
      setDecks(arr);
    }, error => console.log("Error: ", error.message))

    return () => unsubscribe();
  }, [user]);

  return { allDecks };
}

export default useOnAllDecksSnapshot;