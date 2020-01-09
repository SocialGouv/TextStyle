import React from "react";
import App from "next/app";
import { ApolloProvider } from "react-apollo";
import withApollo from "../config/withApollo";

import PageLayout from "../components/PageLayout";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  state = {
    history: [] // keep history items in state
  };

  componentDidMount() {
    const { asPath } = this.props.router;

    // lets add initial route to `history`
    this.setState(prevState => ({ history: [...prevState.history, asPath] }));
  }

  componentDidUpdate() {
    const { history } = this.state;
    const { asPath } = this.props.router;
    // if current route (`asPath`) does not equal
    // the latest item in the history,
    // it is changed so lets save it
    if (history[history.length - 1] !== asPath) {
      this.setState(prevState => ({ history: [...prevState.history, asPath] }));
    }
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <ApolloProvider client={apolloClient}>
        <PageLayout>
          <Component history={this.state.history} {...pageProps} />
        </PageLayout>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
