import React, {Component} from "react";
import {
    Button,
    Card,
    CardItem,
    Container,
    Icon,
    Right,
    Text
} from "native-base";

import API from "./API";

export default class Home extends React.Component {

  static navigationOptions = {
    title: "CoWork.io",
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <Container>
        <Text>Welcome to the react-native workshop!</Text>
        <Card>
          <CardItem
            button
            onPress={() => navigate("QRScanner")}
          >
            <Text>Scan a QR code</Text>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
        </CardItem>
        <CardItem
            button
            onPress={() => navigate("Service", {id: 5})}
        >
          <Text>Shortcut service id=5</Text>
          <Right>
              <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      </Card>
    </Container>
    );
  }

}
