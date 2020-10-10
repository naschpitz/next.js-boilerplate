import React, {useContext, useRef, useState} from 'react'

import { Button, Form } from 'react-bootstrap'
import { FaTimes } from 'react-icons/fa'

import Context from '../../context/context'
import MessageDisplay from '../../messageDisplay/messageDisplay'
import PasswordFields from '../passwordFields/passwordsFields'

import styles from './resetPassword.module.css'

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

  function onFormSubmit(event) {
    event.preventDefault();

    const messageDisplay = messageDisplayRef.current;
    messageDisplay.hide(resetMsgId);

    setIsResettingPassword(true);

    function callback(error) {
      if (error)
        resetMsgId = messageDisplay.show('error', "Error resetting password, the link has expired.", resetMsgId);

      else
        resetMsgId = messageDisplay.show('success', "Password changed successfully.", resetMsgId);

      setIsResettingPassword(false);
    }
  }

  function onPasswordChange(password) {
    const messageDisplay = messageDisplayRef.current;
    messageDisplay.hide(passwordMsgId);

    if (!password) {
      setPassword(null);
      passwordMsgId = messageDisplay.show('error', "The typed passwords do not match.", passwordMsgId);
    }

    else
      setPassword(password);
  }

  function onCloseClick() {
    if (props.onDone)
      props.onDone();
  }

  return (
    <Form className={styles.formResetPassword} onSubmit={onFormSubmit}>
      <PasswordFields ref={passwordFieldsRef} onChange={onPasswordChange}/>

      <MessageDisplay ref={messageDisplayRef}/>

      <Button type="submit" disabled={!canReset()}>
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