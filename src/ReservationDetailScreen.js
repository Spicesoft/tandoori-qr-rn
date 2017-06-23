import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Body, Container, Card, CardItem, Icon, Text, H3 } from "native-base";
import { Image } from "react-native";

import API from "./API.js";
import withRequest from "./hoc/withRequest";
import ReservationDetail from "./ReservationDetail";

export default class ReservationDetailScreen extends Component {
    static navigationOptions = {
        title: "ReservationDetailScreen"
    };
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        service: PropTypes.object.isRequired
    };

    render() {
        const { reservation } = this.props.navigation.state.params;
        const { navigate } = this.props.navigation;
        return (
            <ReservationDetail
                cardTitle="Reservation details"
                reservation={reservation}
            />
        );
    }
}

const styles = {
    cont: {
        padding: 15,
        backgroundColor: "#FFFFFF"
    },
    img: {
        height: 200,
        flex: 1
    },
    imgContainer: {
        flexDirection: "row"
    }
};
