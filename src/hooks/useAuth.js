/**
 * Hook for user authentication and account management:
 * 
 * Logging user in
 * Signing user up
 * Logging user out
 * Updating user email
 * Changing user password
 * Deleting account
 */

import { useState, useEffect, useContext } from 'react';
import { auth, db, fb } from '../firebase/firebaseIndex';
import { firebaseAuth } from '../provider/AuthProvider';

const useAuth = (username = null, email = null, password = null, newPassword = null, avatarUrl = null) => {
  const { user } = useContext(firebaseAuth);

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("pending");

  const [login, setLogin] = useState(0);
  const [signup, setSignup] = useState(0);
  const [logout, setLogout] = useState(0);
  const [changeEmail, setChangeEmail] = useState(0);
  const [changePassword, setChangePassword] = useState(0);
  const [deleteAccount, setDeleteAccount] = useState(0);

  // Logging user in
  useEffect(() => {
    if (login === 0 || user != null) return;
    setError(null);
    setStatus("loading");
    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let _user = userCredential.user;
      setUserData(_user);
      setStatus("success");
    })
    .catch((error) => {
      console.error("Error logging user in: ", error.message);
      setError(error);
      setStatus("error");
    })
  }, [login]);

  // Signing user up
  useEffect(() => {
    if (signup === 0 || user != null) return;
    setError(null);
    setStatus("loading");
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let _user = userCredential.user;
        db.collection('users').doc(_user.uid).set({
          save_decks: []
        });
        userCredential.user.updateProfile({displayName: username})
        setUserData(_user);
        setStatus("success");
      })
      .catch((error) => {
        console.error("Error signing user in: ", error.message);
        setError(error);
        setStatus("error");
      })

  }, [signup]);

  // Logging user out
  useEffect(() => {
    if (logout === 0 || user === null) return;
    setError(null);
    setStatus("loading");

    auth.signOut()
    .then(() => {
      console.log("Logged out");
      setUserData(null);
      setStatus("success");
    })
    .catch(error => {
      console.error("Error logging user out: ", error.message);
      setError(error.code);
      setStatus("error");
    })

  }, [logout]);

  useEffect(() => {
    if (changeEmail === 0 || user === null) return;
    setError(null);
    setStatus("loading")

    const credential = fb.auth.EmailAuthProvider.credential(
      auth.currentUser.email, 
      password,
    );
    auth.currentUser.reauthenticateWithCredential(credential).then(function() {
      console.log("User successfully reauthenticated.");
      auth.currentUser.updateEmail(email)
      .then(() => {
        setStatus("success");
      })
      .catch((error) => {
        setError(error.code);
        setStatus("error");
      });
      setStatus("loading")
      auth.currentUser.updateProfile({displayName: username, photoURL: avatarUrl})
      .then(() => {
        setUserData(auth.currentUser);
        setStatus("success");
      })
      .catch((error) => {
        setError(error.code);
        setStatus("error");
      });
    }).catch((error) => {
      setError(error.code);
      setStatus("error");
    })

  }, [changeEmail]);

  // Changing password
  useEffect(() => {
    if (changePassword === 0 || user === null) return;
    setError(null);
    setStatus("loading");

    const credential = fb.auth.EmailAuthProvider.credential(
      auth.currentUser.email, 
      password,
    );
    
    auth.currentUser.reauthenticateWithCredential(credential).then(function() {
      console.log("User successfully reauthenticated.");
      auth.currentUser.updatePassword(newPassword).then(function() {
        setStatus("success");
      }).catch((error) => {
        setError(error.code);
        setStatus("error");
      });
    }).catch((error) => {
      setError(error.code);
      setStatus("error");
    })

  }, [changePassword])

  // Delete account
  useEffect(() => {
    if (deleteAccount === 0 || user === null) return;
    setError(null);
    setStatus("loading");

    const credential = fb.auth.EmailAuthProvider.credential(
      auth.currentUser.email, 
      password,
    );

    auth.currentUser.reauthenticateWithCredential(credential).then(function() {
      auth.currentUser.delete().then(() => {
        setStatus("success");
      }).catch((error) => {
        setError(error.code);
        setStatus("error");
      })
    }).catch((error) => {
      setError(error.code);
      setStatus("error");
    });

  }, [deleteAccount])

  const handleLogin = () => setLogin(prev => prev + 1);
  const handleSignup = () => setSignup(prev => prev + 1);
  const handleLogout = () => setLogout(prev => prev + 1);
  const handleChangeEmail = () => setChangeEmail(prev => prev + 1);
  const handleChangePassword = () => setChangePassword(prev => prev + 1);
  const handleDeleteAccount = () => setDeleteAccount(prev => prev + 1);
  const resetStatus = () => setStatus('pending');

  return { 
    userData, 
    error, 
    status,
    handleLogin, 
    handleSignup, 
    handleLogout,
    handleChangeEmail,
    handleChangePassword,
    handleDeleteAccount,
    resetStatus
  };
}

export default useAuth;