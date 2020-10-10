import React from 'react'
import Head from 'next/head'
import AbsoluteUrl from 'next-absolute-url'

import Context from '../components/context/context'
import Layout from '../components/layout/layout'
import useUser from '../components/user/useUser/useUser'

export default function Index({ context }) {
  context.useUser = useUser(context.origin);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Context.Provider value={context}>
          <Layout>
            <div>
              Main Content
            </div>
          </Layout>
        </Context.Provider>
      </main>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  const { origin } = AbsoluteUrl(req, 'localhost:3000');

  const context = { origin }

  return { props: { context } }
}