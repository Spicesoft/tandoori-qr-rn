import React from "react";
import {StackNavigator} from "react-navigation";
import {Container, Content, Text, Button} from "native-base"

import QRScanner from "./QRScanner";
import Service from "./Service";
import Home from "./Home";
import ReservationDetailScreen from "./ReservationDetailScreen";
import Login from "./Login";

import API from "./API";


class App extends React.Component {
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
                    <LoggedApp screenProps={{
                        onLogout: this.onLogout
                    }}/>
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
    }
    onLogout = () => {
        API.logout().then(() => this.setState({
            loggedIn: false
        }));
    } 
}

const LoggedApp = StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: ({screenProps}) => ({
            title: "CoWork.io",
            headerRight: (
                <Button 
                    transparent 
                    style={{paddingRight: 10}}
                    onPress={() => screenProps.onLogout()}
                >
                    <Text>Log out</Text>
                </Button>
            )
        })
    },
    QRScanner: {screen: QRScanner},
    Service: {screen: Service},
    ReservationDetailScreen: {screen: ReservationDetailScreen}
});

export default App;
