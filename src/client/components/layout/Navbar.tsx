import * as React from 'react';
import Link from '~/client/components/Link';

class Navbar extends React.Component<any, ExpendableState>{

    constructor(props) {
        super(props);
        this.state={expanded:false}
    }

    toggleCollapsed = () => {
        this.setState({ expanded: !this.state.expanded })
    }



render() {
  return (
    <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
      <Link className="navbar-brand" to="/">Navbar</Link>
      <button className={`navbar-toggler navbar-toggler-right ${this.state.expanded?'':'collapsed'}`} type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
              aria-controls="navbarsExampleDefault"
              aria-expanded="false" aria-label="Toggle navigation"
              onClick={() => this.toggleCollapsed()}>
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`navbar-collapse collapse ${this.state.expanded ? 'show':''}`} id="navbarsExampleDefault">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="navbar-brand" to="/">Home <span className="sr-only">(current)</span></Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">About</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin" className="nav-link disabled" >Disabled</Link>
          </li>
          <NavDropDown/>
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
     )
}
}
export default Navbar;

interface ExpendableState {
    expanded: boolean;
}

class NavDropDown extends React.Component<any, ExpendableState>{
  constructor(props) {
        super(props);
        this.state={expanded:false}
    }

    toggleState = (e) => { e.preventDefault(); this.setState({ expanded: !this.state.expanded }); }

    render() {
        return (
        <li className={`nav-item dropdown ${this.state.expanded?'show':''}`}>
                <a className="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                    onClick={this.toggleState}>Dropdown</a>
            <div className="dropdown-menu" aria-labelledby="dropdown01">
              <a className="dropdown-item" onClick={this.toggleState} href="#">Action</a>
              <a className="dropdown-item" onClick={this.toggleState} href="#">Another action</a>
              <a className="dropdown-item" onClick={this.toggleState} href="#">Something else here</a>
            </div>
          </li>
    )
  }
}