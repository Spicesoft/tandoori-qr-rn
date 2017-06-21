import React from "react";
import {StackNavigator} from "react-navigation";

import QRScanner from "./QRScanner";
import Service from "./Service";
import Home from "./Home";
import ReservationDetail from "./ReservationDetail";

const App = StackNavigator({
    Home: {screen: Home},
    QRScanner: {screen: QRScanner},
    Service: {screen: Service},
    ReservationDetail: {screen: ReservationDetail}
});

export default App;
