/**
 * Displays the footer.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer>
      <section>
        <span className="logo">Flash Cards</span>
      </section>
    </footer>
  );
}

export default Footer;