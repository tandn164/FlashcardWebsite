/**
 * Renders the toggleable card creator box.
 */

import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import UploadAndDisplayImage from './UploadAndDisplayImage';

const CardCreator = ({
  onCreateCard
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInput = (event) => {
    if (event.target.name === "front") {
      setFront(event.target.value);
    } else if (event.target.name === "back") {
      setBack(event.target.value);
    }
  }

  const createCard = (event) => {
    event.preventDefault();
    if (front.length <= 0 && image == null) {
      return;
    }
    if (back.length <=0 ) {
      return;
    }
    if (uploading) {
      return;
    }
    console.log("Creating new card.");
    onCreateCard(front, back, image);
    setFront("");
    setBack("");
    setImage(null);
    setIsOpen(false);
  }

  if (!isOpen) return (
    <button className="btn btn-tertiary"
      onClick={() => setIsOpen(true)}
    >
      Add card <FontAwesomeIcon icon={faPlus} className="icon" />
    </button>
  );

  return (
    <>
      <button id="add" className="btn btn-tertiary highlighted"
        onClick={() => setIsOpen(false)}
      >
        Add card <FontAwesomeIcon icon={faMinus} className="icon"/>
      </button>
      <form className="card-editor" onSubmit={createCard}>
        <div className="input-block">
          <textarea
            name="front"
            id="new-front"
            value={front}
            onChange={handleInput}
          />
          <label htmlFor="new-front">Front</label>
        </div>
        <div className="input-block">
          <textarea
            name="back"
            id="new-back"
            value={back}
            onChange={handleInput}
            style={{outline: "none"}}
          />        
          <label htmlFor="new-back">Back</label>
        </div>
        <UploadAndDisplayImage onSetImage={(image)=>{
            setImage(image);
        }} imageRef={image} onUploadingImage={setUploading}/>
        <button className="btn">Create</button>
      </form>
    </>
  );
}

export default CardCreator;