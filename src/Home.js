import React, {Component, PropTypes} from "react";
import {
    Body,
    Button,
    Card,
    CardItem,
    Col,
    Container,
    Content,
    Grid,
    Left,
    Icon,
    Right,
    Text,
    Thumbnail
} from "native-base";
import {
    Image,
    View
} from "react-native";

import withRequest from "./hoc/withRequest";

import API from "./API";
import CurrentReservations from "./CurrentReservations";
import IncomingReservations from "./IncomingReservations";
import ReservationDetail from "./ReservationDetail";


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
                    <Card>
                        <CardItem header>
                            <Left>
                                <Thumbnail
                                    source={require("./img/logo.png")}
                                />
                                <Body>
                                    <Text>Welcome to the react-native workshop!</Text>
                                    <Text note>Let's get you a place</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button
                                    button
                                    onPress={() => navigate("QRScanner")}
                                >
                                    <Text>Scan a QR code</Text>
                                </Button>
                            </Left>
                            <Right>
                                <Button
                                    transparent
                                    onPress={() => navigate("Service", {id: 68})}
                                >
                                    <Text>Shortcut service id=68</Text>
                                </Button>
                            </Right>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem header>
                            <Text>Your first reservation for today</Text>
                        </CardItem>
                        <CardItem>
                            <ReservationDetail
                                reservation={this.getFirstCurrentReservation()}
                            />
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

    getFirstCurrentReservation() {
        return this.props.currentReservations ? this.props.currentReservations[0] : {};
    }

}

const styles = {
    cont: {
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
