import Link from "~/client/components/Link";
import * as style from "./home-page.scss";

import * as React from "react";
export const HomePage = () =>
  <div>
    <div className="jumbotron jumbotron-fluid">
      <div className="container">
        <h1 className="display-3">Hello, world!</h1>
        <p className="lead">
          This is a simple hero unit, a simple jumbotron-style component for
          calling extra attention to featured content or information.
        </p>
        <hr className="my-4" />
        <p>
          It uses utility classes for typography and spacing to space content
          out within the larger container.
        </p>
        <p className="lead">
          <Link className="btn btn-primary btn-lg" to="/home/learn-more">
            Learn more
          </Link>
        </p>
      </div>
    </div>
    <div className="container">
      <div className="starter-template">
        <h1>Bootstrap starter template </h1>
        <p className="lead">
          Use this document as a way to quickly start any new project. All you
          get is this text and a mostly barebones HTML document.
        </p>
      </div>
    </div>
    <div className="album text-muted">
      <div className="container">
        <div className="row">
          {Array(6).join().split(",").map((e, i) => {
            return (
            <div className={style.card}>
              <Img height="280" width="250" />
              <p className="card-text">
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This content is a little bit
                longer.
              </p>
            </div>);
          })}
        </div>
      </div>
    </div>
  </div>;

export const Img = ({ height, width }) =>
  <div className={style.image} style={{ height: height}}>
    <div className={style.center}>
      {width}x{height}
    </div>
  </div>;
