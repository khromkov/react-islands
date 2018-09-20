import React from 'react';
import ReactDOM from 'react-dom';

class Portal extends React.Component {
    constructor(props) {
        super(props);
        this.portalNode = null;
    }

    componentWillUnmount() {
        this.unmountPortal();
    }

    render() {
        const child = React.Children.only(this.props.children);
        if (child) {
            this.mountPortal();
            return ReactDOM.createPortal(
                child,
                this.portalNode
            );
        } else {
            this.unmountPortal();
        }

        return null;
    }

    mountPortal() {
        if (!this.portalNode) {
            this.portalNode = document.createElement('div');
            this.getPortalRootNode().appendChild(this.portalNode);
        }
    }

    unmountPortal() {
        if (this.portalNode) {
            ReactDOM.unmountComponentAtNode(this.portalNode);
            this.getPortalRootNode().removeChild(this.portalNode);
            this.portalNode = null;
        }
    }

    getPortalRootNode() {
        return document.body;
    }
}

export default Portal;
