import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnAllDecksSnapshot = (user) => {
  const db = firebase.firestore();
  const [allDecks, setDecks] = useState([]);
  const [saveDecks, setSaveDecks] = useState([]);

  useEffect(() => {
    if (!user) {
      setDecks([]);
      setSaveDecks([]);
      return;
    }
    let ref = db.collection('decks');
    let unsubscribe = ref.where("isPublic", "==", true).onSnapshot((snapshot) => {
      let arr = [];
      let saveArr = [];
      snapshot.forEach(deck => {
        let data = {
          id: deck.id,
          ...deck.data()
        };
        arr.push(data)
        if (data.saved_users?.includes(user.uid)) {
          saveArr.push(data);
        }
      });
      setDecks(arr);
      setSaveDecks(saveArr);
      localStorage.setItem('save_decks', JSON.stringify(saveArr))
    }, error => console.log("Error: ", error.message))

    return () => unsubscribe();
  }, []);

  return { allDecks, saveDecks };
}

export default useOnAllDecksSnapshot;