import React, {Component, PropTypes as T} from "react";
import {
    Card,
    CardItem,
    Text
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
                    <Text>{reservation.service.type.name}</Text>
                </CardItem>
                <CardItem>

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
