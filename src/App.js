import React from "react";
import {StackNavigator} from "react-navigation";
import {Container, Content} from "native-base"

import QRScanner from "./QRScanner";
import Service from "./Service";
import Home from "./Home";
import ReservationDetailScreen from "./ReservationDetailScreen";
import Login from "./Login";

import API from "./API";


class App extends React.Component {
    state = {
        loggedIn: false
    };
    render() {
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
  Home: {screen: Home},
  QRScanner: {screen: QRScanner},
  Service: {screen: Service},
  ReservationDetailScreen: {screen: ReservationDetailScreen}
});

export default App;
