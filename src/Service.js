import React, { Component, PropTypes } from "react";

import moment from "moment";
import PushNotification from 'react-native-push-notification';

import {
    Alert,
    Image,
    StyleSheet,
    RefreshControl,
    View,
    ScrollView
} from "react-native";

import {
    Button,
    Container,
    Content,
    Card,
    CardItem,
    Text,
    Toast,
    Spinner,
    Picker,
    H1,
    H2,
    H3
} from "native-base";

import API from "./API";

import withRequest from "./hoc/withRequest";

/* import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';*/

PushNotification.configure({
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
        // react-navigation doesn't work outside a component
        // We can't navigate to a specific location without adding this hack (TODO)
        // https://github.com/react-community/react-navigation/issues/1439

        // if(notification.serviceId) {
        //     this.props.navigation.navigate("Service", {id: notification.serviceId});
        // }
    }
});

class ServiceWithoutRequest extends Component {
    static navigationOptions = {
        title: "Service"
    };

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false
        };
    }

    static propTypes = {
        loading: PropTypes.bool,
        service: PropTypes.object,
        ranges: PropTypes.array
    };

    confirmReservation(range) {
        Alert.alert(
            "Confirm Reservation",
            `Confirm reservation for service ${this.props.service.name}`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        this.makeReservation(range);
                    }
                }
            ],
            { cancelable: true }
        );
    }

    makeReservation(range) {
        API.createReservation(this.props.service.pk, range)
            .then(() => {
                PushNotification.localNotificationSchedule({
                    /* Android Only Properties */
                    largeIcon: "ic_cowork",
                    smallIcon: "ic_cowork",
                    bigText: "You're booking is about to expire. Do you want to extend your booking ?",
                    subText: this.props.service.name,
                    color: "#0074A6",
                    vibration: 300,

                    /* iOS and Android properties */
                    title: "Booking is expiring",
                    message: "You're booking is about to expire...",
                    date: new Date(range.to_datetime - (5 * 60 * 1000)), // 5min before the end
                    serviceId: this.props.service.pk
                });

                Toast.show({
                    text: "Reservation success",
                    position: "bottom",
                    buttonText: "Okay",
                    duration: 2000
                });

                this.props.navigation.navigate("Home");
            })
            .catch(r => {
                Alert.alert("error", JSON.stringify(r));
            });
    }

    _onRefresh() {
        this.setState({ refreshing: true });
    }

    render() {
        if (this.props.loading) {
            return this.renderLoader();
        }

        const { service } = this.props;
        const image = service.images[0]; // TODO default image
        const imageSource = image
            ? { uri: image.medium_image_url }
            : require("./img/test.jpg");

        return (
            <Container style={styles.root}>
                {/*  TODO refreshControl : refreshControl={
                  <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />
                  }>*/}
                <Content>
                    <View style={styles.imageContainer}>
                        <Image
                            source={imageSource}
                            resizeMode="cover"
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.titleContainer}>
                        <H1 style={styles.title}>{service.name}</H1>
                    </View>

                    <View style={styles.cont}>
                        {this.renderServiceStatus()}
                    </View>
                </Content>
            </Container>
        );
    }

    renderServiceStatus() {
        const dispo = "ranges" in this.props && this.props.ranges.length != 0;

        if (!dispo) {
            return (
                <Card>
                    <CardItem>
                        <Text>
                            This service is unavailable for the moment.{"\n"}
                            {/* Next availability at : {"\n"} */}
                            {/* XXX:XXX */}
                        </Text>
                    </CardItem>
                </Card>
            );
        } else {
            return (
                <Card>
                    <CardItem>
                        <H3>Book the service</H3>
                    </CardItem>
                    <CardItem>
                        <View style={{ flex: 1 }}>
                            {this.props.ranges.map(range =>
                                <Button
                                    block
                                    style={{ margin: 5 }}
                                    key={range.to_datetime.format()}
                                    onPress={() =>
                                        this.confirmReservation(range)}
                                >
                                    <Text>{`Until ${range.to_datetime.format(
                                        "LT"
                                    )}`}</Text>
                                </Button>
                            )}
                        </View>
                    </CardItem>
                </Card>
            );
        }
    }

    renderLoader() {
        return (
            <View style={styles.loadingRoot}>
                <Spinner color="rgb(70, 130, 180)" />
            </View>
        );
    }
}

const styles = {
    cont: {
        padding: 15
    },

    root: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF"
    },

    imageContainer: {
        flexDirection: "row"
    },

    image: {
        height: 150,
        flex: 1
    },

    titleContainer: {
        alignItems: "center",
        padding: 5,
        backgroundColor: "rgb(70, 130, 180)"
    },

    title: {
        fontWeight: "bold",
        color: "white"
    },

    loadingRoot: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },

    card: {
        backgroundColor: "white",
        margin: 10,
        padding: 10,
        borderWidth: 1
    }
};

function isAvailable(availabilityRanges, start, end) {
    for (let i = 0; i < availabilityRanges.length; i++) {
        const { lower, upper } = availabilityRanges[i];
        const safeLower = lower || start; // null means -infinity so start as a lower bound is fine
        const safeUpper = upper || end; // same thing
        return safeLower <= start && end <= safeUpper;
    }
    return false;
}

function insideOpeningHours(start, end, centerOpeningHours) {
    let dayOfWeek = start.day() - 1;

    if (dayOfWeek == -1) {
        dayOfWeek = 6;
    }

    let openingHours = undefined;
    for (let i = 0; i < centerOpeningHours.length; i++) {
        if (centerOpeningHours[i]["day"] == dayOfWeek) {
            openingHours = centerOpeningHours[i];
            break;
        }
    }

    if (openingHours === undefined) {
        return false;
    }

    // TODO take care of center timezone
    opening = moment(openingHours["opening_time"], "HH:mm:ss");
    closing = moment(openingHours["closing_time"], "HH:mm:ss");
    return opening <= start && end <= closing;
}

function extractRanges(availabilityRanges, openingHours) {
    const nowFloored = moment();
    if (nowFloored.minutes() < 30) {
        nowFloored.startOf("hour");
    } else {
        nowFloored.startOf("hour").add(30, "minutes");
    }

    const start = nowFloored;
    const nextHalfHour = moment(start).add(30, "minutes");
    const nextHour = moment(start).add(60, "minutes");
    const nextTwoHours = moment(start).add(120, "minutes");
    const ranges = [];

    [nextHalfHour, nextHour, nextTwoHours].forEach(end => {
        if (
            isAvailable(availabilityRanges, start, end) &&
            insideOpeningHours(start, end, openingHours)
        ) {
            ranges.push({
                from_datetime: start,
                to_datetime: end
            });
        }
    });
    return ranges;
}

const Service = withRequest(ServiceWithoutRequest, {
    requestProps: function request(props) {
        const { id } = props.navigation.state.params;
        return Promise.all([
            API.getServiceDetails(id),
            API.getAvailabilityRangesForService(id)
        ]).then(([service, availabilityRanges]) => {
            return API.getCenterDetails(service.center_pk).then(center => {
                const centerOpeningHours = center["opening_hours"];
                return {
                    service: service,
                    ranges: extractRanges(
                        availabilityRanges,
                        centerOpeningHours
                    )
                };
            });
        });
    }
});

export default Service;
