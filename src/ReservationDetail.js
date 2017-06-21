import React, {Component, PropTypes as T} from "react";
import moment from "moment";
import {
    Button,
    Body,
    Card,
    CardItem,
    Container,
    Icon,
    Left,
    Right,
    Spinner,
    Text,
    H3
} from "native-base";
import {
    Image,
    View
} from "react-native";
import API from "./API.js";
import withRequest from "./hoc/withRequest";

class ReservationDetailComponent extends Component {

    static PropTypes = {
        reservation: T.object.isRequired
    };

    render() {
        const reservation = this.props.reservation;
        if (!reservation.service) {
            return <CardItem style={styles.itemWSpinner}><Spinner color='rgb(70, 130, 180)' /></CardItem>;
        }
        return (
            <Body>
                <CardItem style={styles.imgContainer}>
                    <Image
                        source={this.getImageSource()}
                        style={styles.img}
                        resizeMode="cover"
                    />
                </CardItem>
                {this.renderServiceDescription()}
                <CardItem>
                    <Text>{reservation.service.type.name}</Text>
                </CardItem>
                <CardItem>
                    <Text note>From - {moment(reservation.from_datetime).format("LLLL")}</Text>
                </CardItem>
                <CardItem>
                    <Text note>To - {moment(reservation.to_datetime).format("LLLL")}</Text>
                </CardItem>
                <CardItem>
                    <Right>
                        <Button
                            transparent
                        >
                            <Text>See details</Text>
                            <Icon name="arrow-forward" />
                        </Button>
                    </Right>
                </CardItem>
            </Body>
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
    },
    itemWSpinner: {
        flex: 1,
        justifyContent: "center"
    },
    text: {
        marginTop: 5,
        marginBottom: 5
    }
}

const ReservationDetail = withRequest(ReservationDetailComponent, {
    requestProps(props) {
        if (props.reservation.service) {
            const {pk} = props.reservation.service;
            return  API.getServiceDetails(pk)
                .then(service => ({
                    service: service,
                }));
        }
        return Promise.resolve();
    }
});

export default ReservationDetail;
