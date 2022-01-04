/**
 * Main wrapper for the app, containing the shuffle functionality
 * used by Deck and Dashboard components.
 */

import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { firebaseAuth } from './provider/AuthProvider';
import useOnUserSnapshot from './hooks/useOnUserSnapshot';

import Login from './components/account-management/Login';
import Logout from './components/account-management/Logout';
import MyAccount from './components/account-management/MyAccount';
import Nav from './components/Nav';
import Admin from './components/admin/Admin';

const App = () => {
  const history = useHistory();
  const { user } = useContext(firebaseAuth);
  const { users } = useOnUserSnapshot();

  const [usersData, setUserData] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!isSearching) {
      setUserData(users)
    }
  }, [users])

  useEffect(() => {
    if (!searchText || searchText.length == 0) {
      setIsSearching(false)
      setUserData(users)
    } else {
      setIsSearching(true)
      setUserData(users.filter((element) => {return element.username.includes(searchText)}));
    }
  }, [searchText])

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
        <Route path="/my-account">
          <main>
            <MyAccount />
          </main>
        </Route>
        <Route path="/">
          <main>
            <Admin 
              users={usersData}
            />
          </main>
        </Route>
      </Switch>
    </div>
  );
}

export default App;