/**
 * Handles the creation of new decks.
 */

import React, { useState, useContext } from 'react';
import { dbMethods } from '../../firebase/dbMethods';
import { firebaseAuth } from '../../provider/AuthProvider';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHeading, faNotesMedical, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import TextInput from '../TextInput';

const DeckCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(firebaseAuth);
  const history = useHistory();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const createDeck = (event) => {
    event.preventDefault();
    dbMethods.createDeck(user, title, description);
    setUpdateSuccess(true);
    history.push("/app");
  }

  return (
    <form 
      id="new-deck" 
      onSubmit={createDeck}
    >
      <TextInput 
        labelText="題名"
        icon={<FontAwesomeIcon icon={faPaperclip} />}
        id="title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
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
      <button className="btn btn-primary">
          {updateSuccess ? "Success!" : "作成" }
      </button>
    </form>
  );
}

export default DeckCreator;