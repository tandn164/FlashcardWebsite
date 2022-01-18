/**
 * Main wrapper for the app, containing the shuffle functionality
 * used by Deck and Dashboard components.
 */

import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { firebaseAuth } from './provider/AuthProvider';
import useOnDecksSnapshot from './hooks/useOnDecksSnapshot';
import useOnAllDecksSnapshot from './hooks/useOnAllDecksSnapshot';
import useOnUserStatusSnapshot from './hooks/useOnUserStatusSnapshot';
import useOnSavedDecksSnapshot from './hooks/useOnSavedDecksSnapshot';

import Deck from './components/decks-and-cards/Deck';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/account-management/Login';
import Logout from './components/account-management/Logout';
import MyAccount from './components/account-management/MyAccount';
import Nav from './components/Nav';
import Signup from './components/account-management/Signup';
import Upgrade from './components/account-management/Upgrade';
import BuyCoin from './components/account-management/BuyCoin';

const App = () => {
  const [selectedDecks, setSelectedDecks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const history = useHistory();
  const { user } = useContext(firebaseAuth);
  const { decks } = useOnDecksSnapshot(user);
  const { allDecks } = useOnAllDecksSnapshot(user);
  const { saveDecks } = useOnSavedDecksSnapshot(user);
  const { userStatus } = useOnUserStatusSnapshot(user); 

  const [decksData, setDecksData] = useState([]);
  const [saveDecksData, setSaveDecksData] = useState([]);
  const [allDecksData, setAllDecksData] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!isSearching) {
      setDecksData(decks)
    }
  }, [decks])

  useEffect(() => {
    if (!isSearching) {
      setSaveDecksData(saveDecks)
    }
  }, [saveDecks])

  useEffect(() => {
    if (!isSearching) {
      setAllDecksData(allDecks)
    }
  }, [allDecks])

  useEffect(() => {
    if (userStatus == null) {
      return;
    }
    if (!(userStatus?.isActive ?? false)) {
      history.push('/log-out');
    }
  }, [userStatus])

  useEffect(() => {
    if (!searchText || searchText.length == 0) {
      setIsSearching(false)
      setDecksData(decks)
      setSaveDecksData(saveDecks)
      setAllDecksData(allDecks)
    } else {
      setIsSearching(true)
      setDecksData(decks.filter((element) => {return element.title.includes(searchText)}));
      setSaveDecksData(saveDecks.filter((element) => {return element.title.includes(searchText)}));
      setAllDecksData(allDecks.filter((element) => {return element.title.includes(searchText)}));
    }
  }, [searchText])

  useEffect(() => {
    if (user) return;
    setSelectedDecks([]);
  }, [user]);

  const onSearch = (text) => {
    setSearchText(text);
  }

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
        onSearch={onSearch}
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
            <MyAccount 
              userStatus={userStatus}
            />
          </main>
        </Route>
        <Route path="/upgrade">
          <main>
            <Upgrade 
              userStatus={userStatus}
            />
          </main>
        </Route>
        <Route path="/buy-coin">
          <main>
            <BuyCoin
              userStatus={userStatus}
            />
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
              decks={decksData}
              saveDecks={saveDecksData}
              selectedDecks={selectedDecks}
              setSelectedDecks={setSelectedDecks}
              userStatus={userStatus}
            />
          </main>
        </Route>
        <Route path="/">
          <main>
            <Home 
              allDecks={allDecksData} 
              setSelectedDecks={setSelectedDecks} 
              selectedDecks={selectedDecks}
              userStatus={userStatus}
              />
          </main>
        </Route>
      </Switch>
    </div>
  );
}

export default App;