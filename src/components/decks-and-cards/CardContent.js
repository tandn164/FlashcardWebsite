/**
 * Displays a simple p tag.
 */

import React from 'react';

const CardContent = ({
  text,
  imageUrl,
}) => {
  return (
    <>
      {imageUrl && <div>
        <img alt="not fount" height={"250px"} src={imageUrl} />
        <br />
      </div>}
      <p className="content">
        {text}
      </p>
    </>
  );
}

export default CardContent;