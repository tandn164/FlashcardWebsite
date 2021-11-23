/**
 * Displays the dashboard page.
 */

import React, { useState, useContext, useEffect } from 'react';
import { Link, Switch, Route, useHistory } from 'react-router-dom';
import { firebaseAuth } from '../provider/AuthProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom, faPlus } from '@fortawesome/free-solid-svg-icons';

import Breadcrumb from './Breadcrumb';
import DeckCreator from './decks-and-cards/DeckCreator';
import DeckEditor from './decks-and-cards/DeckEditor';
import DeckList from './decks-and-cards/DeckList';
import PageHeading from './PageHeading';

const Dashboard = ({
  onClick,
  decks,
  saveDecks,
  cards,
  selectedDecks,
  setSelectedDecks,
}) => {
  const [deckToEdit, setDeckToEdit] = useState(null);
  const { user } = useContext(firebaseAuth);
  const history = useHistory();

  if (!user) {
    history.push("/log-in");
  }

  return (
    <div className="dashboard">
        <Switch>
          <Route path="/app/edit">
            <DeckEditor
              selectedDecks={selectedDecks}
              deckToEdit={deckToEdit}
              setDeckToEdit={setDeckToEdit}
              cards={cards}
            />
          </Route>
          <Route path="/app/create">
            <PageHeading 
              title="New Deck!"
            />
            <DeckCreator />
          </Route>
          <Route path="/app">
            <div style={{ display: 'flex' }}>
              <div style={{ width: '50%', margin: '0 auto', paddingRight: 30 }}>
                <PageHeading
                  title="作ったセット"
                />
                <div>
                  <DeckList
                    decks={decks}
                    setDeckToEdit={setDeckToEdit}
                  />
                </div>
                <button
                  id="shuffle"
                  name="shuffle"
                  onClick={onClick}
                  style={{color: 'black', background: 'transparent', display: 'flex', border: 'unset', fontSize: 20, float: 'right'}}
                > もっと見る
                </button>
              </div>
              <div style={{ width: '50%', margin: '0 auto', paddingLeft: 30 }}>
                <PageHeading
                  title="保存したセット"
                />
                <div>
                  <DeckList
                    decks={saveDecks}
                  />
                </div>
                <button
                  id="shuffle"
                  name="shuffle"
                  onClick={onClick}
                  style={{color: 'black', background: 'transparent', display: 'flex', border: 'unset', fontSize: 20, float: 'right'}}
                > もっと見る
                </button>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 100, paddingLeft: 60, width: 200}}>
                <button
                  onClick={() => {
                    history.push('/app/create')
                  }}
                  style={{color: '#B02A22', background: 'transparent', display: 'flex', border: 'unset', fontSize: 30, paddingBottom: 30}}
                >
                  <><FontAwesomeIcon icon={faPlus} style={{marginRight: 5}} /> 新作</>
                </button>
                <button
                  onClick={onClick}
                  style={{color: '#B02A22', background: 'transparent', display: 'flex', border: 'unset', fontSize: 30, paddingBottom: 30}}
                >
                  <><FontAwesomeIcon icon={faPlus} style={{marginRight: 5}} /> 復習</>
                </button>
                <button
                  onClick={onClick}
                  style={{color: '#B02A22', background: 'transparent', display: 'flex', border: 'unset', fontSize: 30}}
                >
                  <><FontAwesomeIcon icon={faPlus} style={{marginRight: 5}} /> 履歴</>
                </button>
              </div>
            </div>
          </Route>
        </Switch>
    </div>
  );
}

export default Dashboard;