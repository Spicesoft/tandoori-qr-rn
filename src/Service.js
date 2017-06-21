import React, {Component, PropTypes} from "react";

import {
    Text,
    View,
    Image
} from "react-native";

import API from "./API";
import withRequest from "./hoc/withRequest";

class Service extends Component {

    static navigationOptions = {
        title: "Service",
    };

    static propTypes = {
        loading: PropTypes.bool,
        service: PropTypes.object,
        ranges: PropTypes.array
    };

    render() {
        if (this.props.loading) {
            return this.renderLoader();
        }
        const {id} = this.props.navigation.state.params;
        return (


            <View style={{flexDirection: "column"}}>
              <View style={{flexDirection: "row"}}>
                <Image
                    source={require('./img/test.jpg')}
                    resizeMode="cover"
                    style={{
                        height: 150,
                        flex: 1
                    }}
                />
              </View>
              <Text>Hello</Text>
            </View>

        );
    }

    renderLoader() {
        return (
            <View>
              <Text>Loading...</Text>
            </View>
        );
    }
}

export default withRequest(Service, {
    requestProps(props) {
        const {id} = props.navigation.state.params;
        return API.getAvailabilitiesForService(id)
                  .then(data => ({
                      service: data
                  }));
    }
})
