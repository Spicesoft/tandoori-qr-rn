import React, {Component, PropTypes} from "react";
import {
  Text,
  View,
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
    return (
      <View>
        <Text>Service {this.props.id}</Text>
        <Text>{JSON.stringify(this.props.service, null, 2)}</Text>
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