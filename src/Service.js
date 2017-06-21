import React, {Component, PropTypes} from "react";

import moment from "moment";

import {
    Alert,
    Image,
    StyleSheet,
    View, ScrollView
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
    H1, H2, H3
} from 'native-base';

import API from "./API";

import withRequest from "./hoc/withRequest";

/* import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';*/

class ServiceWithoutRequest extends Component {

    static navigationOptions = {
        title: "Service",
    };

    static propTypes = {
        loading: PropTypes.bool,
        service: PropTypes.object,
        ranges: PropTypes.array
    };

    confirmReservation(range) {
        Alert.alert(
            'Confirm Reservation',
            'My Alert Msg',
            [
                {
                     text: 'Cancel',
                     style: 'cancel'
                 }, {
                     text: 'OK',
                     onPress: () => {
                         this.makeReservation(range);
                     }
                 },
            ], { cancelable: true } );
    }

    makeReservation(range) {
        API.createReservation(this.props.service.pk, range)
           .then(() => {
               Toast.show({
                   text: "Reservation success",
                   position: "bottom",
                   buttonText: "Okay",
                   duration: 2000,

               });
               this.props.navigation.navigate("Home");
           })
           .catch((r) => { Alert.alert("error", JSON.stringify(r))});

    }

    render() {
        if (this.props.loading) {
            return this.renderLoader();
        }

        const {service} = this.props;
        const image = service.images[0]; // TODO default image
        const imageSource = {
            uri: image.medium_image_url
        };

        return (
            <Container style={styles.root}>
              <Content>
                <View style={styles.imageContainer}>
                  <Image source={imageSource} resizeMode="cover" style={styles.image} />
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
        const dispo = ("ranges" in this.props && this.props.ranges.length != 0);

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
                    <View style={{flex: 1}}>
                      {this.props.ranges.map(range =>
                          <Button block
                                  style={{margin: 5}} key={range.to_datetime.format()}
                                  onPress={() => this.confirmReservation(range)}
                          >
                            <Text>{`Until ${range.to_datetime.format("LT")}`}</Text>
                          </Button>
                      )}
                    </View>
                  </CardItem>
                </Card>
            )
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
        padding: 15,
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
        backgroundColor: "rgb(70, 130, 180)",
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
        const {lower, upper} = availabilityRanges[i];
        const safeLower = lower || start; // null means -infinity so start as a lower bound is fine
        const safeUpper = upper || end;   // same thing
        if (safeLower <= start && end <= safeUpper) {
            return true;
        }
    }
    return false;
}

function extractRanges(availabilityRanges) {
    const nowFloored = moment();
    if (nowFloored.minutes() < 30) {
        nowFloored.startOf("hour");
    }
    else {
        nowFloored.startOf("hour").add(30, "minutes");
    }

    const start = nowFloored;
    const nextHalfHour = moment(start).add(30, "minutes");
    const nextHour = moment(start).add(60, "minutes");
    const nextTwoHours = moment(start).add(120, "minutes");
    const ranges = [];
    [nextHalfHour, nextHour, nextTwoHours].forEach(end => {
        if (isAvailable(availabilityRanges, start, end)) {
            ranges.push({
                from_datetime: start,
                to_datetime: end
            });
        }
    });
    return ranges;
}

const Service = withRequest(ServiceWithoutRequest, {
    requestProps(props) {
        const {id} = props.navigation.state.params;
        return Promise
            .all([
                API.getServiceDetails(id),
                API.getAvailabilityRangesForService(id)
            ])
            .then(([service, availabilityRanges]) => ({
                service: service,
                ranges: extractRanges(availabilityRanges)
            }));
  }
});

export default Service
