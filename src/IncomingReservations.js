import React, {Component} from "react";
import {Card, CardItem, Container, Text, Spinner} from "native-base";
import {View} from "react-native";

export default class IncomingReservations extends React.Component {

    render() {
      return <Card>{this.renderReservations()}</Card>
    }

    renderReservations() {
        const {reservations} = this.props;
        if (!reservations) {
            return <CardItem><Spinner color='blue' /></CardItem>;
        }
        return reservations.map((reservation, index) => {
            return (
                <CardItem key={index}>
                    <Text>{reservation.service.name} - {reservation.from_datetime} - {reservation.to_datetime}</Text>
                </CardItem>
            );
        });
    }
}
