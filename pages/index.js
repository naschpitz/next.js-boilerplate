import React from 'react'
import Head from 'next/head'
import AbsoluteUrl from 'next-absolute-url'
import NextCookies from 'next-cookies'
import _ from 'lodash'

import Layout from '../components/layout/layout'

export default function Index(props) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout {...props}>
          <div>
            Main Content
          </div>
        </Layout>
      </main>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;

  const { origin } = AbsoluteUrl(req, 'localhost:3000');
  const session = NextCookies(ctx).session;

  const props = {};

  props.origin = origin;

  if (session)
    props.session = session;

  return { props }
}