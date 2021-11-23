/**
 * Displays a heading with a subtitle.
 */

import React from 'react';

const PageHeading = ({
  title,
  styles = {textAlign: 'center'}
}) => {
  let titleElement = null;
  titleElement=<h1 style={styles}>{title}</h1>

  return (
    <header className="page-heading">
      {titleElement}
    </header>
  )
}

export default PageHeading;