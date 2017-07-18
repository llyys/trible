import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import * as path from "path";

const manifest = readManifest()
function readManifest(){
  const manifestFile = path.join(__dirname, "../../manifest.json");
  const manifest = require(manifestFile);
  const manifestItems = Object.keys(manifest).filter(
    x => !x.endsWith(".map")
  );
  const scripts = [manifest["vendor.js"], manifest["index.js"]];
  const styles = ["lib.css"];
  manifestItems.filter(x => x.endsWith(".css")).map(item => {
    styles.push(item);
  });
  return {
    scripts, styles
  }
}

const renderStyles=(publicPath:string,styles:string[])=>
  styles && styles.map((s, ix) => <link key={ix} rel="stylesheet" type="text/css" href={`${publicPath}/${s}`} />)

const renderScripts = (publicPath:string, scripts:string[])=>
  scripts && scripts.map((s, ix) => <script key={ix} src={`${publicPath}/${s}`} />)

export const Html: React.SFC<{
  children?: any;
  inlineStyle?: any;
  state?: any;
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
      {renderStyles(publicPath, manifest.styles)}
      {renderStyles(publicPath, styles)}
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
      {renderScripts(publicPath, manifest.scripts)}
      {renderScripts(publicPath, scripts)}
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
  
  return obj && JSON.stringify(obj)
    .replace(/<\/(script)/gi, "<\\/$1")
    .replace(/<!--/g, "<\\!--")
    .replace(/\u2028/g, "\\u2028") // http://stackoverflow.com/a/9168133/351705
    .replace(/\u2029/g, "\\u2029");
}
