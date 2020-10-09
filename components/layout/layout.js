import React from 'react'

import Alert from 'react-s-alert';
import { UniqueModal } from '@naschpitz/unique-modal';
import { Container } from 'react-bootstrap'

import TopNavbar from '../topNavbar/topNavbar'
import useUser from '../../components/user/useUser/useUser'

import style from './layout.module.css';

const Layout = (props) => {
  const _useUser = useUser(props.origin);

  return (
    <Container fluid className={style.layout}>
      <div className="d-flex flex-column">
        <UniqueModal/>

        <header className="sticky-top">
          <TopNavbar useUser={_useUser} {...props}/>
        </header>
      </div>

      <div className="mt-auto">
        { props.children }
      </div>

      <footer className="mt-auto">

      </footer>

      <Alert stack={{limit: 5}} position="bottom-right" timeout={7500} html={true} />
    </Container>
  )
}

export default Layout;