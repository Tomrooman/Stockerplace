import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip'
import Modal from './modal';
import './cloud.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faDownload } from '@fortawesome/free-solid-svg-icons';

library.add(faTimes);
library.add(faEdit);
library.add(faDownload);


class Cloud extends Component {

  constructor() {
    super();
    this.state = {
      file: null,
      files: null,
      loaded: true,
      show: false,
      showName: '',
      title: '',
      choice: ''
    }
    this.onChange = this.onChange.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.remove = this.remove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.rename = this.rename.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  componentWillMount() {
    if (this.props.user && this.props.user.id) {
      axios.get(`/cloud/${this.props.user.id}`)
        .then(response => {
          this.setState({ files: response.data })
        })
    }
  }

  rename(e) {
    e.preventDefault();
    if (this.state.showName && this.state.title !== this.state.showName) {
      let point = this.state.file.path.lastIndexOf('.');
      let extension = this.state.file.path.substr(point, this.state.file.path.length - point)
      let newName = this.state.showName + extension;
      axios.post(`/cloud/rename/${this.state.file._id}`,
        { showName: newName }
      )
        .then(response => {
          let find = _.find(this.state.files, { '_id': response.data._id });
          find.showName = response.data.showName;
          this.setState({
            show: false,
            showName: ''
          })
        })
    }
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  handleDownload(file) {
    console.log('handle download file', file);
  }

  handleRename(file) {
    this.setState({
      choice: 'rename',
      show: true,
      file: file,
      title: file.showName
    })
  }

  handleRemove(file) {
    this.setState({
      choice: 'remove',
      show: true,
      file: file,
      title: file.showName
    })
  }

  handleChange(event) {
    let value = event.target.value;
    this.setState({
      showName: value
    })
  }

  handleClose() {
    this.setState({
      show: false,
      showName: ''
    });
  }

  remove() {
    axios.post(`/cloud/remove/${this.state.file._id}`)
      .then(response => {
        if (response.data === true) {
          _.remove(this.state.files, {
            _id: this.state.file._id
          });
        }
      })
  }

  render() {
    if (this.props.user && this.props.user.id && this.state.files) {
      return (
        <div className="">
          <Modal
            choice={this.state.choice}
            handleChange={this.handleChange}
            handleClose={this.handleClose}
            rename={this.rename}
            remove={this.remove}
            show={this.state.show}
            showName={this.state.showName}
            title={this.state.title}
          />
          <br />
          <div className="cloud-title text-center">
            <h1>Mes fichiers</h1>
          </div>
          {this.state.files && this.state.files.length ?
            <div className="files-container col-sm-8 col-md-7 col-lg-6 col-xl-5">
              {this.state.files.map((file, index) => {
                return (
                  <div className={index === this.state.files.length - 1 ? "row file-line-end" : index === 0 ? "row file-line-start" : "row file-line"} key={file._id}>
                    <div className="col-9 text-left file-name">
                      {file.showName}
                    </div>
                    <div className="col-3">
                      <div className="row file-event">
                        <div data-tip data-for='download' className='file-event-download'>
                          <a href={"/" + file.path} download={file.showName}><FontAwesomeIcon icon="download" /></a>
                        </div>
                        <ReactTooltip id='download' effect='solid' className="tooltip-download">
                          <span>Télécharger</span>
                        </ReactTooltip>
                        <div data-tip data-for='edit' onClick={() => { this.handleRename(file) }} className="file-event-rename">
                          <FontAwesomeIcon icon="edit" />
                        </div>
                        <ReactTooltip id='edit' effect='solid' className="tooltip-rename">
                          <span>Renommer</span>
                        </ReactTooltip>
                        <div data-tip data-for='remove' className="file-event-remove" onClick={() => { this.handleRemove(file) }}>
                          <FontAwesomeIcon icon="times" />
                        </div>
                        <ReactTooltip id='remove' effect='solid' className="tooltip-remove">
                          <span>Supprimer</span>
                        </ReactTooltip>

                      </div>
                    </div>
                  </div>
                )
              })}
            </div> :
            <div className="text-center">
              <h2>Vous n'avez pas de fichier</h2>
            </div>
          }
          <br />
        </div>
      );
    }
    else if (this.props.user && this.props.user.id) {
      return (
        <h3 className="text-center">Chargement en cours ...</h3>
      )
    }
    else {
      return <div />;
    }
  }
}

export default Cloud;