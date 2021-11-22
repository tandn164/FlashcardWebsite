/**
 * Initialize firebase authentication and firestore.
 */

import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyB25ZqbIrDuXWUokLFcsbltpjUf5pjhb-w",
  authDomain: "flashcardapp-d3306.firebaseapp.com",
  databaseURL: "https://flashcardapp-d3306.firebaseio.com",
  projectId: "flashcardapp-d3306",
  storageBucket: "flashcardapp-d3306.appspot.com",
  messagingSenderId: "635798969664",
  appId: "1:635798969664:web:562fb322eeb9d31667eea5",
  measurementId: "G-XSQ0TX77TY"
};

firebase.initializeApp(firebaseConfig);
export const auth=firebase.auth();
export const db=firebase.firestore();
export const fb=firebase;

export default { firebaseConfig }