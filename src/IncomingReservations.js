import React from "react";
import {
    Card,
    CardItem,
    Container,
    Text,
} from "native-base";

import ReservationList from "./ReservationList";

export default class IncomingReservations extends React.Component {

    static propTypes = {
        reservations: React.PropTypes.array,
        onItemPressed: React.PropTypes.func
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
