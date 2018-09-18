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
        <div className="row col-10">
          <div className="profile-picture-container text-center">
            <img alt="profile_picture" className="profile_picture" src={require(`../../images/Anonyme.jpg`)}></img>
          </div>

        <div className="">
          <div className="">
            <p>Lalalalala : lalla</p>
          </div>
          <div className="">
            <p>Lalalalala : lalla</p>
          </div>
          <div className="">
            <p>Lalalalala : lalla</p>
          </div>

          </div>
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