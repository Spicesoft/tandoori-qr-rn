import React, {Component, PropTypes} from "react";

import moment from "moment";

import {
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
    Spinner,
    Picker,
    H1, H2, H3
} from 'native-base';

import API from "./API";

import withRequest from "./hoc/withRequest";

/* import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';*/

class Service extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    static navigationOptions = {
        title: "Service",
    };

    static propTypes = {
        loading: PropTypes.bool,
        service: PropTypes.object,
        ranges: PropTypes.array
    };

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
        dispo = ("ranges" in this.props && this.props.ranges.length != 0);

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
                      {this.props.ranges.map(function(range, i) {
                           return (
                               <Button block style={{margin: 5}}>
                                 <Text>{`Until ${range.to_datetime.format("LT")}`}</Text>
                               </Button>
                           )
                       })}
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

function extractRanges(availabilities) {
    return [{
        to_datetime: moment().add(30, "m")
    }, {
        to_datetime: moment().add(60, "m")
    }, {
        to_datetime: moment().add(90, "m")
    }, {
        to_datetime: moment().add(120, "m")
    }];
}

export default withRequest(Service, {
    requestProps(props) {
        const {id} = props.navigation.state.params;

        return Promise
            .all([
                API.getServiceDetails(id),
                API.getAvailabilitiesForService(id)
            ])
            .then(([service, availabilities]) => ({
                service: service,
                ranges: extractRanges(availabilities)
            }));
    }
})
