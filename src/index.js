import React from 'react';
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom';
import AuthProvider from './provider/AuthProvider';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import './styles/normalize.css';
import './styles/styles.css';
import App from './App';

const options = {
  position: positions.MIDDLE,
  timeout: 3000,
  offset: '30px',
  transition: transitions.SCALE
}

const Root = () => (
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
)

render(<Root />, document.getElementById('root'))
