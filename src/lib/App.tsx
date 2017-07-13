import * as React from 'react';

interface AppProps{
  hash?: string;
}
export class App extends React.Component<AppProps, any> {
  constructor(props) {
    super(props);
  }
  scrollToHash () {
    const { hash } = this.props;
    if (!hash) return

    const el = document.getElementById(hash)
    if (!el) return

    // If we call scrollIntoView() in here without a setTimeout
    // it won't scroll properly.
    setTimeout(() => el.scrollIntoView(), 0)
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export const isProduction = "production" === process.env.NODE_ENV;