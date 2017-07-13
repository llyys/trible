import * as React from "react";

export default {
  name: "error",
  path: "/",
  action({ error }) {
    return {
      component: (
        <div className="error">
          <pre>
            {error.stack}
          </pre>
        </div>
      )
    };
  }
};
