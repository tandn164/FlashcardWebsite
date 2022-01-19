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

import { db } from "./firebaseIndex";
import firebase from "firebase";

export const dbMethods = {
  createDeck: (user, title, description, cards, isPublic = true) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    const document = db.collection("decks").doc();

    const newDeck = {
      id: document.id,
      numCards: cards.length,
      title,
      description,
      owner: user.uid,
      cards: cards,
      isPublic: isPublic,
    };

    document
      .set(newDeck)
      .then(console.log("Created new deck."))
      .catch((err) => {
        console.error("Error creating deck: ", err.message);
      });
  },

  deleteDeck: (deckId) => {

    db.collection("decks")
      .doc(deckId)
      .delete()
      .then(console.log("Deck successfully deleted."))
      .catch((err) => {
        console.error("Error deleting deck: ", err.message);
      });
  },

  deleteUser: (userId) => {

    const updatedUser = {
      isActive: false,
    };

    db.collection("users")
      .doc(userId)
      .update(updatedUser)
      .then(console.log("User successfully deleted."))
      .catch((err) => {
        console.error("Error deleting deck: ", err.message);
      });
  },

  unlockUser: (userId) => {

    const updatedUser = {
      isActive: true,
    };

    db.collection("users")
      .doc(userId)
      .update(updatedUser)
      .then(console.log("User successfully deleted."))
      .catch((err) => {
        console.error("Error deleting deck: ", err.message);
      });
  },

  saveDeck: (user, deck) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }
    return db
      .collection("users")
      .doc(user.uid)
      .update({
        save_decks: firebase.firestore.FieldValue.arrayUnion(deck),
      })
      .then(() => {
        db.collection("decks")
          .doc(deck.id)
          .update({
            saveCount: firebase.firestore.FieldValue.increment(1)
          })
          .then(() => {
            console.log("Updated save count number of deck with id: ", deck.id);
          })
          .catch((err) => {
            console.error("Error updating document: ", err.message);
          });
        console.log("Updated deck with id: ", deck.id);
      })
      .catch((err) => {
        console.error("Error updating document: ", err.message);
      });
  },

  unsaveDeck: (user, deck) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }
    return db
      .collection("users")
      .doc(user.uid)
      .update({
        save_decks: firebase.firestore.FieldValue.arrayRemove({
          id: deck.id,
          numCards: deck.numCards,
          owner: deck.owner,
          title: deck.title,
          description: deck.description,
          cards: deck.cards,
          isPublic: deck.isPublic,
        }),
      })
      .then(() => {
        let ref = db
          .collection("decks")
          .doc(deck.id)
          .get()
          .then((doc) => {
            if (doc.data().saveCount > 0) {
              db.collection("decks")
                .doc(deck.id)
                .update({
                  saveCount: firebase.firestore.FieldValue.increment(-1),
                })
                .then(() => {
                  console.log(
                    "Updated save count number of deck with id: ",
                    deck.id
                  );
                })
                .catch((err) => {
                  console.error("Error updating document: ", err.message);
                });
            } else {
              db.collection("decks")
                .doc(deck.id)
                .update({
                  saveCount: 0,
                })
                .then(() => {
                  console.log(
                    "Updated save count number of deck with id: ",
                    deck.id
                  );
                })
                .catch((err) => {
                  console.error("Error updating document: ", err.message);
                });
            }
          })
          .catch((err) => {
            console.error("Error getting document data: ", err.message);
          });
        console.log("Updated deck with id: ", deck.id);
      })
      .catch((err) => {
        console.error("Error updating document: ", err.message);
      });
  },

  updateDeck: (user, deckId, title, description, cards, isPublic = true) => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    const updatedDeck = {
      title,
      description,
      cards,
      numCards: cards.length,
      isPublic: isPublic,
    };

    return db
      .collection("decks")
      .doc(deckId)
      .update(updatedDeck)
      .then(() => {
        console.log("Updated deck with id: ", deckId);
      })
      .catch((err) => {
        console.error("Error updating document: ", err.message);
      });
  },
};
