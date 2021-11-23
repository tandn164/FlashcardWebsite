/**
 * Displays each deck list item which contains a checkbox,
 * edit and share buttons.
 */

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

import Lightbox from '../Lightbox';

const SelectableDeck = ({
  toggleDeck,
  setSelectedDecks,
  length,
  deck,
  setDeckToEdit,
  mine
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
          <strong>{deck.title}</strong> ({length} {length === 1 ? "card" : "cards"})
          
        </label>
      </div>
      <div className="button-row">
        {mine ? <button 
          className="btn btn-icon"
          onClick={(event) => {
            event.stopPropagation();
            setDeckToEdit();
            localStorage.setItem('deck', JSON.stringify(deck));
            history.push("/app/edit");
          }}
        >
          <FontAwesomeIcon icon={faEdit} /> 編集する
        </button>
        : <button 
        className="btn btn-icon"
        onClick={(event) => {
          event.stopPropagation();
          // setDeckToEdit();
          // setSelectedDecks([id]);
          // history.push("/app/edit");
        }}
      >
        <FontAwesomeIcon icon={faSave} /> 保存する
      </button>
        }
      </div>
    </li>
  );
}

export default SelectableDeck;