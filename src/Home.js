import React, {Component, PropTypes} from "react";
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

import withRequest from "./hoc/withRequest";

import API from "./API";
import CurrentReservations from "./CurrentReservations"
import IncomingReservations from "./IncomingReservations"


class Home extends React.Component {

    static navigationOptions = {
        title: "CoWork.io",
    };

    static propTypes = {
        navigation: PropTypes.object,
        currentReservations: PropTypes.array,
        incomingReservations: PropTypes.array
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
                    onPress={() => navigate("Service", {id: 68})}
                  >
                    <Text>Shortcut service id=68</Text>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
                  </CardItem>
                </Card>
                <CurrentReservations
                    reservations={this.props.currentReservations}
                    onItemPressed={this.goToReservationDetails.bind(this)}
                />
                <IncomingReservations
                    reservations={this.props.incomingReservations}
                    onItemPressed={this.goToReservationDetails.bind(this)}
                />
              </Content>
            </Container>
        );
    }

    goToReservationDetails(reservation) {
        return this.props.navigation.navigate("ReservationDetail", {reservation: reservation});
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

export default withRequest(Home, {
    requestProps(props) {
        return API.getReservations()
            .then(data => {
                return {
                    currentReservations: data.currentReservations,
                    incomingReservations: data.incomingReservations
                }
            });
    }
})
