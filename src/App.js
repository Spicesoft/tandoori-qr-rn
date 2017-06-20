import React from "react";
import {StackNavigator} from "react-navigation";

import QRScanner from "./QRScanner";
import Service from "./Service";
import Home from "./Home";

const App = StackNavigator({
  Home: {screen: Home},
  QRScanner: {screen: QRScanner},
  Service: {screen: Service},
});

export default App;
