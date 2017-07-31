import * as React from "react";
import * as style from "./login.scss";
const Page = () => {
  return (
    <div className={style.container}>
      <img className="card-img-top" src="..." alt="Card image cap" />
      <div className="card-block">
        <h4 className="card-title">Card title</h4>
        <p className="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <a href="/auth/twitter" className="btn btn-primary">
          Twitter
        </a>
      </div>
    </div>
  );
};
export default Page;
