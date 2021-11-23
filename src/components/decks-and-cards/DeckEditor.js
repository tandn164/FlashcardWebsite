import React, { useState, useContext } from 'react';
import { firebaseAuth } from '../../provider/AuthProvider';
import { dbMethods } from '../../firebase/dbMethods';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHeading, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import Accordion from '../Accordion';
import CardCreator from './CardCreator';
import PageHeading from '../PageHeading';
import TextInput from '../TextInput';

const DeckEditor = ({
  selectedDecks,
  deckToEdit,
  setDeckToEdit,
  cards
}) => {
  const { user } = useContext(firebaseAuth);
  const history = useHistory();
  const localDeck = JSON.parse(localStorage.getItem('deck'))
  const deck = deckToEdit || localDeck;
  const [title, setTitle] = useState(deck.title);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [description, setDescription] = useState(deck.description);

  const updateDeck = (event) => {
    event.preventDefault();
    dbMethods.updateDeck(user, deck.id, title, description)
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
        <button
          className="btn btn-primary"
        >
          {updateSuccess ? "Success!" : "編集" }
        </button>
      </form>
      <div>
        <PageHeading 
          title="カード"
          styles={{textAlign: 'left'}}
        />
        <Accordion
          deckId={selectedDecks[0]}
          cards={cards}
        />
        <CardCreator 
          deckId={selectedDecks[0]}
        />
      </div>
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