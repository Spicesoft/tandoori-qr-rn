import React, { Component } from "react";
import PropTypes from "prop-types";

import ReservationDetail from "../ReservationDetail";

export default class ReservationDetailScreen extends Component {
    static navigationOptions = {
        title: "Your reservation"
    };
    static propTypes = {
        navigation: PropTypes.object.isRequired
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
