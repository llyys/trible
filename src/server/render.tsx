import * as React from "react";
import * as ReactDOM from "react-dom/server";
import generateETag from 'etag';
import fresh from 'fresh'; //Check freshness of the response using request and response headers.

import { Html } from "~/server/components/Html";

export function renderHTML(state: any, children: any) {
  const html = ReactDOM.renderToString(<Html state={state}>{children}</Html>);

  return `<!doctype html> ${html}`;
}

function errorToJSON (err) {
  const { name, message, stack } = err
  const json = { name, message, stack }

  if (err.module) {
    // rawRequest contains the filename of the module which has the error.
    const { rawRequest } = err.module
    json['module'] = { rawRequest }
  }

  return json
}

export function sendHTML (req, res, html, method, { dev }) {
  if (res.finished) return
  const etag = generateETag(html)

  if (fresh(req.headers, { etag })) {
    res.statusCode = 304
    res.end()
    return
  }

  if (dev) {
    // In dev, we should not cache pages for any reason.
    // That's why we do this.
    res.setHeader('Cache-Control', 'no-store, must-revalidate')
  }

  res.setHeader('ETag', etag)
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(method === 'HEAD' ? null : html)
}