import React, { useRef } from 'react';

import { Alert, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

import styles from './passwordsFields.module.css';

const PasswordFields = (props) => {
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);

  function onKeyUp() {
    const password = passwordRef.current.value;
    const passwordCheck = passwordCheckRef.current.value;

    if (password === passwordCheck)
      props.onChange(password);

    else
      props.onChange();
  }

  return (
    <Form.Group>
      <Form.Label>Password</Form.Label>
      <Form.Control ref={passwordRef} onKeyUp={onKeyUp} placeholder="Password" required type="password"/>
      <Form.Control ref={passwordCheckRef} onKeyUp={onKeyUp} placeholder="Type your password again" required type="password"/>

      <Alert className={styles.requirements} variant="info">
        <p>Password requirements:</p>
        <ul className={styles.list}>
          <li>At least 8 characters</li>
          <li>At least one upper case</li>
          <li>At least one lower case</li>
          <li>At least one digit</li>
          <li>At least one symbol</li>
          <li>No spaces</li>
        </ul>
      </Alert>
    </Form.Group>
  )
}

PasswordFields.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default PasswordFields;