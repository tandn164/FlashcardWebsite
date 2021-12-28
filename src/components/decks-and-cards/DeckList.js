import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { firebaseAuth } from '../../provider/AuthProvider';
import SelectableDeck from './SelectableDeck';

function Items({ currentItems, user, setDeckToEdit}) {
  return (
    <React.Fragment>
      <div>
      {currentItems && 
        <div className="deck-list">
        <ul>
          {currentItems.length > 0 ? 
            currentItems.map((deck, index) => {
              return (
                <SelectableDeck 
                  key={index}
                  // toggleDeck={toggleDeck}
                  // selectedDecks={selectedDecks}
                  length={currentItems.numCards}
                  // setSelectedDecks={setSelectedDecks}
                  deck={deck}
                  mine={user && currentItems.owner == currentItems.uid}
                  setDeckToEdit={() => {
                    setDeckToEdit({ id: currentItems.id, title: currentItems.title, private: currentItems.private, description: currentItems.description });
                  }}
                />
              );}
            )
          :
            <p>セットがありません。 作成して開始してください！</p>
          }
        </ul>
      </div>
      }
      </div>
    
    </React.Fragment>
  );
}

function PaginatedItems({ itemsPerPage, decks, user, setDeckToEdit}) {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(decks.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(decks.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage % decks.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} user={user} />
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

const DeckList = ({
  decks,
  selectedDecks,
  setSelectedDecks,
  setDeckToEdit,
}) => {
  const [deckList, setDeckList] = useState([]);
  const { user } = useContext(firebaseAuth);

  // const toggleDeck = (deckId) => {
  //   setSelectedDecks(decks => {
  //     if (decks.includes(deckId)) {
  //       return decks.filter(ele => ele !== deckId)
  //     } else {
  //       return [...decks, deckId];
  //     }
  //   });
  // }

  useEffect(() => {
    if (!decks) {return}
    setDeckList(decks.map(deck => {
      return (
        <SelectableDeck 
          key={deck.id}
          // toggleDeck={toggleDeck}
          // selectedDecks={selectedDecks}
          length={deck.numCards}
          // setSelectedDecks={setSelectedDecks}
          deck={deck}
          mine={user && deck.owner == user.uid}
          setDeckToEdit={() => {
            setDeckToEdit({ id: deck.id, title: deck.title, private: deck.private, description: deck.description });
          }}
        />
      );}
    ));
  }, [decks]);

  return (
    <div className="deck-list">
      {/* <ul>
        {deckList.length > 0 ? 
          deckList
        :
          <p>セットがありません。 作成して開始してください！</p>
        }
      </ul> */}
      <PaginatedItems itemsPerPage={4} decks={decks} user={user} setDeckToEdit={setDeckToEdit}/>
    </div>
  );
}

export default DeckList;