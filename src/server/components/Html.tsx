import * as React from 'react';
import * as ReactDOM from 'react-dom/server';


export const Html: React.SFC<{
  children?: any;
  inlineStyle?: any;
  state: any;
  styles?: any;
  scripts?: any;
}> = ({ children, inlineStyle, state, styles, scripts }) => {
  const publicPath = '/public';
  return (<html className="no-js" lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta httpEquiv="cleartype" content="on" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,700" rel="stylesheet"/>
      {styles &&
        styles.map((s, ix) =>
          <link key={ix} rel="stylesheet" type="text/css" href={`${publicPath}/${s}`} />
        )}
      {inlineStyle &&
        <style id="css" dangerouslySetInnerHTML={{ __html: inlineStyle }} />}
    </head>
    <body>
      <div id="root">{children}</div>
        <script
        id="__route_state"
        type="application/json"
        data-initial-state={safeStringify(state)}
      />
      {scripts && scripts.map((s, ix) => <script key={ix} src={`${publicPath}/${s}`} />)}
      <Analytics />
    </body>
  </html>)
  }




const Analytics: React.SFC<{ trackingId?: string }> = ({ trackingId }) =>
  <div>
    {trackingId &&
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;" +
              `ga('create','${trackingId}','auto');ga('send','pageview')`
        }}
      />}
    {trackingId &&
      <script
        src="https://www.google-analytics.com/analytics.js"
        async
        defer
      />}
  </div>;

function safeStringify(obj) {
  return JSON.stringify(obj)
    .replace(/<\/(script)/gi, "<\\/$1")
    .replace(/<!--/g, "<\\!--")
    .replace(/\u2028/g, "\\u2028") // http://stackoverflow.com/a/9168133/351705
    .replace(/\u2029/g, "\\u2029");
}
export const renderHtml = (res, state, children, scripts, styles) => {
    let html = ReactDOM.renderToStaticMarkup(<Html state={state} scripts={scripts} styles={styles}><App>{children}</App></Html>);
  res.status(200);
  res.send(`<!doctype html>${html}`);
}

export class App extends React.Component<any, any>{
  render() {
    return (<div className="app">{this.props.children}</div>)
  }
}