import React from "react";
import {StackNavigator} from "react-navigation";
import {Container, Content} from "native-base"

import QRScanner from "./QRScanner";
import Service from "./Service";
import Home from "./Home";
import ReservationDetail from "./ReservationDetail";
import Login from "./Login";

class App extends React.Component {
    state = {
        loggedIn: false
    };
    render() {
        if (this.state.loggedIn) {
            return (
                <Container>
                    <LoggedApp />
                </Container>
            );
        }
        return (
            <Container>
                <Login onLogin={this.onLogin} />
            </Container>
        );
    }

    onLogin = () => {
        this.setState({
            loggedIn: true
        });
    }
}

const LoggedApp = StackNavigator({
  Home: {screen: Home},
  QRScanner: {screen: QRScanner},
  Service: {screen: Service},
  ReservationDetail: {screen: ReservationDetail}
});

export default App;
