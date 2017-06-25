import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardItem, Text } from "native-base";

import ReservationList from "./ReservationList";

export default class CurrentReservations extends Component {
    static propTypes = {
        reservations: PropTypes.array,
        onItemPressed: PropTypes.func
    };

    render() {
        const { reservations } = this.props;
        if (!reservations || reservations.length === 0) {
            return (
                <Card>
                    <CardItem>
                        <Text>No current reservations</Text>
                    </CardItem>
                </Card>
            );
        }
        return (
            <Card>
                <CardItem>
                    <Text>All Current reservations</Text>
                </CardItem>
                <ReservationList
                    reservations={reservations}
                    onItemPressed={this.props.onItemPressed}
                />
            </Card>
        );
    }
}
