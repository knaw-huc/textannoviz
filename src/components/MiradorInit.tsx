import React, { Component } from "react";
//import mirador from "mirador";
import Mirador from "mirador/dist/es/src/index";

class MiradorInit extends Component {
    componentDidMount() {
        const { config, plugins } = this.props;
        Mirador.viewer(config, plugins);
    }

    render() {
        const { config } = this.props;
        return <div id={config.id} />;
    }
}

export default MiradorInit;