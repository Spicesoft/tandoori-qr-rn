import React, {Component, PropTypes as T} from "react";
import {
    Card,
    CardItem,
    Text
} from "native-base";

export default class ReservationDetail extends Component {

    static navigationOptions = {
        title: "ReservationDetail"
    };

    render() {
        const {reservation} = this.props.navigation.state.params;
        return (
            <Card>
                <CardItem header>
                    <Text>{reservation.service.name}</Text>
                </CardItem>
                <CardItem>
                    <Text>From {reservation.from_datetime}</Text>
                </CardItem>
                <CardItem>
                    <Text>To {reservation.to_datetime}</Text>
                </CardItem>
            </Card>
        );
    }
}

ReservationDetail.propTypes= {
    reservation: T.shape({
        from_datetime: T.string.isRequired,
        to_datetime: T.string.isRequired,
        name: T.string.isRequired
    }).isRequired
}
