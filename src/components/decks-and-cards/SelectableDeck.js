/**
 * Displays each deck list item which contains a checkbox,
 * edit and share buttons.
 */

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faShare, faClone } from '@fortawesome/free-solid-svg-icons';

import Lightbox from '../Lightbox';

const SelectableDeck = ({
  title,
  toggleDeck,
  id,
  setSelectedDecks,
  length,
  setDeckToEdit
}) => {
  const history = useHistory();

  return (
    <li 
      // className={selectedDecks?.includes(id) ? "selected" : ""}
      // onClick={(event) => {
      //   event.stopPropagation();
      //   toggleDeck(id);
      // }}
      // role="checkbox"
      // aria-checked={selectedDecks?.includes(id) ? "true" : "false"}
    >
      <div>
        {/* <input
          name={id}
          type="checkbox"
          checked={selectedDecks?.includes(id)}
          onChange={() => null}
        /> */}
        <label htmlFor="checkbox" className="truncate">
          <span></span>
          <strong>{title}</strong> ({length} {length === 1 ? "card" : "cards"})
          
        </label>
      </div>
      <div className="button-row">
        <button 
          className="btn btn-icon"
          onClick={(event) => {
            event.stopPropagation();
            setDeckToEdit();
            setSelectedDecks([id]);
            history.push("/app/edit");
          }}
        >
          <FontAwesomeIcon icon={faEdit} /> Edit
        </button>
        
        {/* <button 
          className="btn btn-icon"
          name="share-deck"
          value={id}
          onClick={event => {
            event.stopPropagation();
            setShareIsOpen(prev => !prev);
          }}
        >
          <FontAwesomeIcon icon={faShare} /> Share
        </button> */}
      </div>
    </li>
  );
}

export default SelectableDeck;