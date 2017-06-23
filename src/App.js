import React from "react";
import {StackNavigator} from "react-navigation";

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
            return <LoggedApp />;
        }
        return <Login onLogin={this.onLogin} />;
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
