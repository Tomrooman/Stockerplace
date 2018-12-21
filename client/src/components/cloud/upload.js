import React, { Component } from "react";
import axios from "axios";
import FormData from "form-data";
import Modal from "./modal";
import Dropzone from "react-dropzone";

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      files: null,
      show: false,
      title: ""
    };
    this.onChange = this.onChange.bind(this);
    this.upload = this.upload.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onChange(e) {
    let filesList = [];
    for (var i = 0; i < e.target.files.length; i++) {
      filesList.push(e.target.files[i]);
    }
    this.setState({ files: filesList });
  }

  handleClose() {
    this.setState({ show: false });
  }

  upload(files) {
    let filesList = files;
    if (!files[0]) {
      filesList = this.state.files;
    }
    let formData = new FormData();
    filesList.forEach(file => {
      formData.append("file", file);
    });

    axios
      .post("/cloud", formData, {
        headers: {
          username: this.props.user.pseudo,
          userId: this.props.user.id
        }
      })
      .then(response => {
        if (response.data === true) {
          this.setState({
            show: true,
            choice: "confirmUpload",
            title: "Upload effectué"
          });
        }
      });
  }

  render() {
    if (this.props.user && this.props.user.id) {
      return (
        <div className="container">
          <Modal
            choice={this.state.choice}
            handleClose={this.handleClose}
            show={this.state.show}
            title={this.state.title}
          />
          <br />
          <div className="cloud-title text-center">
            <h1>Uploader un fichier</h1>
          </div>
          <div className="dropzone">
            <Dropzone onDrop={this.upload} disableClick={true}>
              <h3>Faites glisser ou selectionner</h3>
              <div className="text-center">
                <input
                  type="file"
                  name="imagetest"
                  onChange={this.onChange}
                  multiple
                />
                <button type="btn-info" onClick={this.upload}>
                  Uploader
                </button>
              </div>
            </Dropzone>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default Upload;
