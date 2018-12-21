import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import ReactTooltip from "react-tooltip";
import Modal from "./modal";
import $ from "jquery";
import "./cloud.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faEdit,
  faDownload,
  faBars
} from "@fortawesome/free-solid-svg-icons";

library.add(faTimes);
library.add(faEdit);
library.add(faDownload);
library.add(faBars);

class Cloud extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      files: null,
      loaded: true,
      show: false,
      showName: "",
      title: "",
      choice: ""
    };
    this.leftSubmenu = 0;
    this.onChange = this.onChange.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.remove = this.remove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.rename = this.rename.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.selectFile = this.selectFile.bind(this);
  }

  componentWillMount() {
    if (this.props.user && this.props.user.id) {
      axios.post(`/cloud/${this.props.user.id}`).then(response => {
        this.setState({ files: response.data });
      });
    }
  }

  rename(e) {
    e.preventDefault();
    if (this.state.showName && this.state.title !== this.state.showName) {
      let point = this.state.file.path.lastIndexOf(".");
      let extension = this.state.file.path.substr(
        point,
        this.state.file.path.length - point
      );
      let newName = this.state.showName + extension;
      axios
        .post(`/cloud/rename/${this.state.file._id}`, { showName: newName })
        .then(response => {
          let find = _.find(this.state.files, { _id: response.data._id });
          find.showName = response.data.showName;
          this.setState({
            show: false,
            showName: ""
          });
        });
    }
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  handleRename(file) {
    this.setState({
      choice: "rename",
      show: true,
      file: file,
      title: file.showName
    });
  }

  handleRemove(file) {
    this.setState({
      choice: "remove",
      show: true,
      file: file,
      title: file.showName
    });
  }

  handleChange(event) {
    let value = event.target.value;
    this.setState({
      showName: value
    });
  }

  handleClose() {
    this.setState({
      show: false,
      showName: ""
    });
  }

  handleClick(e, id) {
    console.log(id);
    if (e.target.nodeName !== "svg") {
      let width = $("#" + id).width();
      console.log(width);
      let span = document.createElement("span");
      span.innerHTML = "test";
      $("#" + id)[0].append(span);
      console.log($("#" + id)[0].clientLeft);
    }
  }

  remove() {
    axios.post(`/cloud/remove/${this.state.file._id}`).then(response => {
      if (response.data === true) {
        _.remove(this.state.files, {
          _id: this.state.file._id
        });
      }
    });
  }

  showSubmenu() {
    if ($(".submenu")[0].style.display === "inline-block") {
      $(".submenu").animate(
        {
          left: this.leftSubmenu,
          opacity: 0
        },
        400,
        () => {
          $(".submenu")[0].style.display = "none";
        }
      );
      $(".bars-icon").removeClass("animate");
    } else {
      if (!this.leftSubmenu) {
        this.leftSubmenu = $(".sm-submenu-icon").position().left + 200;
      }
      $(".submenu")[0].style.position = "absolute";
      $(".submenu")[0].style.right = "0";
      $(".submenu")[0].style.display = "inline-block";
      $(".submenu").animate(
        {
          left: $(".sm-submenu-icon").position().left - 200 + "px",
          opacity: 1
        },
        400
      );
      $(".bars-icon").addClass("animate");
    }
  }

  openFileDialog() {
    $(".inputUpload").trigger("click");
  }

  selectFile(e) {
    let formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files[i].name.substr(-3) === ".js") {
        this.setState({
          show: true,
          choice: "errorUpload",
          title: "Fichier js non autorisée"
        });
        return;
      }
      formData.append("file", e.target.files[i]);
    }

    axios
      .post("/cloud", formData, {
        headers: {
          username: this.props.user.pseudo,
          userId: this.props.user.id
        }
      })
      .then(response => {
        if (response.data === true) {
          axios.post(`/cloud/${this.props.user.id}`).then(response => {
            this.setState({
              files: response.data,
              show: true,
              choice: "confirmUpload",
              title: "Upload effectué"
            });
          });
        }
      });
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
          <div className="cloud-title">
            <h1>
              Mes fichiers
              <span
                className="d-lg-none d-xl-none sm-submenu-icon"
                onClick={() => this.showSubmenu()}
              >
                <span>
                  <FontAwesomeIcon className="bars-icon" icon="bars" />
                </span>
              </span>
            </h1>
            <div className="submenu d-lg-none d-xl-none">
              <div
                onClick={() => {
                  this.openFileDialog();
                }}
              >
                <input
                  className="inputUpload"
                  type="file"
                  onChange={this.selectFile}
                  multiple
                />
                Upload
              </div>
            </div>
          </div>
          <div className="files-container col-xs-11 col-sm-11 col-md-11 col-lg-9 col-xl-7">
            {this.state.files && this.state.files.length ? (
              this.state.files.map((file, index) => {
                return (
                  <div
                    className={
                      index === this.state.files.length - 1
                        ? "row file-line-end"
                        : index === 0
                        ? "row file-line-start"
                        : "row file-line"
                    }
                    id={file._id}
                    key={file._id}
                    onClick={e => this.handleClick(e, file._id)}
                  >
                    <div className="col-9 text-left file-name">
                      {file.showName}
                    </div>
                    <div className="col-3">
                      <div className="row file-event">
                        <div
                          data-tip
                          data-for="download"
                          className="file-event-download"
                        >
                          <a href={"/" + file.path} download={file.showName}>
                            <FontAwesomeIcon icon="download" />
                          </a>
                        </div>
                        <ReactTooltip
                          id="download"
                          effect="solid"
                          className="tooltip-download"
                        >
                          <span>Télécharger</span>
                        </ReactTooltip>
                        <div
                          data-tip
                          data-for="edit"
                          onClick={() => {
                            this.handleRename(file);
                          }}
                          className="file-event-rename"
                        >
                          <FontAwesomeIcon icon="edit" />
                        </div>
                        <ReactTooltip
                          id="edit"
                          effect="solid"
                          className="tooltip-rename"
                        >
                          <span>Renommer</span>
                        </ReactTooltip>
                        <div
                          data-tip
                          data-for="remove"
                          className="file-event-remove"
                          onClick={() => {
                            this.handleRemove(file);
                          }}
                        >
                          <FontAwesomeIcon icon="times" />
                        </div>
                        <ReactTooltip
                          id="remove"
                          effect="solid"
                          className="tooltip-remove"
                        >
                          <span>Supprimer</span>
                        </ReactTooltip>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center">
                <h2>Vous n'avez pas de fichier</h2>
              </div>
            )}
          </div>
        </div>
      );
    } else if (this.props.user && this.props.user.id) {
      return <h3 className="text-center">Chargement en cours ...</h3>;
    } else {
      return <div />;
    }
  }
}

export default Cloud;
