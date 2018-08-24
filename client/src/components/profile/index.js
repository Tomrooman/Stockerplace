import React, { Component } from 'react';
import axios from 'axios';
import './profile.css';

class ProfileComponent extends Component {

  constructor() {
    super();
    this.state = {
      data: ''
    }
  }

  componentWillMount() {
    axios.get('/user/' + this.props.user.id)
      .then(response => {
        if (response.data) {
          let data = response.data;
          this.setState({
            data
          })
        }
      })
  }

  render() {
    if (this.state.data) {
      return (
        <div className="container">
          <div className="profile-picture text-center">
            <img alt="profile_picture" src=""></img>
          </div>
          <div className="row">
            <div className="col-6 text-center pseudo">
              <p>pseudo</p>
            </div>
            <div className="col-6 text-center email">
              <p>email</p>
            </div>
          </div>
          <div className="password">
            <p>password</p>
          </div>
        </div>
      );
    }
    else {
      return <div />;
    }
  }
}

export default ProfileComponent;