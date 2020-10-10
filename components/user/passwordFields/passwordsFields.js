import React, { useRef } from 'react';

import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

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
    </Form.Group>
  )
}

PasswordFields.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default PasswordFields;