/**
 * A modular carousel component with wrap-around and transitions.
 */

import React, { useState, useEffect, useRef } from 'react';

/* If WRAP_BUFFER is too short, wrap-around transitions
   will be set too soon. */
const WRAP_BUFFER = 50;

const Carousel = ({
  leftButtonText="<",
  rightButtonText=">",
  animTime=.5,
  items,
  previousCallback,
  nextCallback,
  showButtons=true
}) => {
  const [index, setIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const [canSlide, setCanSlide] = useState(true);
  const carousel = useRef(null);

  // Generates the carousel items, with a cloned copy of the first and last
  // item at the beginning and end, respectively. This facilitates
  // smooth wrap-around transitions.
  useEffect(() => {
    let modifiedItems = items.map((ele) => {
      return (
        <div 
          className="carousel__item"
          key={ele.key}
        >
          {ele}
        </div>
      );
    });

    setCarouselItems(modifiedItems);
  }, [items]);

  const handleClick = (event) => {
    if (!canSlide) return;
    if (event.target.name === "right") {
      if (index == carouselItems.length - 1) { return }
      setIndex(idx => idx + 1);
      if (nextCallback !== undefined) {
        nextCallback(index-1);
      }
    } else if (event.target.name === "left") {
      if (index == 0) { return }
      setIndex(idx => idx - 1);
      if (previousCallback !== undefined) {
        previousCallback(index-1);
      }
    }
    setCanSlide(false);
    setTimeout(() => setCanSlide(true), animTime * 1000 + WRAP_BUFFER);
  }

  return (
    <div className="carousel">
      <div 
        ref={carousel}
        className="carousel__inner"
        style={{ 
          marginLeft: "calc(-100% * " + index + ")",
          width: (carouselItems.length * 100) + "%",
          transition: "margin " + animTime + "s",
       }}
      >
        {carouselItems}
      </div>
      <div className="spacer"></div>
      {showButtons &&
        <>
          {index > 0 && <button 
            className="btn-carousel left"
            onClick={(event) => handleClick(event)}
            name="left"
            disabled={!canSlide}
          >{leftButtonText}</button>}
          {index < carouselItems.length - 1 && <button 
            className="btn-carousel right"
            onClick={(event) => handleClick(event)}
            name="right"
            disabled={!canSlide}
          >{rightButtonText}</button>}
        </>
      }
    </div>
  );
}

export default Carousel;