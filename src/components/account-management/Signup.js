import React, { useState, useContext, useEffect } from 'react';
import { firebaseAuth } from '../../provider/AuthProvider';
import { Link, useHistory } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

import PageHeading from '../PageHeading';
import TextInput from '../TextInput';

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [inputs, setInputs] = useState({username: "", email: "", password: "" });
  const history = useHistory();

  const { status, error, handleSignup} = useAuth(inputs.username, inputs.email, inputs.password);
  const { user } = useContext(firebaseAuth);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup();
  }

  useEffect(() => {
    if (error === null) return;
    console.log(error.message);
  }, [error])

  const handleChange = e => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    if (user) {
      history.push("/app");
    }
  }, [user]);

  useEffect(() => {
    if (error === null) {
      setErrorMessage("");
      return;
    }

    switch (error.code) {
      case null:
        setErrorMessage("");
        return;
      case "auth/weak-password":
        setErrorMessage("パスワードは6文字以上である必要があります。");
        return;
      case "auth/email-already-in-use":
        setErrorMessage("このメールはすでに登録されています。");
        return;
      case "auth/invalid-email":
        setErrorMessage("有効なメールアドレスを入力してください。");
        return;
      default:
        setErrorMessage("何かがうまくいかなかった。 もう一度やり直してください。");
        return;
    }
  }, [error]);

  return (
    <div className="signup" style={{textAlign: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginRight: 200}}>
        <div style={{display: 'flex', paddingRight: 50, fontSize: 25, alignItems: 'center'}}>
          <Link to="/log-in">ログイン</Link>
        </div>
        <PageHeading 
        title="サインアップ"
      />
      </div>
      <form style={{display: 'inline-block'}} onSubmit={handleSubmit}>
      <TextInput 
          labelText="ユーザー名"
          id="username"
          name="username"
          placeholder="ユーザー名"
          value={inputs.username}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faUser} />}
        />
        <TextInput 
          labelText="メールアドレス"
          id="email"
          name="email"
          placeholder="メールアドレス"
          value={inputs.email}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faEnvelope} />}
        />
        <TextInput 
          labelText="パスワード"
          id="password"
          name="password"
          type="password"
          value={inputs.password}
          onChange={handleChange}
        />
        {errorMessage !== "" && <p className="error">{errorMessage}</p>}
        <button 
          className="btn btn-primary"
          style={{backgroundColor: '#526CC6', borderColor: 'unset', borderRadius: 20, borderWidth: 0}}
          disabled={inputs.username === "" || inputs.password === "" || inputs.email === ""}
        >
          {status === "loading" ? "読み込み中 . . . " : status === "success" ? "成功" : "サインアップ"}
        </button>
      </form>
    </div>
  );
}

export default Signup;