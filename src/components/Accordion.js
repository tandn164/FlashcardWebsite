/**
 * Generates and displays all the toggleable card editor boxes
 * in an accordion.
 */

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import CardEditor from './decks-and-cards/CardEditor';
import CardCreator from './decks-and-cards/CardCreator';

const Accordion = ({
  listCards,
  onCards,
}) => {
  const [cards, setCards] = useState(listCards || []);
  const [card, setCard] = useState(-1);
  const [cardEditorElements, setCardEditorElements] = useState([]);

  const handleClick = (event) => {
    console.log(event.target.value)
    setCard(prev => prev === event.target.value ? -1 : event.target.value);
  }

  const onCreateCard = (front, back) => {
    let newCard = {front: front, back: back}
    cards.push(newCard)
    setCards(cards)
    onCards(cards)
    updateElements()
  }

  const onDeleteCard = (index) => {
    cards.splice(index, 1);
    setCards(cards)
    onCards(cards)
    updateElements()
  }

  const onUpdateCard = (index, front, back) => {
    cards[index] = {front: front, back: back};
    setCards(cards)
    onCards(cards)
    updateElements()
  }

  useEffect(() => {
    setCards(listCards)
  },[listCards])

  useEffect(() => {
    updateElements()
  }, [card, cards]);

  const updateElements = () => {
    const elements = cards.map( (ele, index) => {
      let classes = index === card ? "btn btn-tertiary highlighted" : "btn btn-tertiary";
      console.log(index)
      return (
        <React.Fragment key={index} >
          <button 
            className={classes}
            value={index}
            onClick={handleClick}
          >
            <span className="truncate">"{ele.front}"</span> 
            {card === `${index}` ?
              <FontAwesomeIcon icon={faAngleUp} />
            :
              <FontAwesomeIcon icon={faAngleDown} />
            }
          </button>
          {card === `${index}` && 
            <CardEditor
              index={index}
              card={ele}
              onSubmit={() => setCard("")}
              onDelete={onDeleteCard}
              onUpdate={onUpdateCard}
            />
          }
        </React.Fragment>
      )
    })

    setCardEditorElements(elements);
  }

  return (
    <>
      {cardEditorElements}
      <CardCreator
        onCreateCard={onCreateCard}
      />
    </>
  );
}

export default Accordion;