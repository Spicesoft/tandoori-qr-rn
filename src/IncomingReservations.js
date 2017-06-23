import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardItem, Container, Text } from "native-base";

import ReservationList from "./ReservationList";

export default class IncomingReservations extends Component {
    static propTypes = {
        reservations: PropTypes.array,
        onItemPressed: PropTypes.func
    };

    render() {
        return (
            <Card>
                <CardItem>
                    <Text>Incoming reservations</Text>
                </CardItem>
                <ReservationList
                    reservations={this.props.reservations}
                    onItemPressed={this.props.onItemPressed}
                />
            </Card>
        );
    }
}
