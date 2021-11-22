/**
 * Displays a heading with a subtitle.
 */

import React from 'react';

const PageHeading = ({
  title,
}) => {
  let titleElement = null;
  titleElement=<h1 style={{textAlign: 'center'}}>{title}</h1>

  return (
    <header className="page-heading">
      {titleElement}
    </header>
  )
}

export default PageHeading;