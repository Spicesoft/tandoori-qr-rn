import React from "react";
import {
    Card,
    CardItem,
    Text,
} from "native-base";

import ReservationList from "./ReservationList";

export default class CurrentReservations extends React.Component {

    static propTypes = {
        reservations: React.PropTypes.array,
        onItemPressed: React.PropTypes.func
    };

    render() {
        return (
            <Card>
                <CardItem>
                    <Text>Current reservations</Text>
                </CardItem>
                <ReservationList 
                    reservations={this.props.reservations}
                    onItemPressed={this.props.onItemPressed}
                />
            </Card>
        );
    }
}