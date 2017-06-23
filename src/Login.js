import React, {Component} from "react";
import {
    Body,
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
    Spinner,
    Text,
    Toast
} from "native-base";
import {
    Dimensions,
    Image,
    View,
    Alert
} from "react-native";

import API from "./API";

export default class Login extends React.Component {

    state = {
        username: "pierre-andre.svetchine@example.com",
        password: "tandoori",
        loading: false
    };

    render() {
        return (
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
                        {this.renderButton()}
                    </View>
                </Form>
            </Content>
        );
    }

    renderButton() {
        if (this.state.loading) {
            return (
                <View style={styles.itemWSpinner}>
                    <Spinner color='rgb(70, 130, 180)' />
                </View>
            );
        }
        return (
            <Button block style={styles.loginButton} onPress={this.handleFormSubmit}>
                <Text>Log in</Text>
            </Button>
        );
    }

    // => keeps this
    handleFormSubmit = () => {
        this.setState({
            ...this.state,
            loading: true
        });
        API.login(this.state.username, this.state.password)
           .then(() => {
               Toast.show({
                   text: "Login success",
                   position: "bottom",
                   buttonText: "Okay",
                   duration: 2000,

               });
               this.props.onLoggedIn();
           })
           .catch((r) => {
               this.setState({
                   ...this.state,
                   loading: false
               });
               Alert.alert("error", JSON.stringify(r))
           });
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
    },
    itemWSpinner: {
        flex: 1,
        justifyContent: "center"
    }
}
