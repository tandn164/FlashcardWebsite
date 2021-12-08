import React, { useState, useContext, useEffect } from 'react';
import { firebaseAuth } from '../../provider/AuthProvider';
import { dbMethods } from '../../firebase/dbMethods';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHeading, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import Accordion from '../Accordion';
import PageHeading from '../PageHeading';
import TextInput from '../TextInput';
import firebase from 'firebase';

const DeckEditor = ({
  deckToEdit,
  setDeckToEdit,
}) => {
  const { user } = useContext(firebaseAuth);
  const history = useHistory();
  const localDeck = JSON.parse(localStorage.getItem('deck'))
  const deck = deckToEdit || localDeck;
  const [title, setTitle] = useState(deck.title);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [description, setDescription] = useState(deck.description);
  const [listCards, setListCards] = useState([])

  const updateDeck = () => {
    dbMethods.updateDeck(user, deck.id, title, description, listCards)
    setDeckToEdit({...deckToEdit, title});
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  }

  const deleteDeck = (event) => {
    event.preventDefault();
    dbMethods.deleteDeck(user, deck.id);
    history.push('/app');
    setDeckToEdit(null);
  }

  const db = firebase.firestore();

  useEffect(() => {
    if (!deck) {
      return
    }
    console.log(deck)
    let ref = db.collection('decks').doc(deck.id);
    ref.get()
      .then(snapshot => {
        let arr = [];
        snapshot.data().cards?.forEach(item => arr.push(item));
        setListCards(arr);
      })
      .catch(error => console.log("Error: ", error.message))
  }, [])

  const onUpdateCards = (cards) => {
    setListCards(cards)
  }

  const onUpdateDecks = (event) => {
    updateDeck();
  }

  return (
    <div style={{textAlign: 'left'}}>
      <PageHeading
        title="セットを編集する"
        styles={{textAlign: 'left'}}
      />
      <form onSubmit={updateDeck}>
        <TextInput 
          labelText="題名"
          icon={<FontAwesomeIcon icon={faPaperclip} />}
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New Deck"
          autocomplete="off"
        />
        <TextInput 
        labelText="説明"
        icon={<FontAwesomeIcon icon={faBook} />}
        id="description"
        name="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        autocomplete="off"
        />
      </form>
      <div>
        <PageHeading 
          title="カード"
          styles={{textAlign: 'left'}}
        />
        <Accordion
          listCards={listCards}
          onCards={onUpdateCards}
        />
      </div>
      <button
          className="btn btn-primary"
          onClick={onUpdateDecks}
        >
          {updateSuccess ? "Success!" : "編集" }
        </button>
      <div>
        <PageHeading 
          title="デッキを削除する"
          styles={{textAlign: 'left'}}
        />
        <form onSubmit={deleteDeck}>
          <button
            className="btn btn-warning"
          >削除する</button>
        </form>
      </div>
    </div>
  );
}

export default DeckEditor;