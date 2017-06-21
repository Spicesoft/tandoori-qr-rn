import React, {Component, PropTypes} from "react";
import moment from "moment";
import {
    Image,
    StyleSheet,
    View,
} from "react-native";
import { 
    Text,
    H1 
} from 'native-base';

import API from "./API";
import withRequest from "./hoc/withRequest";

class Service extends Component {

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
            <View style={styles.root}>
                <View style={styles.imageContainer}>
                    <Image source={imageSource} resizeMode="cover" style={styles.image} />
                </View>
                <View style={styles.titleContainer}>
                    <H1 style={styles.title}>{service.name}</H1>
                </View>
                <Text>{JSON.stringify(this.props.ranges, null, 2)}</Text>
            </View>
        );
    }

    renderLoader() {
        return (
            <View>
              <Text>Loading...</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flexDirection: "column"
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
        backgroundColor: "#bada55"
    }
});

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
