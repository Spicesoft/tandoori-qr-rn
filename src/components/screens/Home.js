import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import {
    Body,
    Button,
    Card,
    CardItem,
    Content,
    Icon,
    Left,
    Right,
    Spinner,
    Text,
    Thumbnail
} from "native-base";
import moment from "moment";

import withRequest from "../../hoc/withRequest";
import API from "../../API";
import CurrentReservations from "../CurrentReservations";
import IncomingReservations from "../IncomingReservations";
import ReservationDetail from "../ReservationDetail";

class Home extends Component {
    // navigation options are in App.js

    static propTypes = {
        navigation: PropTypes.object,
        currentReservations: PropTypes.array,
        incomingReservations: PropTypes.array
    };

    render() {
        const { navigate } = this.props.navigation;

        return (
            <Content style={{ flex: 1 }}>
                <Card>
                    <CardItem header>
                        <Left>
                            <Thumbnail source={require("../../img/logo.png")} />
                            <Body>
                                <Text>
                                    Welcome to the react-native workshop!
                                </Text>
                                <Text note>Let's get you a place</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Button
                                iconRight
                                onPress={() => navigate("QRScanner")}
                            >
                                <Text>Scan a QR code</Text>
                                <Icon ios="ios-qr-scanner" android="md-qr-scanner"/>
                            </Button>
                        </Left>
                        <Right>
                            <Button
                                transparent
                                onPress={() => navigate("Service", { id: 68 })}
                            >
                                <Text>Shortcut Béber Pool</Text>
                            </Button>
                        </Right>
                    </CardItem>
                </Card>
                {this.props.loading ? this.renderLoader() : <View>
                    {this.renderReservationDetail()}
                    <CurrentReservations
                        reservations={this.props.currentReservations}
                        onItemPressed={this.goToReservationDetails.bind(this)}
                    />
                    <IncomingReservations
                        reservations={this.props.incomingReservations}
                        onItemPressed={this.goToReservationDetails.bind(this)}
                    />
                </View>}
            </Content>
        );
    }

    goToReservationDetails(reservation) {
        return this.props.navigation.navigate("ReservationDetailScreen", {
            reservation: reservation
        });
    }

    getFirstCurrentReservation() {
        const list = [...(this.props.currentReservations || [])];
        // find the reservation that ends first
        list.sort((a, b) => moment(a.to_datetime) - moment(b.to_datetime));
        return list[0] || null;
    }

    renderReservationDetail() {
        const firstCurrentReservation = this.getFirstCurrentReservation();
        if (firstCurrentReservation !== null) {
            return (
                <ReservationDetail
                    cardTitle="Your first reservation for today"
                    reservation={firstCurrentReservation}
                />
            );
        }
    }

    renderLoader() {
        return (
            <CardItem style={styles.itemWSpinner}>
                <Spinner color="rgb(70, 130, 180)" />
            </CardItem>
        );
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
    },
    itemWSpinner: {
        flex: 1,
        justifyContent: "center"
    }
};

export default withRequest(Home, {
    requestProps(props) {
        return API.getReservations().then(data => {
            return {
                currentReservations: data.currentReservations,
                incomingReservations: data.incomingReservations
            };
        });
    }
});
