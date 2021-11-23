import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { firebaseAuth } from '../provider/AuthProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faReply } from '@fortawesome/free-solid-svg-icons';

import heroImage from '../images/hero.jpg';

const Home = () => {
  const { user } = useContext(firebaseAuth);
  const history = useHistory();
  if (!user) {
    history.push("/log-in");
  }
  return (
    <>
      <header className="hero">
        <section>
        <div className="hero-content">
          <div className="buttons">
          {user ? 
            <>
              <Link
                className="btn btn-cta"
                to="/app"
              >
                Dashboard
              </Link>
            </>
          :
            <>
              <Link
                className="btn btn-cta"
                to="/sign-up"
              >
                Get started
              </Link>
            </>
          }
          </div>
        </div>
        <div className="hero-content"></div>
        </section>
        <div className="card-design">
          <div>
            <span></span>
            <div>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span><FontAwesomeIcon icon={faReply} /></span>
          </div>
          <div>
            <span></span>
            <div>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span><FontAwesomeIcon icon={faReply} /></span>
          </div>
          <div>
            <span></span>
            <div>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span><FontAwesomeIcon icon={faReply} /></span>
          </div>
        </div>
      </header>
      
      <section className="public-decks">
        <h2>Public Flash Cards</h2><p>No account? No problem. Public flash cards are free for everyone to use!</p>
        <Link to="/app/d/WOJrC5Mp87qzKcka2haX" className="btn btn-tertiary">
          <span>Classical Music Composers</span> <FontAwesomeIcon icon={faAngleRight} className="icon"/>
        </Link>
        <Link to="/app/d/cYddMteaU6ZSYhyq5AHg" className="btn btn-tertiary">
          <span>Star Trek Facts & Trivia</span> <FontAwesomeIcon icon={faAngleRight} className="icon"/>
        </Link>
        <Link to="/app/d/Fd73VQwvnOoNHFrqQHW2" className="btn btn-tertiary">
          <span>Miscellaneous Trivia</span> <FontAwesomeIcon icon={faAngleRight} className="icon"/>
        </Link>
      </section>
    </>
  );
}

export default Home;