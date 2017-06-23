import React from "react";
import {
    Body,
    Card,
    CardItem,
    Icon,
    Left,
    Right,
    Text,
    Spinner
} from "native-base";
import moment from "moment";

export default class ReservationList extends React.Component {
    static PropTypes = {
        reservations: React.PropTypes.array,
        onItemPressed: React.PropTypes.function
    };

    render() {
        return <Body>{this.renderReservations()}</Body>;
    }

    renderReservations() {
        const { reservations } = this.props;
        if (!reservations) {
            return (
                <CardItem style={styles.itemWSpinner}>
                    <Spinner color="rgb(70, 130, 180)" />
                </CardItem>
            );
        }
        return reservations.map(reservation => {
            if (reservation.status === "A") {
                return (
                    <CardItem
                        button
                        onPress={() => this.props.onItemPressed(reservation)}
                        key={reservation.pk}
                    >
                        <Left>
                            <Text style={styles.marginRight}>
                                {reservation.service.type.name}
                            </Text>
                        </Left>
                        <Body>
                            {this.renderReservationTime(
                                reservation.from_datetime,
                                reservation.to_datetime
                            )}
                        </Body>
                        <Right>
                            <Icon name="arrow-forward" />
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
            return <Text>All day</Text>;
        }
        return <Text>From {from} to {to}</Text>;
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
