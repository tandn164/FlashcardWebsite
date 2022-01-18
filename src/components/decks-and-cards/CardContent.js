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
        <img alt="not fount" style={{maxWidth: 350, maxHeight: 250}} src={imageUrl} />
        <br />
      </div>}
      <p className="content">
        {text}
      </p>
    </>
  );
}

export default CardContent;