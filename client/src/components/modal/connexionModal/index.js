import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class connexionModal extends Component {

    render() {
        if (this.props.status === 'inProgress' && this.props.show) {
            return (
            <div>
                <Modal
                isOpen={this.props.show}
                toggle={this.props.handleClose}
                >
                    <ModalHeader>{this.props.title}</ModalHeader>
                    <form onSubmit={this.props.connect}>
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
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label>Mot de passe</label>
                                <input name="password" onChange={this.props.handleChange} type="password" className="form-control" />
                            </div>
                        </div>
                    
                    </ModalBody>
                    <ModalFooter>
                        <Button color="info" onClick={this.props.connect} type='submit'>Me connecter</Button>
                        <Button color="danger" onClick={this.props.handleClose}>Fermer</Button>
                    </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
        }
            else {
                return null;
            }
    }
}

export default connexionModal;