import { NavigationActions } from "react-navigation";

export default function createNavigateToServiceAction({
    id,
    endOfReservationToExtend
}) {
    // https://github.com/lwansbrough/react-native-camera/issues/701#issuecomment-303833497
    return NavigationActions.reset({
        index: 1,
        actions: [
            NavigationActions.navigate({
                routeName: "Home"
            }),
            NavigationActions.navigate({
                routeName: "Service",
                params: { id, endOfReservationToExtend } // passed as props to Service screen
            })
        ]
    });
}
