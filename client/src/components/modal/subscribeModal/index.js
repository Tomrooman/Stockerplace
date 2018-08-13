import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class SubscribeModal extends Component {

    constructor() {
        super();
        this.handleCloseFinished = this.handleCloseFinished.bind(this);
    }

    handleCloseFinished() {
        window.location.replace('http://localhost:3000');
    }

render() {
    if (this.props.status === 'inProgress' && this.props.show) {
        return (
        <div>
            <Modal
            isOpen={this.props.show}
            toggle={this.props.handleClose}
            >
                <ModalHeader>{this.props.title}</ModalHeader>
                <form onSubmit={this.props.subscribe}>
                <ModalBody>
                    { this.props.connectError ?
                        <div className="alert alert-danger" role="alert">
                            {this.props.errorMessage}
                        </div>
                        : null }
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label>Pseudo</label>
                            <input name="pseudo" onChange={this.props.handleChange} type="text" className="form-control" />
                        </div>
                    </div>
            <       div className="row">
                        <div className="form-group col-md-4">
                            <label>Mot de passe</label>
                            <input name="password" onChange={this.props.handleChange} type="password" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label>Addresse email</label>
                            <input name="email" onChange={this.props.handleChange} type="email" className="form-control" />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={this.props.subscribe} type='submit'>M'inscrire</Button>
                    <Button color="danger" onClick={this.props.handleClose}>Fermer</Button>
                </ModalFooter>
                </form>
            </Modal>
        </div>
    );
    }
        else if (this.props.status === 'finished' && this.props.showFinished) {
            return (
                <div>
                    <Modal
                        isOpen={this.props.showFinished}
                        toggle={this.handleCloseFinished}
                    >
                <ModalHeader>Inscription terminée</ModalHeader>
                <ModalBody>
                    <p>Vous allez recevoir un mail de confirmation contenant vos informations de connexions !</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.handleCloseFinished}>Fermer</Button>
                </ModalFooter>
            </Modal>
                </div>
            );
        }
        else {
            return null;
        }
}
}

export default SubscribeModal;