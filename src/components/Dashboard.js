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
import SavedDecks from './SavedDecks';
import CreatedDecks from './CreatedDecks';
import Deck from './decks-and-cards/Deck';
import Test from './decks-and-cards/Test';

const Dashboard = ({
  onClick,
  decks,
  saveDecks,
  cards,
}) => {
  const [deckToEdit, setDeckToEdit] = useState(null);
  const { user } = useContext(firebaseAuth);
  const history = useHistory();

  const handleButtons = (event) => {
    switch (event.target.name) {
      case "exit":
        if (user) {
          history.push("/app");
          return;
        }
        history.push("/");
        return;
      default:
        return;
    }
  }

  if (!user) {
    history.push("/log-in");
  }

  return (
    <div className="dashboard">
      <Switch>
        <Route path="/app/edit">
          <DeckEditor
            deckToEdit={deckToEdit}
            setDeckToEdit={setDeckToEdit}
            cards={cards}
          />
        </Route>
        <Route path="/app/create">
          <PageHeading
            title="新セット"
            styles={{textAlign: 'left'}}
          />
          <DeckCreator />
        </Route>
        <Route path="/app/saved">
          <SavedDecks
            saveDecks={saveDecks}
          />
        </Route>
        <Route path="/app/created">
          <CreatedDecks
            decks={decks}
            cards={cards}
          />
        </Route>
        <Route path="/app/d/:hash">
          <Deck 
            onClick={handleButtons}
          />
        </Route>
        <Route path="/app/test/:hash">
          <Test 
            onClick={handleButtons}
          />
        </Route>
        <Route path="/app">
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', margin: '0 auto', paddingRight: 30 }}>
              <PageHeading
                title="作ったセット"
              />
              <div style={{ padding: 20, background: '#B9BBEA', borderRadius: 10 }}>
                <div>
                  <DeckList
                    decks={decks.slice(0, 3)}
                    setDeckToEdit={setDeckToEdit}
                  />
                </div>
                {decks.length > 3 &&
                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <button
                      id="shuffle"
                      name="shuffle"
                      onClick={() => {
                        history.push('/app/created')
                      }}
                      style={{ color: 'black', background: 'transparent', border: 'unset', fontSize: 20 }}
                    > もっと見る
                    </button>
                  </div>}
              </div>
            </div>
            <div style={{ width: '50%', margin: '0 auto', paddingLeft: 30 }}>
              <PageHeading
                title="保存したセット"
              />
              <div style={{ padding: 20, background: '#B9BBEA', borderRadius: 10 }}>
                <div>
                  <DeckList
                    decks={saveDecks.slice(0, 3)}
                  />
                </div>
                {saveDecks.length > 3 &&
                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <button
                      id="shuffle"
                      name="shuffle"
                      onClick={() => {
                        history.push('/app/saved')
                      }}
                      style={{ color: 'black', background: 'transparent', border: 'unset', fontSize: 20 }}
                    > もっと見る
                    </button>
                  </div>
                }
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 100, paddingLeft: 60, width: 200 }}>
              <button
                onClick={() => {
                  history.push('/app/create')
                }}
                style={{ color: '#B02A22', background: 'transparent', display: 'flex', border: 'unset', fontSize: 30, paddingBottom: 30 }}
              >
                <><FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> 新作</>
              </button>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default Dashboard;