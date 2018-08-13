import React, { Component } from 'react';
import SubscribeModal from './subscribeModal';
import ConnexionModal from './connexionModal';
import axios from "axios";
import CryptoJS from 'crypto-js';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class ModalComponent extends Component {

    constructor() {
        super();
        this.state = {
            pseudo : '',
            password : '',
            show : false,
            showFinished : false,
            status : 'inProgress',
            connectError : false,
            errorMessage : ''
        }
        this.handleClose = this.handleClose.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showError = this.showError.bind(this);
        this.connect = this.connect.bind(this);
    }

    connect(e) {
        e.preventDefault();
        if (this.state.pseudo && this.state.password) {
        var encrypted = CryptoJS.HmacSHA1(this.state.password, "Secret key stockerplace");
        axios.post('user/connexion', {
            pseudo : this.state.pseudo,
            password : encrypted.toString()
        })
        .then(response => {
            if (response.data === false) {
                this.showError('Identifiants incorrectes');
            }
            else {
                cookies.set('stockerplace_user', {
                    pseudo : response.data[0].pseudo,
                    email : response.data[0].email,
                    id : response.data[0]._id
                })
                window.location.replace('http://localhost:3000');
            }
        })
        }
        else {
            this.showError('Veuillez écrire un pseudo et un mot de passe');
        }
    }

    subscribe(e) {
        e.preventDefault();
        if (this.state.pseudo && this.state.password && this.state.email) {
            var encrypted = CryptoJS.HmacSHA1(this.state.password, "Secret key stockerplace");
            axios.post('user/subscribe', {
                pseudo : this.state.pseudo,
                password : encrypted.toString(),
                email : this.state.email
            })
            .then(response => {
                if (response.data === false) {
                    this.showError('Ce pseudo est déjà utilisé');
                }
                else {
                    cookies.set('stockerplace_user', {
                        pseudo : response.data.pseudo,
                        email : response.data.email,
                        id : response.data._id
                    })
                    this.setState({
                        status : 'finished',
                        showFinished : true,
                        show : false
                    })
                }
            })
        }
        else {
            this.showError('Veuillez remplir tous les champs');
        }
    }

    showError(message) {
        this.setState({
            connectError : true,
            errorMessage : message
            
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ show : nextProps.show })
    }

    handleClose() {
        this.setState({
            show : false,
            showFinished : false,
            connectError : false
        });
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name] : value
        })
    }

    render() {
        if (this.props.title === 'Inscription') {
            return ( <SubscribeModal
                        connectError={this.state.connectError}
                        errorMessage={this.state.errorMessage}
                        subscribe={this.subscribe}
                        handleClose={this.handleClose}
                        handleChange={this.handleChange}
                        show={this.state.show}
                        showFinished={this.state.showFinished}
                        status={this.state.status}
                        title={this.props.title}

                        /> )
        }
        else {
            return ( <ConnexionModal
                        connect={this.connect}
                        connectError={this.state.connectError}
                        errorMessage={this.state.errorMessage}
                        handleClose={this.handleClose}
                        handleChange={this.handleChange}
                        show={this.state.show}
                        status={this.state.status}
                        title={this.props.title}
            /> )
        }
  }
}

export default ModalComponent;