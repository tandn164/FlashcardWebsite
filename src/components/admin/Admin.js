import React, { useContext, useEffect, useState } from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import { firebaseAuth } from '../../provider/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { dbMethods } from '../../firebase/dbMethods';

const Admin = ({
  users,
  decks,
}) => {
  const { user } = useContext(firebaseAuth);
  const history = useHistory();
  const [pageSize, setPageSize] = React.useState(5);
  const [rowsUser, setRowUser] = useState([]);
  const [rowsDeck, setRowDeck] = useState([]);
  const [viewMode, setViewMode] = useState(1);
  if (!user) {
    history.push("/log-in");
  }

  useEffect(() => {
    let arr = [];
    users.forEach(user => arr.push({
      id: user.id,
      username: user.username,
      email: user.email,
    }));
    setRowUser(arr);
  }, [users])

  useEffect(() => {
    let arr = [];
    decks.forEach(deck => arr.push({
      id: deck.id,
      title: deck.title,
      description: deck.description,
      numCards: deck.cards.length,
      isPublic: deck.isPublic,
    }));
    setRowDeck(arr);
  }, [decks])

  const _handleDeleteUser = (userID) => {
    dbMethods.deleteUser(userID);
  }

  const _handleDeleteDeck = (deckId) => {
    dbMethods.deleteDeck(deckId);
  }
  
  const columnsUser = [
    { field: 'id', headerName: 'User ID', width: 290},
    { field: 'username', headerName: 'Username', width: 300 },
    { field: 'email', headerName: 'Email', width: 300 },
    {
      field: "action",
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          const api = params.api;
        const thisRow = {};

        api
          .getAllColumns()
          .forEach(
            (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
          );

        return _handleDeleteUser(thisRow.id);
        };
  
        return <button onClick={onClick} >
          <FontAwesomeIcon icon={faTrash} /> {"削除する"}
        </button>;
      }
    },
  ];

  const columnsDeck = [
    { field: 'id', headerName: 'Deck ID', width: 150},
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'description', headerName: 'Description', width: 150 },
    { field: 'numCards', headerName: 'NumCards', width: 150 },
    { field: 'isPublic', headerName: 'Public', width: 150 },
    {
      field: "action",
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          const api = params.api;
        const thisRow = {};

        api
          .getAllColumns()
          .forEach(
            (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
          );

        return _handleDeleteDeck(thisRow.id);
        };
  
        return <button onClick={onClick} >
          <FontAwesomeIcon icon={faTrash} /> {"削除する"}
        </button>;
      }
    },
  ];

  const _generateUserList = () => {
    return <DataGrid
              rows={rowsUser} 
              columns={columnsUser}
              pageSize={pageSize}
              disableSelectionOnClick
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
            />
  }

  const _generateSetList = () => {
    return <DataGrid
              rows={rowsDeck} 
              columns={columnsDeck}
              pageSize={pageSize}
              disableSelectionOnClick
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
            />
  }

  return (
    <Switch>
      <Route path="/">
        <>
          <section>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div className="hero-content" style={{paddingRight: 100}}>
                  <div className="buttons">
                    <>
                      <div
                        className="btn btn-cta"
                        onClick={()=>{setViewMode(1)}}
                      >
                        ユーザーのリスト
                      </div>
                    </>
                  </div>
                </div>
                <div className="hero-content">
                <div className="buttons">
                  <>
                    <div
                      className="btn btn-cta"
                      onClick={()=>{setViewMode(2)}}
                    >
                      セットのリスト
                    </div>
                  </>
                </div>
              </div>
            </div>
          
            <div style={{ height: 400}}>
            {viewMode == 1 ? _generateUserList() : _generateSetList()}
            </div>
          </section>
        </>
      </Route>
    </Switch>
  );
}

export default Admin;