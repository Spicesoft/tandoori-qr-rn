import moment from "moment";
import qs from "query-string";

const TOKEN = "9db9256dcc304764f38545a5c221e886a24b0911";
const DOMAIN = "neo-yolo.tandoori.pro";
const API_ROOT = `https://${DOMAIN}/api/v1`;


function request(options) {
    return new Promise((resolve, reject) => {
        fetch({
                method: "GET",
                headers: {
                    "Authorization": `Token ${TOKEN}`,
                    "Content-Type": "application/json"
                },
                ...options,
                body: JSON.stringify(options.body)
            })
            .then(response => {
                if ( response.status == 200 ) {
                    resolve(response)
                }
                else {
                    reject(response)
                }
            });
    })
}

const API = {

    login(username, password) {
        // TODO
        return Promise.resolve(TOKEN);
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
    }

};

export default API;
