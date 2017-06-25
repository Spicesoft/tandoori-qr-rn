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

let _requestID = 0;
async function request(options, retryIf401=true) {
    let requestID = ++_requestID;

    console.log(`Request #${requestID}`, options.url, options);
    const response = await fetch(options.url, {
        method: "GET",
        headers: {
            Authorization: `${TOKEN_TYPE} ${TOKEN}`,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        ...options
    });

    if (response.status === 401 && retryIf401) {
        // Attempt token refresh
        try {
            console.log(`401 status on request ${requestID}, attempting token refresh`);
            await refreshToken();
            // replay request
            console.log(`Replaying request ${requestID} as ${_requestID + 1}`);
            return await request(options, false);
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    else if (response.status >= 400) {
        // trigger failure while providing the response to the catch handler
        console.log(`Request #${requestID} failed`, response);
        throw response;
    }
    console.log(`Reponse #${requestID}`, response);
    return response;
}

async function tokenRequest(extraData) {
    const data = new FormData();
    data.append("client_id", CLIENT_ID);
    data.append("client_secret", CLIENT_SECRET);
    data.append("random", Math.random()); // solve "Invalid request" bug

    for (let key in extraData) {
        data.append(key, extraData[key]);
    }   
    console.log("Token request", extraData);
    // use fetch instead of request to let fetch decides the headers
    let response = await fetch(`${API_ROOT}/o/token/`, {
        method: "POST",
        body: data
    });
    console.log("Token response", response);
    if (response.status >= 400) {
        throw new Error("Token request failed.");
    }
    response = await response.json();
    console.log("Token JSON response", response);
    return response;
}

async function handleTokenResponse(response) {
    TOKEN = response.access_token;
    TOKEN_TYPE = response.token_type;
    REFRESH_TOKEN = response.refresh_token;

    console.log("Token:", TOKEN_TYPE, TOKEN, REFRESH_TOKEN);

    await Promise.all([
        AsyncStorage.setItem("@Cowork:token", TOKEN),
        AsyncStorage.setItem("@Cowork:tokenType", TOKEN_TYPE),
        AsyncStorage.setItem("@Cowork:refreshToken", REFRESH_TOKEN),
    ]);
}

// keep the refresh token  promise so that we only refresh once when 
// several requests fail.
let currentRefreshPromise;
async function refreshToken() {
    if (currentRefreshPromise) {
        console.log("Already refreshing token...");
        return currentRefreshPromise;
    }
    let tokenResponse;
    try {
        currentRefreshPromise = tokenRequest({
            grant_type: "refresh_token",
            refresh_token: REFRESH_TOKEN
        });
        tokenResponse = await currentRefreshPromise;
        await handleTokenResponse(tokenResponse);
    }
    finally {
        currentRefreshPromise == null;
    }
}

const API = {
    refreshToken,
    async checkLogin() {
        const storedToken = await AsyncStorage.getItem("@Cowork:token");
        const storedTokenType = await AsyncStorage.getItem("@Cowork:tokenType");
        const storedRefreshToken = await AsyncStorage.getItem("@Cowork:refreshToken");
        if (storedToken && storedTokenType && storedRefreshToken) {
            TOKEN = storedToken;
            TOKEN_TYPE = storedTokenType;
            REFRESH_TOKEN = storedRefreshToken;
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
        REFRESH_TOKEN = "";
        ACCOUNT_ID = 0;

        await AsyncStorage.setItem("@Cowork:token", "");
        await AsyncStorage.setItem("@Cowork:tokenType", "");
        await AsyncStorage.setItem("@Cowork:refreshToken", "");
    },

    async login(username, password) {
        let tokenResponse = await tokenRequest({
            username, password, grant_type: "password"
        })
        await handleTokenResponse(tokenResponse);
        const details = await API.getAccountDetails();
        console.log(details);
    },

    async getAccountDetails() {
        const response = await request({
            url: `${API_ROOT}/accounts/me/`
        });
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
            account: ACCOUNT_ID,
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
            if (reservation.status !== "A") {
                return;
            }
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
        return await response.json();
    }
};

export default API;
