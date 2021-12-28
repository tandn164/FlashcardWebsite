/**
 * Displays a flash card and its content.
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faTimes } from '@fortawesome/free-solid-svg-icons';

import Header from '../Header';
import CardContent from './CardContent';
import { storage } from '../../firebase/firebaseIndex';

const FlippableCard = ({
  onClick,
  frontTitle,
  backTitle,
  frontText,
  backText,
  isFlipped,
  setIsFlipped,
  imageRef,
}) => {
  const header = (
    <Header title={frontTitle}>
      <button 
        className="btn btn-icon-small"
        name="exit"
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faTimes} />&nbsp;Close
      </button>
    </Header>
  );

  const backHeader = React.cloneElement(header, { title: backTitle });

  const footer = (
    <footer>
      <button 
        className="curl"
        name="toggle"
        onClick={ () => setIsFlipped(prev => !prev) }
      >    
        <FontAwesomeIcon icon={faReply} size="2x" className="icon" />
      </button>
    </footer>
  );

  const [imageUrl, setImageUrl] = useState(null);

  useState(() => {
    if (imageRef) {
      console.log(imageRef);
      storage.ref(imageRef).getDownloadURL().then((downloadURL) => {
          setImageUrl(downloadURL)
      });
  }
  },[imageRef])
 
  return (
    <div className={isFlipped ? "flippable flipped" : "flippable"}>
      <div className="flippable__inner">
        <div className="flippable__content front">
          {header}
            <CardContent text={frontText} imageUrl={imageUrl} />
          {footer}
        </div>
        <div className="flippable__content back">
          {backHeader}
            <CardContent text={backText} />
          {footer}
        </div>
      </div>
    </div>
  );
}

export default FlippableCard;