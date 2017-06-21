import React from "react";
import {StackNavigator} from "react-navigation";

import QRScanner from "./QRScanner";
import Service from "./Service";
import Home from "./Home";
import ReservationDetailScreen from "./ReservationDetailScreen";

const App = StackNavigator({
    Home: {screen: Home},
    QRScanner: {screen: QRScanner},
    Service: {screen: Service},
    ReservationDetail: {screen: ReservationDetailScreen}
});

export default App;
