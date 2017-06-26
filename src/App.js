import React, { Component } from "react";
import { StackNavigator, NavigationActions } from "react-navigation";
import { Container, Content, Text, Button } from "native-base";
import PushNotification from "react-native-push-notification";
import moment from "moment";

import QRScanner from "./components/screens/QRScanner";
import Service from "./components/screens/Service";
import Home from "./components/screens/Home";
import ReservationDetailScreen from "./components/screens/ReservationDetailScreen";

import Login from "./components/Login";
import API from "./API";
import createNavigateToServiceAction from "./utils/createNavigateToServiceAction";

class App extends Component {
    state = {
        checking: true,
        loggedIn: false
    };

    componentDidMount() {
        API.checkLogin().then(loggedIn => {
            this.setState({
                checking: false,
                loggedIn
            });
        });

        PushNotification.configure({
            onNotification: (notification) => {
                console.log( 'NOTIFICATION:', notification );
                if (this.navigator) {
                    this.navigator.dispatch(createNavigateToServiceAction({
                        id: notification.serviceId, 
                        endOfReservationToExtend: moment(notification.reservationEnd)
                    }));
                }
            }
        });

    }

    render() {
        if (this.state.checking) {
            return (
                <Container>
                    <Content><Text>Checking access</Text></Content>
                </Container>
            );
        }
        if (this.state.loggedIn) {
            return (
                <Container>
                    <LoggedApp
                        ref={nav => {this.navigator = nav;}}
                        screenProps={{
                            onLogout: this.onLogout
                        }}
                    />
                </Container>
            );
        }
        return (
            <Container>
                <Login onLoggedIn={this.onLoggedIn} />
            </Container>
        );
    }

    onLoggedIn = () => {
        this.setState({
            loggedIn: true
        });
    };
    onLogout = () => {
        API.logout().then(() =>
            this.setState({
                loggedIn: false
            })
        );
    };
}

const LoggedApp = StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: ({ screenProps }) => ({
            title: "CoWork.io",
            headerRight: (
                <Button
                    transparent
                    style={{ paddingRight: 10 }}
                    onPress={() => screenProps.onLogout()}
                >
                    <Text>Log out</Text>
                </Button>
            )
        })
    },
    QRScanner: { screen: QRScanner },
    Service: { screen: Service },
    ReservationDetailScreen: { screen: ReservationDetailScreen }
});

export default App;
