import React, {Component, PropTypes as T} from "react";
import moment from "moment";
import {
    Container,
    Card,
    CardItem,
    Text,
    H3
} from "native-base";
import API from "./API.js";
import withRequest from "./hoc/withRequest";

class ReservationDetailComponent extends Component {

    static navigationOptions = {
        title: "ReservationDetail"
    };
    static PropTypes = {
        navigation: T.object.isRequired
    }

    render() {
        const {reservation} = this.props.navigation.state.params;
        console.log(reservation);
        return (
            <Card style={{flex: 0}}>
                <CardItem header>
                  <H3>{reservation.service.type.name}</H3>
                </CardItem>
                <CardItem>
                  <Text>From {moment(reservation.from_datetime).format("LLLL")}</Text>
                </CardItem>
                <CardItem>
                  <Text>To {moment(reservation.to_datetime).format("LLLL")}</Text>
                </CardItem>
                <CardItem>
                    <Text>To {reservation.to_datetime}</Text>
                </CardItem>
            </Card>
        );
    }
}

const styles = {
    cont: {
        padding: 15,
        backgroundColor: "#FFFFFF"
    }
}


const ReservationDetail = withRequest(ReservationDetailComponent, {
    requestProps(props) {
        console.log(props);
        const {pk} = props.navigation.state.params.reservation;
        return  API.getServiceDetails(pk)
            .then(service => ({
                service: service,
            }));
  }
});

export default ReservationDetail
