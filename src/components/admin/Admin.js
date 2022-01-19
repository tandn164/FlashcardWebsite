import React, { useContext, useEffect, useState } from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
// import { DataGrid } from '@mui/x-data-grid';
import {
  DataGrid,
  gridPaginationSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import { firebaseAuth } from '../../provider/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faBan, faHighlighter, faLightbulb, faLock, faTrash, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { dbMethods } from '../../firebase/dbMethods';

function CustomPagination() {
  const apiRef = useGridApiContext();
  const state = useGridSelector(apiRef, gridPaginationSelector);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={state.page + 1}
      count={state.pageCount}
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

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

  const _handleUnlockUser = (userId) => {
    dbMethods.unlockUser(userId);
  }

  const _handleDeleteDeck = (deckId) => {
    dbMethods.deleteDeck(deckId);
  }

  const isActive = (userID) => {
    let userElement = users.find((element) => {
      return element.id === userID;
    })
    return userElement?.isActive ?? false
  }
  
  const columnsUser = [
    { field: 'id', headerName: 'ユーザーID', width: 290},
    { field: 'username', headerName: 'ユーザー名', width: 300 },
    { field: 'email', headerName: 'メールアドレス', width: 200 },
    {
      field: "action",
      headerName: "",
      sortable: false,
      width: 200,
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
        if (isActive(thisRow.id)) {
          return _handleDeleteUser(thisRow.id);
        } else {
          return _handleUnlockUser(thisRow.id);
        }
        };
        const api = params.api;
        const thisRow = {};

        api
          .getAllColumns()
          .forEach(
            (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
          );

        return isActive(thisRow.id) ? <button style={{height: 30, width: 200, backgroundColor: 'red', color: 'white'}} onClick={onClick} >
        <FontAwesomeIcon icon={faLock} /> {"無効化する"}
      </button> : <button style={{height: 30, width: 180, backgroundColor: 'green', color: 'white'}} onClick={onClick} >
          <FontAwesomeIcon icon={faUnlock} /> {"アクティブ化する"}
        </button>
      }
    },
  ];

  const columnsDeck = [
    { field: 'id', headerName: 'セットID', width: 150},
    { field: 'title', headerName: 'タイトル', width: 150 },
    { field: 'description', headerName: '説明', width: 150 },
    { field: 'numCards', headerName: 'カードの数', width: 150 },
    { field: 'isPublic', headerName: 'パブリックされている', width: 180 },
    {
      field: "action",
      headerName: "",
      sortable: false,
      width: 200,
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
  
        return <button style={{height: 30, width: 200, backgroundColor: 'red', color: 'white'}} onClick={onClick} >
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
              pagination
              components={{
                Pagination: CustomPagination,
              }}
            />
  }

  const _generateSetList = () => {
    return <DataGrid
              rows={rowsDeck} 
              columns={columnsDeck}
              pageSize={pageSize}
              disableSelectionOnClick
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pagination
              components={{
                Pagination: CustomPagination,
              }}
            />
  }

  return (
    <Switch>
      <Route path="/">
        <>
          <section>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
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