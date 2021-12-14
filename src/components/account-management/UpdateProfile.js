import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

import PageHeading from '../PageHeading';
import TextInput from '../TextInput';

const UpdateProfile = ({
  handleChange,
  inputs,
  onSubmit,
  error,
  status,
  onBack
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error === null) {
      setErrorMessage("");
      return;
    }

    switch (error.code) {
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

  useEffect(() => {
    return () => onBack();
  }, [])

  return (
    <>
      <PageHeading
        title="メールを更新する"
      />
      <form onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}>
        <TextInput 
          labelText="ユーザー名"
          icon={<FontAwesomeIcon icon={faUser} />}
          id="username"
          name="username"
          value={inputs.username}
          onChange={handleChange}
        />
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
          labelText="メルアドレス"
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          id="email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          placeholder="メルアドレス"
        />
        {errorMessage !== "" && <p className="error">{errorMessage}</p>}
        <button className="btn btn-primary" 
        style={{color: 'white', background: '#526CC6', border: 'unset'}}
        disabled={inputs.password === "" || inputs.email === "" || inputs.username === ""}   >
          {status === "loading" ? "読み込み中 . . . " : status === "success" ? "成功" : "メールを更新する"}
        </button>
      </form>
    </>
  );
}

export default UpdateProfile;