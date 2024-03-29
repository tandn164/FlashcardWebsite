import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

import { dbMethods } from '../../firebase/dbMethods';
import { firebaseAuth } from '../../provider/AuthProvider';
import { db } from '../../firebase/firebaseIndex';
import { useAlert } from 'react-alert';

const SelectableDeck = ({
  length,
  deck,
  setDeckToEdit,
  mine,
  userStatus,
}) => {
  const history = useHistory();
  const {user} = useContext(firebaseAuth)
  const [saved, setSaved] = useState(false);
  const savedDecksRaw = localStorage.getItem('save_decks')
  const alert = useAlert()

  useEffect(() => {
    setSaved(isSaved())
  },[])

  const isPrenium = () => {
    console.log(userStatus?.isPrenium)
    return userStatus?.isPrenium ?? false
  }

  const isSaved = () => {
    if (!savedDecksRaw || savedDecksRaw.length == 0) {
      return false
    }
    let savedDecks = JSON.parse(savedDecksRaw)
    if (!savedDecks || savedDecks.length == 0) {
      return false
    }
    let filterArray = savedDecks.filter(item => item.id == deck.id)
    return (filterArray && filterArray.length > 0)
  }

  const saveCount = () => {
    if (!savedDecksRaw || savedDecksRaw.length == 0) {
      return 0
    }
    let savedDecks = JSON.parse(savedDecksRaw)
    if (!savedDecks) {
      return 0
    }
    return savedDecks.length
  }

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
      <div
        onClick={() => {
          history.push('/app/d/'+deck.id)
        }}
      >
        {/* <input
          name={id}
          type="checkbox"
          checked={selectedDecks?.includes(id)}
          onChange={() => null}
        /> */}
        <label htmlFor="checkbox" className="truncate">
          <span></span>
          <strong>{deck.title}</strong> ({length} {"カード"})
          
        </label>
      </div>
      <div>
      <span>説明:&nbsp;</span>
      <div style={{maxWidth: 300}}>
      <text style={{fontWeight: '500', display: '-webkit-box', wordBreak: 'break-word'}}>{deck.description}</text>
        </div>
      </div>
      <div>
      保存回数: {deck.saveCount}
      </div>
      <div className="button-row">
        {mine ? <button 
          className="btn btn-icon"
          style={{color: 'black'}}
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
        style={{color: 'black'}}
        onClick={(event) => {
          event.stopPropagation();
          if (saved) {
            dbMethods.unsaveDeck(user, deck)
            setSaved(false)
          } else {
            if (isPrenium() || (saveCount() < 3)) {
              dbMethods.saveDeck(user, deck)
              setSaved(true)
            } else {
              alert.show("プレミアムにアップグレードしていない場合は、完全な機能のためにアップグレードしてください")
            }
          }
        }}
      >
        <FontAwesomeIcon icon={saved ? faTrash : faSave} /> {saved ? "削除する" : "保存する"}
      </button>
        }
      </div>
    </li>
  );
}

export default SelectableDeck;