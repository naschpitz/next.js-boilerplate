import React from 'react';

import '../styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-s-alert/dist/s-alert-default.css';

import '../styles/navbar.css';

function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default App
