/**
 * Displays the update password page.
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import Breadcrumb from '../Breadcrumb';
import PageHeading from '../PageHeading';
import TextInput from '../TextInput';

const ChangePassword = ({
  handleChange,
  inputs,
  error,
  onSubmit,
  status
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error === null) {
      setErrorMessage("");
      return;
    }

    switch (error) {
      case null:
        setErrorMessage("");
        return;
      case "auth/wrong-password":
        setErrorMessage("Incorrect password.");
        return;
      default:
        setErrorMessage("Something went wrong. Please try again.");
        return;
    }
  }, [error]);
  
  return (
    <>
      <PageHeading
        title="パスワードを変更してください"
      />
      <form onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}>
        <TextInput 
          labelText="現在のパスワード"
          icon={<FontAwesomeIcon icon={faLock} />}
          type="password"
          id="password"
          name="password"
          value={inputs.password}
          onChange={handleChange}
        />
        <TextInput 
          labelText="新しいパスワード"
          icon={<FontAwesomeIcon icon={faLock} />}
          type="password"
          id="new-password"
          name="newPassword"
          value={inputs.newPassword}
          onChange={handleChange}
        />
        {errorMessage !== "" && <p className="error">{errorMessage}</p>}
        <button className="btn btn-primary"　style={{color: 'white', background: '#526CC6', border: 'unset'}}>
          {status === "loading" ? "読み込み中 . . . " : status === "success" ? "成功" : "パスワードを変更する"}
        </button>
      </form>
    </>
  );
}

export default ChangePassword;