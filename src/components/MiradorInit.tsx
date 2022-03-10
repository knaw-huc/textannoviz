import React, { Component } from "react";
import Mirador from "mirador";

export class MiradorInit extends Component {
    componentDidMount() {
        const { config, plugins } = this.props;
        Mirador.viewer(config, plugins);
    }

    render() {
        const { config } = this.props;
        return <div id={config.id} />;
    }
}
