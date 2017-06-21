import React, {Component} from "react";
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Icon,
    Right,
    Text
} from "native-base";
import {
    Image,
    View
} from "react-native";

import API from "./API";

export default class Home extends React.Component {

    static navigationOptions = {
        title: "CoWork.io",
    };

    render() {
        const {navigate} = this.props.navigation;

        return (
            <Container style={styles.cont}>
              <Content>
                <View style={styles.view}>
                  <Image
                    style={styles.img}
                    resizeMode="contain"
                    source={require("./img/coworkio.png")}
                  />
                </View>
                <Card>
                  <CardItem header>
                    <Text>Welcome to the react-native workshop!</Text>
                  </CardItem>
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
                <Card>
                  {this.renderReservation()}
                </Card>
              </Content>
            </Container>
        );
    }

    renderReservation(reservationId) {
        if (reservationId) {
            return (
                <CardItem>{reservationId}</CardItem>
            );
        }
        return (
            <CardItem>
              <Text>You don't have any reservation yet, you fool !</Text>
            </CardItem>
        )
    }

}

const styles = {
    cont: {
        padding: 15,
        backgroundColor: "#FFFFFF"
    },
    img: {
        flex: 1,
        height: 100
    },
    view: {
        flexDirection: "row"
    }
}
