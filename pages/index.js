import React from 'react'
import Head from 'next/head'
import AbsoluteUrl from 'next-absolute-url'

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

export async function getServerSideProps({ req, res }) {
  const { origin } = AbsoluteUrl(req, 'localhost:3000');

  return { props: { origin } }
}