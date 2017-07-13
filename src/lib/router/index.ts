class RouterError extends Error {
  cancelled?: boolean;
}

export interface IRoute{
  name?: string;
  path: string;
  action: Function;
  getInitialProps?: Function;
  children?:Array<IRoute>
}


/**
* This looks at static needs parameter in components
* and waits for the promise to be fullfilled.
*
* It is used to make sure server side rendered pages
* wait for APIs to resolve before returning res.end().
*
* As seen in: https://github.com/caljrimmer/isomorphic-redux-app
*/

export default function waitFor(dispatch, components, params) {
  return Promise.all(
    components.reduce((previous, current) => {
      return (current.need || []).concat(previous);
    }, []).map(need => dispatch(need(params)))
  );
}


/*
export class Router {
  componentLoadCancel = null;
  async getInitialProps(Component, ctx) {
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };
    this.componentLoadCancel = cancel;

    const props = await loadGetInitialProps(Component, ctx);

    if (cancel === this.componentLoadCancel) {
      this.componentLoadCancel = null;
    }

    if (cancelled) {
      const err = new RouterError("Loading initial props cancelled");
      err.cancelled = true;
      throw err;
    }

    return props;
  }
}

export async function loadGetInitialProps(Component, ctx) {
  if (!Component.getInitialProps) return {};

  const props = await Component.getInitialProps(ctx);
  if (!props && (!ctx.res || !ctx.res.finished)) {
    const compName = Component.displayName || Component.name;
    const message = `"${compName}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
    throw new Error(message);
  }
  return props;
}
*/