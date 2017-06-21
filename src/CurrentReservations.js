import React from "react";
import {
    Card,
    CardItem,
    Text,
} from "native-base";

import API from "./API.js";
import withRequest from "./hoc/withRequest";
import ReservationList from "./ReservationList";

export default class CurrentReservations extends React.Component {

    static propTypes = {
        reservations: React.PropTypes.array,
        onItemPressed: React.PropTypes.func,
        service: React.PropTypes.object
    };

    render() {
        const mainReservation = this.props.reservations;
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
