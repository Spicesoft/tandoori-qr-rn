import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardItem, Text } from "native-base";

import ReservationList from "./ReservationList";

export default class CurrentReservations extends Component {
    static propTypes = {
        reservations: PropTypes.array,
        onItemPressed: PropTypes.func,
        service: PropTypes.object
    };

    render() {
        return (
            <Card>
                <CardItem>
                    <Text>All Current reservations</Text>
                </CardItem>
                <ReservationList
                    reservations={this.props.reservations}
                    onItemPressed={this.props.onItemPressed}
                />
            </Card>
        );
    }
}
