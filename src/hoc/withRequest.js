import React, {Component} from "react";
import hoistNonReactStatic from "hoist-non-react-statics";

export default function withRequest(WrappedComponent, {requestProps}) {
    class ComponentWithRequest extends Component {
        state = {
            loading: true,
            newProps: {}
        };
        componentDidMount() {
            this.mounted = true;
            requestProps(this.props).then(newProps => {
                // only do something if we are still mounted
                if (this.mounted) {
                    this.setState({
                        loading: false,
                        newProps
                    });
                }
            });
        }
        componentWillUnmount() {
            this.mounted = false;
        }
        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state.newProps}
                    loading={this.state.loading}
                />
            );
        }
    }
    hoistNonReactStatic(ComponentWithRequest, WrappedComponent);
    return ComponentWithRequest;
}
