import React, { useContext, useRef, useState } from 'react';

import { Button, Form } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

import Context from '../../context/context';
import Fetcher from '../../fetcher/fetcher';
import MessageDisplay from '../../messageDisplay/messageDisplay';
import PasswordFields from '../passwordFields/passwordsFields';
import Users from '../../../lib/users/client/class';

import styles from './resetPassword.module.css';

let resetMsgId, passwordMsgId;

const ResetPassword = (props) => {
  const context = useContext(Context);

  const [ isResettingPassword, setIsResettingPassword ] = useState(false);
  const [ password, setPassword ] = useState("");

  const messageDisplayRef = useRef(null);
  const passwordFieldsRef = useRef(null);

  function canReset() {
    return password;
  }

  async function onFormSubmit(event) {
    event.preventDefault();

    const messageDisplay = messageDisplayRef.current;
    messageDisplay.hide(resetMsgId);

    setIsResettingPassword(true);

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    };

    const response = await Fetcher.fetch('/api/user/resetPassword', options, context.origin);

    if (response.ok)
      resetMsgId = messageDisplay.show('success', "Password successfully changed.", resetMsgId);

    else {
      const error = await response.json();
      resetMsgId = messageDisplay.show('error', "Error resetting password: " + error.message, resetMsgId);
    }

    setIsResettingPassword(false);
  }

  function onPasswordChange(password) {
    const messageDisplay = messageDisplayRef.current;

    if (!password) {
      setPassword(null);
      passwordMsgId = messageDisplay.show('error', "The typed passwords do not match.", passwordMsgId);
    }

    else {
      const isPasswordValid = Users.validatePassword(password);

      if (!isPasswordValid) {
        setPassword(null);
        passwordMsgId = messageDisplay.show('error', "The typed password does not meet the requirements.", passwordMsgId);
      }

      else {
        setPassword(password);
        messageDisplay.hide(passwordMsgId);
      }
    }
  }

  function onCloseClick() {
    if (props.onDone)
      props.onDone();
  }

  return (
    <Form className={styles.formResetPassword} onSubmit={onFormSubmit}>
      <PasswordFields ref={passwordFieldsRef} onChange={onPasswordChange}/>

      <MessageDisplay ref={messageDisplayRef}/>

      <Button type="submit" block disabled={!canReset()}>
        {isResettingPassword ?
          <div>Resetting password...</div> :
          <div>Reset Password</div>
        }
      </Button>

      <div className={styles.blockClose}>
        <Button variant="danger" onClick={onCloseClick}>
          <FaTimes className="align-middle"/> Close
        </Button>
      </div>
    </Form>
  );
}

export default ResetPassword;