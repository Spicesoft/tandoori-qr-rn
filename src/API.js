import moment from "moment";
import qs from "query-string";
import { AsyncStorage } from "react-native";

let ACCOUNT_ID = 0;
let TOKEN = "";
let TOKEN_TYPE = "";

const DOMAIN = "neo-yolo.tandoori.pro";
const API_ROOT = `https://${DOMAIN}/api/v1`;

const CLIENT_ID = "knvaPLwDO1L9DPn3RLtIwmfH6ARMtIIxRrX5QwYn";
const CLIENT_SECRET =
    "ernC9olZ0yeuOLwhH5wmpGXs1LoXhaXRdazDh1wSvrMzsGtNS7C8ahSTTreeDjSJMgAOMysAVruGIPam3rTye6iwytGFw3wAlI2tCXwh92HTQqhG2OAQfjZALCVDc5GM";

async function request(options) {
    console.log("request", `${TOKEN_TYPE} ${TOKEN}`, options);
    const response = await fetch(options.url, {
        method: "GET",
        headers: {
            Authorization: `${TOKEN_TYPE} ${TOKEN}`,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        ...options
    });
    if (response.status >= 400) {
        // trigger failure while providing the response to the catch handler
        throw response;
    }
    return response;
}

const API = {
    async checkLogin() {
        const storedToken = await AsyncStorage.getItem("@Cowork:token");
        const storedTokenType = await AsyncStorage.getItem("@Cowork:tokenType");
        if (storedToken && storedTokenType) {
            TOKEN = storedToken;
            TOKEN_TYPE = storedTokenType;
            try {
                const details = await API.getAccountDetails();
            } catch (e) {
                await API.logout();
                return false;
            }
            return true;
        }
        return false;
    },

    async logout() {
        TOKEN = "";
        TOKEN_TYPE = "";

        await AsyncStorage.setItem("@Cowork:token", "");
        await AsyncStorage.setItem("@Cowork:tokenType", "");
    },

    async login(username, password) {
        const data = new FormData();
        data.append("grant_type", "password");
        data.append("client_id", CLIENT_ID);
        data.append("client_secret", CLIENT_SECRET);
        data.append("username", username);
        data.append("password", password);
        data.append("random", Math.random()); // solve "Invalid request" bug

        // use fetch instead of request to let fetch decides the headers
        let response = await fetch(`${API_ROOT}/o/token/`, {
            method: "POST",
            body: data
        });
        response = await response.json();
        TOKEN = response.access_token;
        TOKEN_TYPE = response.token_type;
        console.log("Token:", TOKEN_TYPE, TOKEN);

        await Promise.all([
            AsyncStorage.setItem("@Cowork:token", TOKEN),
            AsyncStorage.setItem("@Cowork:tokenType", TOKEN_TYPE)
        ]);
        const details = await API.getAccountDetails();
        console.log(details);
    },

    async getAccountDetails() {
        const response = await request({
            url: `${API_ROOT}/accounts/me/`
        });
        if (response.status === 403) {
            // token has expired
            throw new Error("Token expired");
        }
        const details = await response.json();
        ACCOUNT_ID = details.pk;
    },

    async getServiceDetails(id) {
        const response = await request({
            url: `${API_ROOT}/services/${id}/`
        });
        return await response.json();
    },

    async getCenterDetails(centerID) {
        const response = await request({
            url: `${API_ROOT}/centers/${centerID}/`
        });
        return await response.json();
    },

    async getAvailabilityRangesForService(serviceID) {
        const query = qs.stringify({
            service: serviceID,
            from_datetime: moment().format(),
            to_datetime: moment().add(4, "hours").format()
        });
        let response = await request({
            url: `${API_ROOT}/availabilities/ranges/?${query}`
        });
        response = await response.json();

        const ranges = response[0].ranges;
        // convert to moment or null
        ranges.forEach(r => {
            r.lower = r.lower ? moment(r.lower) : null;
            r.upper = r.upper ? moment(r.upper) : null;
        });
        return ranges;
    },

    async getReservations() {
        const query = qs.stringify({
            from_datetime: moment().format(),
            to_datetime: moment().add(1, "day").format()
        });
        let response = await request({
            url: `${API_ROOT}/reservations/active/?${query}`
        });
        response = await response.json();
        const currentReservations = [];
        const incomingReservations = [];
        response.forEach(reservation => {
            if (moment(reservation.from_datetime) <= moment()) {
                currentReservations.push(reservation);
            } else {
                incomingReservations.push(reservation);
            }
        });

        return {
            currentReservations: currentReservations,
            incomingReservations: incomingReservations
        };
    },

    async createReservation(id, range) {
        const { from_datetime, to_datetime } = range;
        const response = await request({
            method: "POST",
            url: `${API_ROOT}/accounts/${ACCOUNT_ID}/reservation/`,
            body: JSON.stringify({
                from_datetime: from_datetime.format(),
                to_datetime: to_datetime.format(),
                service: id,
                unit_id: "hh"
            })
        });
        return await reponse.json();
    }
};

export default API;
