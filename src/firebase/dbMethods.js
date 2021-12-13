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

  createDeck: (user, title, description, cards) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    const document = db.collection('decks').doc();

    const newDeck = {
      id: document.id,
      numCards: cards.length,
      title,
      description,
      owner: user.uid,
      cards: cards
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
      save_decks: firebase.firestore.FieldValue.arrayRemove({
        id: deck.id, 
        numCards: deck.numCards, 
        owner: deck.owner, 
        title: deck.title, 
        description: deck.description,
        cards: deck.cards
      })
    })
    .then(() => {
      console.log("Updated deck with id: ", deck.id);
    })
    .catch(err => {
      console.error("Error updating document: ", err.message);
      
    });
  },

  updateDeck: (user, deckId, title, description, cards) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    const updatedDeck = {
      title,
      description,
      cards,
      numCards: cards.length,
    }

    return db.collection('decks').doc(deckId).update(updatedDeck)
    .then(() => {
      console.log("Updated deck with id: ", deckId);
      
    })
    .catch(err => {
      console.error("Error updating document: ", err.message);
      
    });
  },
}