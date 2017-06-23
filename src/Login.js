import React, {Component} from "react";
import {
    Button,
    Container,
    CheckBox,
    Content,
    Form,
    Input,
    Item,
    Label,
    ListItem,
    Right,
    Text
} from "native-base";
import {
    Dimensions,
    Image,
    View
} from "react-native";

import API from "./API";

export default class Login extends React.Component {

    static navigationOptions = {
        title: "CoWork.io",
    };

    state = {
        username: "",
        password: ""
    };

    render() {
        return (
            <Container style={styles.cont}>
                <Content>
                    <View style={styles.view}>
                        <Image style={styles.img} resizeMode="contain" source={require("./img/coworkio.png")}/>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input value={this.state.username} onChangeText={(text) => this.setState({"username": text})}/>
                        </Item>
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input secureTextEntry={true} value={this.state.password} onChangeText={(text) => this.setState({"password": text})}/>
                        </Item>
                        <View style={{justifyContent: "center", flexDirection: "row"}}>
                            <Button block style={styles.loginButton} onPress={this.handleFormSubmit}>
                                <Text>Log in</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
            </Container>
        );
    }

    // => keeps this
    handleFormSubmit = () => {
        API.login(this.state.username, this.state.password)
           .then(() => {
               Toast.show({
                   text: "Login success",
                   position: "bottom",
                   buttonText: "Okay",
                   duration: 2000,

               });
               this.props.navigation.navigate("Home");
           })
           .catch((r) => { Alert.alert("error", JSON.stringify(r))});
    }

}

var width = Dimensions.get("window").width;

const styles = {
    cont: {
        padding: 15,
        backgroundColor: "#FFFFFF"
    },
    img: {
      flex: 1,
      height: 100
    },
    view: {
      flexDirection: "row"
    },
    loginButton: {
        width: width*0.8,
        marginTop: 20
    }
}
