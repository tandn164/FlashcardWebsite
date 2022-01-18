import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnSavedDecksSnapshot = (user) => {
  const db = firebase.firestore();
  const [saveDecks, setSaveDecks] = useState([]);

  useEffect(() => {
    if (!user) {
      setSaveDecks([]);
      return;
    }
    let ref = db.collection('decks');

    let unsubscribe = ref.where("isPublic", "==", true).onSnapshot((snapshot) => {
      let saveArr = [];
      snapshot.forEach(deck => {
        let data = {
          id: deck.id,
          ...deck.data()
        };
        if (data.saved_users?.includes(user.uid)) {
          saveArr.push(data);
        }
      });
      setSaveDecks(saveArr);
      localStorage.setItem('save_decks', JSON.stringify(saveArr))
    }, error => console.log("Error: ", error.message))

    return () => unsubscribe();
  }, [user]);

  return { saveDecks };
}

export default useOnSavedDecksSnapshot;