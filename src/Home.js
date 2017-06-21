import React, {Component} from "react";
import {
  Alert,
  Button,
  Text,
  View,
} from "react-native";

import API from "./API";

export default class Home extends React.Component {

  static navigationOptions = {
    title: "CoWork.io",
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View>
        <Text>Welcome to the react-native workshop!</Text>
        <Button
          title="Scan a QR code"
          onPress={() => navigate("QRScanner")}
        />
        <Button
          title="Shortcut service id=5"
          onPress={() => navigate("Service", {id: 5})}
        />
      </View>
    );
  }

}
