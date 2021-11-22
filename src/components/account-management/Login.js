import React, { useState, useContext, useEffect } from 'react';
import { firebaseAuth } from '../../provider/AuthProvider';
import { Link, useHistory } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import PageHeading from '../PageHeading';
import TextInput from '../TextInput';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const { status, error, handleLogin} = useAuth(inputs.email, inputs.password);
  const { user } = useContext(firebaseAuth);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  }

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
      case "auth/user-not-found":
        setErrorMessage("メールアドレスとパスワードが一致しません。");
        return;
      case "auth/wrong-password":
        setErrorMessage("メールアドレスとパスワードが一致しません。");
        return;
      case "auth/invalid-email":
        setErrorMessage("有効なメールアドレスを入力してください。");
        return;
      default:
        setErrorMessage("何かがうまくいかなかった。もう一度やり直してください。");
        return;
    }

  }, [error]);

  return (
    <div className="login" style={{textAlign: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginRight: 200}}>
        <div style={{display: 'flex', paddingRight: 50, fontSize: 25, alignItems: 'center'}}>
          <Link to="/sign-up">サインアップ</Link>
        </div>
        <PageHeading 
          title="ログイン"
        />
      </div>
      <form style={{display: 'inline-block'}} onSubmit={handleSubmit}>
        <TextInput 
          labelText="メールアドレス"
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          id="email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          placeholder="メールアドレス"
        />
        <TextInput 
          labelText="パスワード"
          icon={<FontAwesomeIcon icon={faLock} />}
          type="password"
          id="password"
          name="password"
          value={inputs.password}
          onChange={handleChange}
        />
        {errorMessage !== "" && <p className="error">{errorMessage}</p>}
        <button 
          className="btn btn-primary"
          style={{backgroundColor: '#526CC6', borderColor: 'unset', borderRadius: 20, borderWidth: 0}}
          disabled={inputs.password === "" || inputs.email === ""}        
        >
          {status === "loading" ? "Loading . . . " : status === "success" ? "成功" : "ログイン"}
        </button>
      </form>
    </div>
  );
}

export default Login;