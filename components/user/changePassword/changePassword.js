import React, { useRef, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Button, Form } from 'react-bootstrap';

import MessageDisplay from '../../messageDisplay/messageDisplay'
import PasswordFields from '../passwordFields/passwordsFields'

import styles from './changePassword.module.css'

let changeMsgId, passwordMsgId;

const ChangePassword = (props) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [password, setPassword] = useState("");

  const messageDisplayRef = useRef(null);
  const oldPasswordRef = useRef(null);
  const passwordFieldsRef = useRef(null);

  function onFormSubmit(event) {
    event.preventDefault();

    const oldPassword = oldPasswordRef.current.value;
    const newPassword = password;

    const messageDisplay = messageDisplayRef.current;
    messageDisplay.hide(changeMsgId);

    try {
      setIsChangingPassword(true);
    }

    catch (error) {

    }

    function callback(error) {
      if (error)
        changeMsgId = messageDisplay.show('error', "Error changing password: " + getErrorMessage(error), changeMsgId);

      else
        changeMsgId = messageDisplay.show('success', "Password changed successfully.", changeMsgId);

      setIsChangingPassword(false);
    }

    Session.set('passwordResetToken', undefined);
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

  function canChange() {
    if (!password)
      return false;

    return true;
  }

  return (
    <Form className={styles.formChangePassword} onSubmit={onFormSubmit}>
      <Form.Group className="form-group">
        <Form.Label>Current password</Form.Label>
        <Form.Control ref={oldPasswordRef} placeholder="Current password" required autoFocus type="password"/>
      </Form.Group>

      <PasswordFields ref={passwordFieldsRef} onChange={onPasswordChange}/>

      <MessageDisplay ref={messageDisplayRef}/>

      <Button type="submit" disabled={!canChange()}>
        {isChangingPassword ?
          <div>
            Changing password...
          </div> :
          <div>Change Password</div>
        }
      </Button>

      <div className={styles.blockClose}>
        <Button variant="danger" onClick={onCloseClick}><FaTimes className="align-middle"/> Close</Button>
      </div>
    </Form>
  );
}

export default ChangePassword;