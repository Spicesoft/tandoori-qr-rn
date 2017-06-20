import React, {Component} from "react";
import {
  Button,
  Text,
  View,
} from "react-native";


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
      </View>
    );
  }

}
