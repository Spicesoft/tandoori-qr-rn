import React, {Component, PropTypes as T} from "react";
import moment from "moment";
import {
    Body,
    Container,
    Card,
    CardItem,
    Icon,
    Text,
    H3
} from "native-base";
import {
    Image
} from "react-native";
import API from "./API.js";
import withRequest from "./hoc/withRequest";

class ReservationDetailComponent extends Component {

    static navigationOptions = {
        title: "ReservationDetail"
    };
    static PropTypes = {
        navigation: T.object.isRequired,
        service: T.object.isRequired,
    }

    render() {
        const {reservation} = this.props.navigation.state.params;
        const {navigate} = this.props.navigation;
        return (
            <Card style={{flex: 0}}>
                <CardItem header>
                  <H3>{reservation.service.type.name}</H3>
                </CardItem>
                <CardItem>
                    <Body style={styles.imgContainer}>
                        <Image
                            source={this.getImageSource()}
                            style={styles.img}
                            resizeMode="cover"
                        />
                    </Body>
                </CardItem>
                <CardItem>
                    {this.renderServiceDescription()}
                </CardItem>
                <CardItem>
                  <Text>From {moment(reservation.from_datetime).format("LLLL")}</Text>
                </CardItem>
                <CardItem>
                  <Text>To {moment(reservation.to_datetime).format("LLLL")}</Text>
                </CardItem>
            </Card>
        );
    }

    getImageSource() {
        if (this.props.service) {
            const {images} = this.props.service;
            if (images.lenght > 0) {
                return {uri: images[0]}; // Might need improvement
            }
        }
        return require("./img/test.jpg");
    }

    renderServiceDescription() {
        if (this.props.service) {
            return <Text note>{this.props.service.description}</Text>
        }
    }
}

const styles = {
    cont: {
        padding: 15,
        backgroundColor: "#FFFFFF"
    },
    img: {
        height: 200,
        flex: 1
    },
    imgContainer: {
        flexDirection: "row"
    }
}


const ReservationDetail = withRequest(ReservationDetailComponent, {
    requestProps(props) {
        const {pk} = props.navigation.state.params.reservation.service;
        return  API.getServiceDetails(pk)
            .then(service => ({
                service: service,
            }));
  }
});

export default ReservationDetail
