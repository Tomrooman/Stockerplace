import React, { Component } from 'react';
import Social from '../social';
import Cloud from '../cloud';
import Profile from '../profile';
import Upload from '../cloud/upload';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Router extends Component {

    componentWillMount() {
        let url = window.location.href.split('/');
        let content = '';
        let page = url[3] === "" ? "/" : url[3];
        let origine_page = page
        let page_arg = url[4] ? url[4] : '';
        page = page + '/' + page_arg;
        if (page === "?logout/") {
            cookies.remove('stockerplace_user')
            window.location.replace('http://localhost:3000');
        }
        else if (page === "social/") {
            content = <Social user={this.props.user} />
        }
        else if (page === 'cloud/upload') {
            content = <Upload user={this.props.user} />
        }
        else if (origine_page === "user" && url.length === 5) {
            content = <Profile user={this.props.user} />
        }
        else {
            content = <Cloud user={this.props.user} />
        }
        this.props.changeContent(content, { url: page });
    }

    render() {
        return null
    }
}
export default Router;