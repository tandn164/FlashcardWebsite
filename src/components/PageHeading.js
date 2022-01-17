/**
 * Displays a heading with a subtitle.
 */

import React from 'react';

const PageHeading = ({
  title,
  subTitle,
  styles = {textAlign: 'center'},
  subTitleStyles = {textAlign: 'center'},
}) => {
  let titleElement = null;
  titleElement=<h1 style={styles}>{title}</h1>

  return (
    <header className="page-heading">
      {titleElement}
      {subTitle != null && <h5 style={subTitleStyles}>{subTitle}</h5>}
    </header>
  )
}

export default PageHeading;