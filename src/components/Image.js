import React from "react";
import ProgressImage from 'react-native-image-progress';
import Circle from 'react-native-progress/Circle';

export default function (props) {
    return <ProgressImage indicator={Circle} {...props} />;
}
