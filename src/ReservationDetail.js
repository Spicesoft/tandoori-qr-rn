import React, {Component, PropTypes as T} from "react";
import moment from "moment";
import {
    Container,
    Card,
    CardItem,
    Text,
    H3
} from "native-base";

export default class ReservationDetail extends Component {

    static navigationOptions = {
        title: "ReservationDetail"
    };

    render() {
        const {reservation} = this.props.navigation.state.params;
        return (
            <Container style={styles.cont}>
              <Card>
                <CardItem header>
                  <H3>{reservation.service.name}</H3>
                </CardItem>
                <CardItem>
                  <Text>From {moment(reservation.from_datetime).format("LLLL")}</Text>
                </CardItem>
                <CardItem>
                  <Text>To {moment(reservation.to_datetime).format("LLLL")}</Text>
                </CardItem>
              </Card>
            </Container>
        );
    }
}

const styles = {
    cont: {
        padding: 15,
        backgroundColor: "#FFFFFF"
    }
}

ReservationDetail.propTypes= {
    reservation: T.shape({
        from_datetime: T.string.isRequired,
        to_datetime: T.string.isRequired,
        name: T.string.isRequired
    }).isRequired
}
