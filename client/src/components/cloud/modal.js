import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class RenameModal extends Component {

    render() {
        if (this.props.show && this.props.choice === 'rename') {
            let name = '';
            if (!this.props.showName) {
                let point = this.props.title.lastIndexOf('.');
                name = this.props.title.substr(0, point);
            }
            else {
                name = this.props.showName;
            }
            return (
                <div>
                    <Modal
                        isOpen={this.props.show}
                        toggle={this.props.handleClose}
                    >
                        <ModalHeader>{this.props.title}</ModalHeader>
                        <form onSubmit={this.props.rename}>
                            <ModalBody>
                                <div className="row">
                                    <div className="form-group col-md-4">
                                        <label>Nouveau nom</label>
                                        <input name="pseudo" onChange={this.props.handleChange} type="text" value={name} className="form-control" />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="info" onClick={this.props.rename} type='submit'>Renommer</Button>
                                <Button color="danger" onClick={this.props.handleClose}>Fermer</Button>
                            </ModalFooter>
                        </form>
                    </Modal>
                </div>
            );
        }
        else if (this.props.show && this.props.choice === 'remove') {
            return (
                <div>
                    <Modal
                        isOpen={this.props.show}
                        toggle={this.props.handleClose}
                    >
                        <ModalHeader>{this.props.title}</ModalHeader>
                        <form onSubmit={this.props.remove}>
                            <ModalBody>
                                <div className="row">
                                    <div className="form-group">
                                        <p> Êtes-vous sûr de vouloir supprimer ce fichier ?</p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onClick={this.props.remove} type='submit'>Supprimer</Button>
                                <Button color="danger" onClick={this.props.handleClose}>Fermer</Button>
                            </ModalFooter>
                        </form>
                    </Modal>
                </div>
            );
        }
        else if (this.props.show && this.props.choice === 'confirmUpload') {
            return (
                <div>
                    <Modal
                        isOpen={this.props.show}
                        toggle={this.props.handleClose}
                    >
                        <ModalHeader>{this.props.title}</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group">
                                    <p> Fichier uploader avec succès</p>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="info" onClick={this.props.handleClose}>Fermer</Button>
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

export default RenameModal;