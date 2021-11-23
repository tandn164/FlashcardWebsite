import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

import { dbMethods } from '../../firebase/dbMethods';
import { firebaseAuth } from '../../provider/AuthProvider';

const SelectableDeck = ({
  toggleDeck,
  setSelectedDecks,
  length,
  deck,
  setDeckToEdit,
  mine
}) => {
  const history = useHistory();
  const {user} = useContext(firebaseAuth)

  return (
    <li style={{background: '#EAB2AE', marginBottom: 20, borderRadius: 10}}
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
          style={{color: 'white'}}
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
        style={{color: 'white'}}
        onClick={(event) => {
          event.stopPropagation();
          dbMethods.saveDeck(user, deck)
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