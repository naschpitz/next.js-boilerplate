import React, { useContext, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';

import Context from '../../context/context';
import Fetcher from '../../fetcher/fetcher';
import MessageDisplay from '../../messageDisplay/messageDisplay';
import PasswordFields from '../passwordFields/passwordsFields';
import Users from '../../../lib/users/class';

import styles from './changePassword.module.css';

let changeMsgId, passwordMsgId;

const ChangePassword = (props) => {
  const context = useContext(Context);

  const [ isChangingPassword, setIsChangingPassword ] = useState(false);
  const [ password, setPassword ] = useState("");

  const messageDisplayRef = useRef(null);
  const oldPasswordRef = useRef(null);
  const passwordFieldsRef = useRef(null);

  async function onFormSubmit(event) {
    event.preventDefault();

    const oldPassword = oldPasswordRef.current.value;
    const newPassword = password;

    const messageDisplay = messageDisplayRef.current;
    messageDisplay.hide(changeMsgId);

    setIsChangingPassword(true);

    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword })
    };

    const response = await Fetcher.fetch('/api/users/changePassword', options, context.origin);

    if (response.ok)
      changeMsgId = messageDisplay.show('success', "Password successfully changed.", changeMsgId);

    else {
      const error = await response.json();
      changeMsgId = messageDisplay.show('error', "Error changing password: " + error.message, changeMsgId);
    }

    setIsChangingPassword(false);
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

  function canChange() {
    return !!password;
  }

  return (
    <Form className={styles.formChangePassword} onSubmit={onFormSubmit}>
      <Form.Group>
        <Form.Label>Current password</Form.Label>
        <Form.Control ref={oldPasswordRef} placeholder="Current password" required autoFocus type="password"/>
      </Form.Group>

      <PasswordFields ref={passwordFieldsRef} onChange={onPasswordChange}/>

      <MessageDisplay ref={messageDisplayRef}/>

      <Button type="submit" block disabled={!canChange()}>
        {isChangingPassword ? "Changing password..." : "Change Password"}
      </Button>

      <div className={styles.blockClose}>
        <Button variant="danger" onClick={onCloseClick}><FaTimes className="align-middle"/> Close</Button>
      </div>
    </Form>
  );
}

export default ChangePassword;