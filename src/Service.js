import React, {Component} from "react";
import {
  Text,
  View,
} from "react-native";


export default class Service extends Component {

  static navigationOptions = {
    title: "Service",
  };

  render() {
    const {id} = this.props.navigation.state.params;
    return (
      <View>
        <Text>Service {id}</Text>
      </View>
    );
  }

} 
