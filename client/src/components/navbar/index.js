import React, { Component } from 'react';
import './navbar.css';

class NavbarComponent extends Component {

  render() {
    if (this.props.url !== undefined) {
      let current = this.props.url.url.split('/')[0];
      return (
        <nav className="navbar navbar-expand navbar-fixed-top navbar-light stocker-nav">
          <a className="navbar-brand stocker-nav-title" href='/'>Stockerplace</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className={current !== 'social' ? "nav-item dropdown active" : "nav-item dropdown"}>
              <a className="nav-link dropdown-toggle stocker-nav-sub" href="/" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Cloud
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a className="dropdown-item" href="/cloud">Mes fichiers</a>
                <a className="dropdown-item" href="/cloud/upload">Uploader un fichier</a>
              </div>
            </li>
            <li className={current === 'social' ? "nav-item active" : "nav-item"}>
              <a className="nav-link stocker-nav-sub" href="/social">Social</a>
            </li>
          </ul>
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0"></ul>
          <div>
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle stocker-nav-sub" href="/" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.props.user.pseudo}
                </a>
                <div className="dropdown-menu dropdown-profile" aria-labelledby="navbarDropdownMenuLink">
                  <a className="dropdown-item" href={`/user/${this.props.user.id}`}>Profile</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item nav-disconnect" onClick={this.props.disconnect}>Se déconnecter</a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      );
    }
    else {
      return null;
    }
  }
}

export default NavbarComponent;