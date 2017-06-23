import moment from "moment";
import qs from "query-string";


const ACCOUNT_ID = 6;
let TOKEN = "";
let TOKEN_TYPE = "";

const DOMAIN = "neo-yolo.tandoori.pro";
const API_ROOT = `https://${DOMAIN}/api/v1`;

const CLIENT_ID = "knvaPLwDO1L9DPn3RLtIwmfH6ARMtIIxRrX5QwYn";
const CLIENT_SECRET = "ernC9olZ0yeuOLwhH5wmpGXs1LoXhaXRdazDh1wSvrMzsGtNS7C8ahSTTreeDjSJMgAOMysAVruGIPam3rTye6iwytGFw3wAlI2tCXwh92HTQqhG2OAQfjZALCVDc5GM";

function request(options) {
    return new Promise((resolve, reject) => {
        console.log("request", `${TOKEN_TYPE} ${TOKEN}`, options)
        fetch(options.url, {
                method: "GET",
                headers: {
                    "Authorization": `${TOKEN_TYPE} ${TOKEN}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                ...options
            })
            .then(response => {
                if ( response.status < 400 ) {
                    resolve(response)
                }
                else {
                    reject(response)
                }
            });
    })
}

const API = {

    logout() {
        TOKEN = "";
        TOKEN_TYPE = "";
        return Promise.resolve();
    },

    login(username, password) {
        const data = new FormData();
        data.append('grant_type', 'password');
        data.append('client_id', CLIENT_ID);
        data.append('client_secret', CLIENT_SECRET);
        data.append('username', username);
        data.append('password', password);
        data.append("random", Math.random()); // solve "Invalid request" bug

        // use fetch instead of request to let fetch decides the headers
        return fetch(`${API_ROOT}/o/token/`, {
            method: "POST",
            body: data
        })
        .then(response => response.json())
        .then(response => {
            TOKEN = response.access_token;
            TOKEN_TYPE = response.token_type;

            console.log("Token:", TOKEN_TYPE, TOKEN);
        });
    },

    getServiceDetails(id) {
        return request({
                url: `${API_ROOT}/services/${id}/`,
            })
            .then(response => response.json())
            .catch(response => {
                console.error(response);
            });
    },

    getCenterDetails(centerID) {
        return request({
            url: `${API_ROOT}/centers/${centerID}/`,
        })
        .then(response => response.json())
        .catch(response => {
            console.error(response);
        });
    },

    getAvailabilityRangesForService(serviceID) {
        const query = qs.stringify({
            service: serviceID,
            from_datetime: moment().format(),
            to_datetime: moment().add(4, "hours").format()
        });
        return request({
                url: `${API_ROOT}/availabilities/ranges/?${query}`
            })
            .then(response => response.json())
            .then(response => {
                const ranges = response[0].ranges;
                // convert to moment or null
                ranges.forEach(r => {
                    r.lower = r.lower ? moment(r.lower) : null;
                    r.upper = r.upper ? moment(r.upper) : null;
                });
                return ranges;
            })
            .catch(response => {
                console.error(response);
            });
    },

    getReservations() {
        const query = qs.stringify({
            from_datetime: moment().format(),
            to_datetime: moment().add(1, "day").format()
        });
        return request({
            url: `${API_ROOT}/reservations/active/?${query}`
        })
        .then(response => response.json())
        .then(response => {
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
                "currentReservations": currentReservations,
                "incomingReservations": incomingReservations
            }
        })
        .catch(err => {
            console.error(err);
        });
    },

    createReservation(id, range) {
        const {from_datetime, to_datetime} = range;
        return request({
            method: "POST",
            url: `${API_ROOT}/accounts/${ACCOUNT_ID}/reservation/`,
            body: JSON.stringify({
                from_datetime: from_datetime.format(),
                to_datetime: to_datetime.format(),
                service: id,
                unit_id: "hh"
            })
        })
        .then(response => response.json());
    }

};

export default API;
