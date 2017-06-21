import React, {Component} from "react";
import {Container, Text} from "native-base";

export default class IncomingReservations extends React.Component {

  render() {
    const {reservations} = this.props;
    if (!reservations) {
        return <Text>SOON PD</Text>;
    }

    return this.props.reservations.map((reservation, index) => {
        return (
            <Text>
                {reservation.service} - {reservation.from_datetime} - {reservation.to_datetime}
            </Text>
        );
    });
  }
}
