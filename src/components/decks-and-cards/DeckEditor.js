import React, { useState, useContext } from 'react';
import { firebaseAuth } from '../../provider/AuthProvider';
import { dbMethods } from '../../firebase/dbMethods';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading } from '@fortawesome/free-solid-svg-icons';

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

  const updateDeck = (event) => {
    event.preventDefault();
    dbMethods.updateDeck(user, deck.id, title)
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
    <>
      <PageHeading
        title="Edit deck."
        subtitle="Update the title and privacy status of your deck."
      />
      <form onSubmit={updateDeck}>
        <TextInput 
          labelText="Title"
          icon={<FontAwesomeIcon icon={faHeading} />}
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New Deck"
          autocomplete="off"
        />
        <button
          className="btn btn-primary"
        >
          {updateSuccess ? "Success!" : "Update" }
        </button>
      </form>
      <div>
        <PageHeading 
          title="カード"
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
          title="Delete deck."
        />
        <form onSubmit={deleteDeck}>
          <button
            className="btn btn-warning"
          >Delete</button>
        </form>
      </div>
    </>
  );
}

export default DeckEditor;