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
import CurrentReservation from "./CurrentReservation"
import IncomingReservations from "./IncomingReservations"


class Home extends React.Component {

    static navigationOptions = {
        title: "CoWork.io",
    };

    static propTypes = {
        navigation: PropTypes.object,
        reservations: PropTypes.array
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
                    <CardItem>
                        <CurrentReservation reservation={{}} />
                    </CardItem>
                </Card>
                <IncomingReservations
                    reservations={this.props.reservations}
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
            .then(data => ({
                reservations: data
            }));
    }
})
