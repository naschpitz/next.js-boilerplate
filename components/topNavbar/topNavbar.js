import React, { useContext } from 'react';
import Alert from 'react-s-alert';
import { UniqueModalController } from '@naschpitz/unique-modal';

import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt, FaPlus, FaSignOutAlt, FaSyncAlt, FaKey, FaUserEdit } from 'react-icons/fa';

import ChangePassword from '../user/changePassword/changePassword';
import Context from '../context/context';
import Fetcher from '../fetcher/fetcher';
import Login from '../user/login/login';
import Register from '../user/register/register';
import ResetPassword from '../user/resetPassword/resetPassword';

const TopNavbar = () => {
  const context = useContext(Context);

  const [ user, updateUser, clearUser ] = context.useUser;

  const passwordResetToken = null;

  checkPasswordResetToken();

  function checkPasswordResetToken() {
    if (!!passwordResetToken) {
      UniqueModalController.open(<ResetPassword onDone={onModalClose}/>);
    }
  }

  function getLeftItems()
  {
    return (
      <Nav className="mr-auto">

      </Nav>
    );
  }

  function getRightItems()
  {
    return (
      <Nav className="ml-auto">
        {loginButton()}

        {!user ?
          <>
            <Nav.Item>
              <Nav.Link href="#" onClick={onRegisterClick}>
                <FaPlus className="align-middle"/> Register
              </Nav.Link>
            </Nav.Item>

            {!!passwordResetToken ?
              <Nav.Item>
                <Nav.Link onClick={onResetPasswordClick}>
                  <FaSyncAlt className="align-middle"/> Reset Password
                </Nav.Link>
              </Nav.Item> : null
            }
          </> : null
        }
      </Nav>
    );
  }

  function loginButton()
  {
    let displayName;
    let verified;

    if (user) {
      if (user.email) {
        displayName = user.email.address;
        verified = user.email.verified;
      }
    }

    if (user) {
      return (
        <NavDropdown alignRight={true} title={displayName}>
          <NavDropdown.Item onClick={onChangePasswordClick}>
            <FaKey className="align-middle"/> Change Password
          </NavDropdown.Item>

          {!verified ?
            <NavDropdown.Item onClick={onConfirmEmailClick}>
              <FaSyncAlt className="align-middle"/>Re-send Confirmation
            </NavDropdown.Item> : null
          }

          <NavDropdown.Item onClick={onLogoutClick}>
            <FaSignOutAlt className="align-middle"/> Logout
          </NavDropdown.Item>
        </NavDropdown>
      );
    }

    else {
      return (
        <Nav.Link onClick={onLoginClick}>
          <FaSignInAlt className="align-middle"/> Login
        </Nav.Link>
      );
    }
  }

  function onLoginClick()
  {
    UniqueModalController.open(<Login onDone={onModalClose} />);
  }

  function onRegisterClick()
  {
    UniqueModalController.open(<Register onDone={onModalClose} />);
  }

  function onChangePasswordClick()
  {
    UniqueModalController.open(<ChangePassword onDone={onModalClose} />);
  }

  function onModalClose()
  {
    UniqueModalController.close();
  }

  function onConfirmEmailClick()
  {
    Alert.success("A confirmation e-mail has been sent to you.");
  }

  async function onLogoutClick()
  {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await Fetcher.fetch('/api/user/logout', options, context.origin);

    if (response.ok)
      clearUser();

    else
      Alert.error("Oops, an error occurred during logout, please try again.");
  }

  function onResetPasswordClick()
  {
    UniqueModalController.open(<ResetPassword onDone={onModalClose} />);
  }

  return (
    <Navbar variant="light" bg="light" expand="lg">
      <Navbar.Brand href="/">
        <img src="/images/banner.png" height="50" alt="Boilerplate.com" />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar" />

      <Navbar.Collapse id="navbar">
        {getLeftItems()}
        {getRightItems()}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default TopNavbar;