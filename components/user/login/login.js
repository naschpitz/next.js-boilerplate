import React, { useRef, useState } from 'react'

import { Button, Form } from 'react-bootstrap'
import { FaTimes } from 'react-icons/fa'

import Fetcher from '../../../lib/fetcher'
import MessageDisplay from '../../messageDisplay/messageDisplay'

let loginMsgId, forgotMsgId;

import styles from './login.module.css';

const Login = (props) => {
  const [ user, updateUser, clearUser ] = props.useUser;
  const [ isLoggingIn, setIsLoggingIn ] = useState(false);
  const [ isSendingRecovery, setIsSendingRecovery ] = useState(false);

  const emailRef = useRef(null);
  const messageDisplayRef = useRef(null);
  const passwordRef = useRef(null);

  async function onFormSubmit(event) {
    event.preventDefault();

    setIsLoggingIn(true);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const response = await Fetcher.fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }, props.origin);

    const messageDisplay = messageDisplayRef.current;
    messageDisplay.hide(loginMsgId);

    if (response.ok) {
      if (props.onDone)
        props.onDone();

      updateUser();
    }

    else {
      const error = await response.json();
      loginMsgId = messageDisplay.show('error', "Error loggin in: " + error.message, loginMsgId);
    }

    setIsLoggingIn(false);
  }

  function onForgotPasswordClick() {
    const email = emailRef.current.value;
    const messageDisplay = messageDisplayRef.current;

    messageDisplay.hide(forgotMsgId);

    if (!email) {
      forgotMsgId = messageDisplay.show('error', "Field 'E-mail' empty. Type in the e-mail that you registered your account in order to recover the password.", forgotMsgId);
      return;
    }

    setIsSendingRecovery(true);
  }

  function onCloseClick() {
    if (props.onDone)
      props.onDone();
  }

  return (
    <Form className={styles.formLogin} onSubmit={onFormSubmit}>
      <Form.Group>
        <Form.Label>E-mail</Form.Label>
        <Form.Control ref={emailRef} placeholder="mail@domain.com" required autoFocus type="email"/>
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>Password</Form.Label>
        <Form.Control ref={passwordRef} placeholder="Password" required type="password"/>
      </Form.Group>

      <MessageDisplay ref={messageDisplayRef}/>

      <div id="loginWithPassword">
        <Button type="submit" block>
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
      </div>

      <div className={styles.blockForgotPassword}>
        {isSendingRecovery ?
          <div>
            Sending password recovery...
          </div> :
          <a href="#" onClick={onForgotPasswordClick} id="forgotPassword">Forgot my password</a>
        }
      </div>

      <div className={styles.blockClose}>
        <Button variant="danger" onClick={onCloseClick}>
          <FaTimes className="align-middle"/> Close
        </Button>
      </div>
    </Form>
  );
}

export default Login;