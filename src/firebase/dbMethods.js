/**
 * Methods for accessing the firestore database:
 * 
 * createDeck
 * deleteDeck
 * updateDeck
 * createCard
 * updateCard
 * deleteCard
 */

import { db } from './firebaseIndex';
import firebase from 'firebase';

export const dbMethods = {

  createDeck: (user, title) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    const document = db.collection('decks').doc();

    const newDeck = {
      id: document.id,
      numCards: 0,
      title,
      owner: user.uid,
    }

    document.set(newDeck)
    .then(console.log("Created new deck."))
    .catch(err => {
      console.error("Error creating deck: ", err.message);
    });
  },

  deleteDeck: (user, deckId) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    db.collection('decks').doc(deckId).delete()
    .then(console.log("Deck successfully deleted."))
    .catch(err => {
      console.error("Error deleting deck: ", err.message);
    });
  },

  saveDeck: (user, deck) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }
    return db.collection('users').doc(user.uid).update({
      save_decks: firebase.firestore.FieldValue.arrayUnion(deck)
    })
    .then(() => {
      console.log("Updated deck with id: ", deck.id);
    })
    .catch(err => {
      console.error("Error updating document: ", err.message);
      
    });
  },

  unsaveDeck: (user, deck) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }
    return db.collection('users').doc(user.uid).update({
      save_decks: firebase.firestore.FieldValue.arrayRemove({id: deck.id, numCards: deck.numCards, owner: deck.owner, private: deck.private, title: deck.title})
    })
    .then(() => {
      console.log("Updated deck with id: ", deck.id);
    })
    .catch(err => {
      console.error("Error updating document: ", err.message);
      
    });
  },

  updateDeck: (user, deckId, title) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    const updatedDeck = {
      title,
    }

    return db.collection('decks').doc(deckId).update(updatedDeck)
    .then(() => {
      console.log("Updated deck with id: ", deckId);
      
    })
    .catch(err => {
      console.error("Error updating document: ", err.message);
      
    });
  },

  createCard: (user, deckId, front, back) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    const document = db.collection('cards').doc();

    const newCard = {
      id: document.id,
      deckId,
      owner: user.uid,
      front,
      back,
    }

    document.set(newCard)
    .then(res => {
      console.log("New card created.")
      db.collection('decks').doc(deckId).update({
        numCards: firebase.firestore.FieldValue.increment(1)
      })
      .catch(err => {
        console.error("Error increasing card count.");
      })
    })
    .catch(err => {
      console.error("Error creating card: ", err.message);
    });
  },

  updateCard: (user, cardId, front, back) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    const updatedCard = {
      front,
      back
    }
    console.log("CardId: ", cardId);

    db.collection('cards').doc(cardId).update(updatedCard)
    .then(res => {
      console.log("Updated card with id: ", cardId);
    })
    .catch(err => {
      console.error("Error updating card: ", err.message);
    })
  },

  deleteCard: (user, deckId, cardId) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    db.collection('cards').doc(cardId).delete()
    .then(res => {
      console.log("Card successfully deleted.")
      db.collection('decks').doc(deckId).update({
        numCards: firebase.firestore.FieldValue.increment(-1)
      })
      .catch(err => {
        console.error("Error decreasing card count.");
      })
    })
    
    .catch(err => {
      console.error("Error deleting card: ", err.message);
    });
  },

  saveCard: () => {

  }
}