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

  const onCreateCard = (front, back, imageRef) => {
    let newCard = {front: front, back: back, imageRef: imageRef}
    console.log(28888, newCard);
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

  const onUpdateCard = (index, front, back, imageRef) => {
    cards[index] = {front: front, back: back, imageRef: imageRef};
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
      console.log(ele);
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