import React, { useState, useEffect, useContext } from 'react';
import { firebaseAuth } from '../../provider/AuthProvider';
import SelectableDeck from './SelectableDeck';

const DeckList = ({
  decks,
  selectedDecks,
  setSelectedDecks,
  setDeckToEdit,
}) => {
  const [deckList, setDeckList] = useState([]);
  const { user } = useContext(firebaseAuth);

  // const toggleDeck = (deckId) => {
  //   setSelectedDecks(decks => {
  //     if (decks.includes(deckId)) {
  //       return decks.filter(ele => ele !== deckId)
  //     } else {
  //       return [...decks, deckId];
  //     }
  //   });
  // }

  useEffect(() => {
    if (!decks) {return}
    setDeckList(decks.map(deck => {
      return (
        <SelectableDeck 
          key={deck.id}
          // toggleDeck={toggleDeck}
          // selectedDecks={selectedDecks}
          length={deck.numCards}
          // setSelectedDecks={setSelectedDecks}
          deck={deck}
          mine={user && deck.owner == user.uid}
          setDeckToEdit={() => {
            setDeckToEdit({ id: deck.id, title: deck.title, private: deck.private, description: deck.description });
          }}
        />
      );}
    ));
  }, [decks]);

  return (
    <div className="deck-list">
      <ul>
        {deckList.length > 0 ? 
          deckList
        :
          <p>セットがありません。 作成して開始してください！</p>
        }
      </ul>
    </div>
  );
}

export default DeckList;