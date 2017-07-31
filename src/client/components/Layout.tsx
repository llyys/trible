import * as React from "react";
import * as style from "./layout.scss";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
const Layout = ({ path, title, children }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="content">
        {children}
      </div>
      <Footer />
    </div>
  );
};
export default Layout;
