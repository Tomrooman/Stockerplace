import React, { Component } from 'react';
import Navbar from '../navbar';
import Modal from '../modal';
import Router from '../router';
import Cookies from 'universal-cookie';
import './app.css';

const cookies = new Cookies();

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      page: null,
      page_arg: null,
      content: '',
      show: false
    }
    this.connect_modal = this.connect_modal.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.subscribe_modal = this.subscribe_modal.bind(this);
    this.takeCookieInfos = this.takeCookieInfos.bind(this);
    this.changeContent = this.changeContent.bind(this);
  }

  componentWillMount() {
    this.takeCookieInfos();
  }

  connect_modal() {
    this.setState({
      show: true,
      title: 'Connexion'
    });
  }

  changeContent(content, url) {
    this.setState({ content, url })
  }

  disconnect() {
    window.location.replace('http://localhost:3000?logout')
  }

  subscribe_modal() {
    this.setState({
      show: true,
      title: 'Inscription'
    });
  }

  takeCookieInfos() {
    let user = {}
    if (cookies.get('stockerplace_user')) {
      let cookie = cookies.get('stockerplace_user');
      user['pseudo'] = cookie.pseudo;
      user['email'] = cookie.email;
      user['id'] = cookie.id;
      this.setState({ user })
    }
  }

  render() {
    return (
      <div>
        <Router
          changeContent={this.changeContent}
          user={this.state.user}
        />
        <Modal
          show={this.state.show}
          title={this.state.title}
        />
        <Navbar
          url={this.state.url} connect_modal={this.connect_modal} disconnect={this.disconnect} subscribe_modal={this.subscribe_modal}
          user={this.state.user} />
        {this.state.user && this.state.user['pseudo'] ?
          this.state.content
          : null}
      </div>
    );
  }
}

export default App;