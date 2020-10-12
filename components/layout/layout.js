import React from 'react';
import cx from 'classnames';

import Alert from 'react-s-alert';
import { UniqueModal } from '@naschpitz/unique-modal';
import { Container } from 'react-bootstrap';

import Footer from '../footer/footer';
import TopNavbar from '../topNavbar/topNavbar';

import styles from './layout.module.css';

const Layout = (props) => {
  return (
    <Container fluid className={styles.layout}>
      <div className={cx(styles.box, 'd-flex', 'flex-column')}>
        <UniqueModal />

        <header className="sticky-top">
          <TopNavbar />
        </header>

        <main>
          {props.children}
        </main>

        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>

      <Alert stack={{limit: 5}} position="bottom-right" timeout={7500} html={true} />
    </Container>
  )
}

export default Layout;