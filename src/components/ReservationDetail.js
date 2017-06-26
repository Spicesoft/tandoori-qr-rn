import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Card, CardItem, Spinner, Text } from "native-base";

import Image from "./Image";
import API from "../API.js";
import withRequest from "../hoc/withRequest";

class ReservationDetailComponent extends Component {
    static propTypes = {
        reservation: PropTypes.object.isRequired,
        cardTitle: PropTypes.string.isRequired,
        service: PropTypes.object
    };

    render() {
        const reservation = this.props.reservation;
        if (this.props.loading) {
            return (
                <CardItem style={styles.itemWSpinner}>
                    <Spinner color="rgb(70, 130, 180)" />
                </CardItem>
            );
        }
        return (
            <Card>
                <CardItem header>
                    <Text>{this.props.cardTitle}</Text>
                </CardItem>
                <CardItem style={styles.imgContainer}>
                    <Image
                        source={this.getImageSource()}
                        style={styles.img}
                        resizeMode="contain"
                    />
                </CardItem>
                {this.renderServiceDescription()}
                <CardItem>
                    <Text style={styles.service_type}>
                        {reservation.service.type.name}
                    </Text>
                    <Text> - </Text>
                    <Text style={styles.service}>
                        {reservation.service.name}
                    </Text>
                </CardItem>
                <CardItem>
                    <Text note>
                        From -{" "}
                        {moment(reservation.from_datetime).format("LLLL")}
                        {"\n"}
                        To - {moment(reservation.to_datetime).format("LLLL")}
                    </Text>
                </CardItem>
            </Card>
        );
    }

    getImageSource() {
        if (this.props.service) {
            const { images } = this.props.service;
            if (images.length > 0) {
                return { uri: images[0].medium_image_url };
            }
        }
        return require("../img/test.jpg");
    }

    renderServiceDescription() {
        if (this.props.service) {
            return <Text note>{this.props.service.description}</Text>;
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
    },
    service_type: {
        fontWeight: "bold"
    },
    service: {}
};

const ReservationDetail = withRequest(ReservationDetailComponent, {
    requestProps(props) {
        if (props.reservation.service) {
            const { pk } = props.reservation.service;
            return API.getServiceDetails(pk).then(service => ({
                service: service
            }));
        }
        return Promise.resolve();
    }
});

export default ReservationDetail;
