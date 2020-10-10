import React, { useContext, useRef, useState } from 'react';

import { Button, Form } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

import Context from '../../context/context';
import Fetcher from '../../fetcher/fetcher';
import MessageDisplay from '../../messageDisplay/messageDisplay';
import PasswordFields from '../passwordFields/passwordsFields';

import styles from './register.module.css';

let registerMsgId, existsMsgId, passwordMsgId;

const Register = (props) => {
  const context = useContext(Context);

  const [ isRegistering, setIsRegistering ] = useState(false);
  const [ password, setPassword ] = useState(false);
  const [ usernameExists, setUsernameExists ] = useState(false);

  const emailRef = useRef(null);
  const messageDisplayRef = useRef(null);

  async function onFormSubmit(event) {
    event.preventDefault();

    const email = emailRef.current.value;

    const messageDisplay = messageDisplayRef.current;
    messageDisplay.hide(registerMsgId);

    setIsRegistering(true);

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    };

    const response = await Fetcher.fetch('/api/user/register', options, context.origin);

    if (response.ok)
      registerMsgId = messageDisplay.show('success', "User successfully registered. A confirmation e-mail has been sent to you.", registerMsgId);

    else {
      const error = await response.json();
      registerMsgId = messageDisplay.show('error', "Error registering user: " + error.message, registerMsgId);
    }

    setIsRegistering(false);
  }

  async function onEmailChange() {
    const email = emailRef.current.value;

    const response = await Fetcher.fetch('/api/user/checkEmailExists?email=' + email, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, context.origin);

    const messageDisplay = messageDisplayRef.current;
    messageDisplay.hide(existsMsgId);

    if (response.ok) {
      const result = await response.json();

      if (result.exists) {
        setUsernameExists(true);
        existsMsgId = messageDisplay.show('error', "There is already a registered user with this e-mail.", existsMsgId);
      }

      else
        setUsernameExists(false);
    }
  }

  function onPasswordChange(password) {
    const messageDisplay = messageDisplayRef.current;

    if (!password) {
      setPassword(null);
      passwordMsgId = messageDisplay.show('error', "The typed passwords do not match.", passwordMsgId);
    }

    else {
      setPassword(password);
      messageDisplay.hide(passwordMsgId);
    }
  }

  function canRegister() {
    if (!password || usernameExists)
      return false;

    return true;
  }

  function onCloseClick() {
    if (props.onDone)
      props.onDone();
  }

  return (
    <Form className={styles.formRegister} onSubmit={onFormSubmit}>
      <Form.Group className="form-group">
        <Form.Label>E-mail</Form.Label>
        <Form.Control ref={emailRef} onChange={onEmailChange} placeholder="mail@domain.com" required autoFocus type="email"/>
      </Form.Group>

      <PasswordFields onChange={onPasswordChange}/>

      <MessageDisplay ref={messageDisplayRef}/>

      <Button type="submit" block disabled={!canRegister()}>
        {isRegistering ? "Registering..." : "Register"}
      </Button>

      <div className={styles.blockClose}>
        <Button variant="danger" onClick={onCloseClick}><FaTimes className="align-middle"/>
          Close
        </Button>
      </div>
    </Form>
  );
}

export default Register;