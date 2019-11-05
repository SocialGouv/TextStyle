import React from 'react'
import Head from 'next/head'

import Header from './Header'
import GlobalStyles from './styles/GlobalStyles'

export default props => (
  <>
    <GlobalStyles />
    <Head>
      <title>TextStyle</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="stylesheet" type="text/css" href="/static/nprog.css" />
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />

    </Head>

    <Header />

    <div className="main">
      {props.children}
    </div>
  </>
)