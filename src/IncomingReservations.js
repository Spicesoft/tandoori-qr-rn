import React, {Component} from "react";
import {
    Card,
    CardItem,
    Container,
    Right,
    Text,
    Spinner
} from "native-base";
import {View} from "react-native";
import moment from "moment";

export default class IncomingReservations extends React.Component {

    render() {
      return (
          <Card>
              <CardItem>
                  <Text>Incomming reservations</Text>
              </CardItem>
              {this.renderReservations()}
          </Card>
      );
    }

    renderReservations() {
        const {reservations} = this.props;
        if (!reservations) {
            return <CardItem style={styles.itemWSpinner}><Spinner color='blue' /></CardItem>;
        }
        return reservations.map((reservation, index) => {
            if (reservation.status === "A") {
                return (
                    <CardItem key={index}>
                        <Text style={styles.marginRight}>{reservation.service.name}</Text>
                        <Right>
                            {this.renderReservationTime(
                                reservation.from_datetime,
                                reservation.to_datetime
                            )}
                        </Right>
                    </CardItem>
                );
            }
        });
    }

    renderReservationTime(fromDate, toDate) {
        from = moment(fromDate).format("HH:mm");
        to = moment(toDate).format("HH:mm");
        if (from === "00:00" && to == "00:00") {
            return <Text>All day</Text>
        }
        return (
            <Text>From {from} to {to}</Text>
        );
    }
}

const styles = {
    itemWSpinner: {
        flex: 1,
        justifyContent: "center"
    },
    marginRight: {
        marginRight: 15
    }
};
