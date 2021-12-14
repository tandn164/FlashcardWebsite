/**
 * Main wrapper for the app, containing the shuffle functionality
 * used by Deck and Dashboard components.
 */

import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { firebaseAuth } from './provider/AuthProvider';
import useOnDecksSnapshot from './hooks/useOnDecksSnapshot';
import useOnSavedDecksSnapshot from './hooks/useOnSavedDecksSnapshot';
import useOnAllDecksSnapshot from './hooks/useOnAllDecksSnapshot';

import Deck from './components/decks-and-cards/Deck';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/account-management/Login';
import Logout from './components/account-management/Logout';
import MyAccount from './components/account-management/MyAccount';
import Nav from './components/Nav';
import Signup from './components/account-management/Signup';
import MobileMenu from './components/MobileMenu';

const fisherYatesShuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = Object.assign({}, array[currentIndex]);
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const App = () => {
  const [selectedDecks, setSelectedDecks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const history = useHistory();
  const { user } = useContext(firebaseAuth);
  const { decks } = useOnDecksSnapshot(user);
  const { saveDecks } = useOnSavedDecksSnapshot(user);
  const { allDecks } = useOnAllDecksSnapshot();

  useEffect(() => {
    if (user) return;
    setSelectedDecks([]);
  }, [user]);

  const handleButtons = (event) => {
    switch (event.target.name) {
      case "exit":
        if (user) {
          history.push("/app");
          return;
        }
        history.push("/");
        return;
  
      case "toggle-menu":
        setIsMenuOpen(prev => !prev);
        return;
      default:
        return;
    }
  }

  if (!user) {
    history.push("/log-in");
  }

  return (
    <div className="app">
      <Nav 
        onClick={handleButtons}
        isMenuOpen={isMenuOpen}
      />
      <Switch>
        <Route path="/log-in">
          <Login />
        </Route>
        <Route path="/log-out">
          <main>
            <Logout />
          </main>
        </Route>
        <Route path="/sign-up">
          <Signup />
        </Route>
        <Route path="/my-account">
          <main>
            <MyAccount />
          </main>
        </Route>
        <Route path="/app/shuffle">
          <Deck 
            onClick={handleButtons}
          />
        </Route>
        <Route path="/app/d/:hash">
          <Deck 
            onClick={handleButtons}
          />
        </Route>
        <Route path="/app">
          <main>
            <Dashboard 
              onClick={handleButtons}
              decks={decks}
              saveDecks={saveDecks}
              selectedDecks={selectedDecks}
              setSelectedDecks={setSelectedDecks}
            />
          </main>
        </Route>
        <Route path="/">
          <main>
            <Home 
              allDecks={allDecks} 
              setSelectedDecks={setSelectedDecks} 
              selectedDecks={selectedDecks}
              />
          </main>
        </Route>
      </Switch>
    </div>
  );
}

export default App;