/**
 * Handles logic for getting the selected deck and cards.
 * Generates FlippableCards for each card to be shown, and 
 * renders them in a Carousel.
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase';

import { useParams } from 'react-router-dom';

import Carousel from '../Carousel';
import FlippableCard from './FlippableCard';
import Spinner from '../Spinner';

const Deck = ({ 
  onClick,
}) => {
  const [cards, setCards] = useState([]);
  const [hashCards, setHashCards] = useState(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [canView, setCanView] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const { hash } = useParams();
  const [shuffle, setShuffle] = useState(0);
  const [cardShuffle, setCardShuffle] = useState([]);

  useEffect(() => {
    setIsLoaded(false);
    setHashCards(null);
    setCards(null);

    console.log(hash)
    if (hash === undefined) return;

    const db = firebase.firestore();

    db.collection('decks').doc(hash).get()
    .then(snapshot => {
      setIsLoaded(true);
    })
    .catch(error => {
      setIsLoaded(true);
      console.log("Error: ", error.message)
    })

    let ref = db.collection('decks').doc(hash);
    ref.get()
      .then(snapshot => {
        let arr = [];
        snapshot.data().cards?.forEach(item => arr.push(item));
        setHashCards(arr);
      })
      .catch(error => console.log("Error: ", error.message))
  }, [hash]);

  useEffect(() => {
    setIsLoaded(false);
    let _cards = [];

    if (hashCards != null) {
      _cards = hashCards;
    } else {
      _cards = [];
    }

    if (_cards.length > 0) {
      setCards(_cards.map((ele) => {
        return (
          <FlippableCard 
            key={ele.id}
            frontTitle="Front"
            backTitle="Back"
            frontText={ele.front}
            backText={ele.back}
            onClick={onClick}
            isFlipped={isCardFlipped}
            setIsFlipped={setIsCardFlipped}
          />
        )
      }));
      setCardShuffle(_cards.map((ele) => {
        return (
          <FlippableCard 
            key={ele.id}
            frontTitle="Front"
            backTitle="Back"
            frontText={ele.front}
            backText={ele.back}
            onClick={onClick}
            isFlipped={isCardFlipped}
            setIsFlipped={setIsCardFlipped}
          />
        )
      }));
      setIsLoaded(true);
    }

    }, [isCardFlipped, onClick, hashCards]
  );

  if (!isLoaded) return (
    <main>
      <div className="container center">
        <Spinner />
      </div>
    </main>
  );

  if (!cards) return (
    <div className="container center">
      <p>We couldn't find this deck. :(</p>
    </div>
  )

  if (!canView || cards.length === 0) return (
      <div className="container center">
        <p>This deck is either private or has no cards! If you are the owner, you can view it and edit it from your dashboard.</p>
      </div>
  );

  const slideCallback = () => {
    setIsCardFlipped(false);
  }

  const shuffleCard = (array) => {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  } 

  return (
    <div style={{display: 'flex'}}>
      <Carousel 
            items={shuffle != 0 ? cardShuffle : cards}
            leftButtonText={<FontAwesomeIcon icon={faAngleLeft} />}
            rightButtonText={<FontAwesomeIcon icon={faAngleRight} />}
            animTime={.3}
            previousCallback={slideCallback}
            nextCallback={slideCallback}
            showButtons={true}
          />
      <div style={{ 
        background: shuffle == 0 ? 'wheat' : 'green', 
        height: 30, 
        width: 100, 
        textAlign: 'center', 
        position: 'absolute', 
        zIndex: 1 , 
        color: shuffle == 0 ? 'black' : 'white',
        marginTop: 150, 
        right: 95,
        lineHeight: 2,
        verticalAlign: 'center',
        borderRadius: 15,
        }} onClick={(event) => {
          setShuffle(0)
        }}>ソート済み</div>
      <div style={{ 
        background: shuffle != 0 ? 'wheat' : 'green', 
        height: 30, 
        width: 100, 
        textAlign: 'center', 
        position: 'absolute', 
        zIndex: 1 , 
        color: shuffle != 0 ? 'black' : 'white',
        marginTop: 100, 
        right: 95,
        lineHeight: 2,
        verticalAlign: 'center',
        borderRadius: 15,
        }} onClick={(event) => {
          setCardShuffle(shuffleCard(cardShuffle))
          setShuffle(prev => prev + 1)
        }}>シャッフル</div>
    </div>
    
  );
}

export default Deck;