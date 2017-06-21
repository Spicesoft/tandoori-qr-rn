import moment from "moment";
import qs from "query-string";

const TOKEN = "9db9256dcc304764f38545a5c221e886a24b0911";
const DOMAIN = "neo-yolo.tandoori.pro";
const API_ROOT = `https://${DOMAIN}/api/v1`;


function request(options) {
    return fetch({
        method: "GET",
        headers: {
            Authorization: `Token ${TOKEN}`
        },
        ...options,
        body: JSON.stringify(options.body)
    })
    .then(response => response.json());
}

const API = {

    login(username, password) {
        // TODO
        return Promise.resolve(TOKEN);
    },

    getAvailabilitiesForService(serviceID) {
        const query = qs.stringify({
            service: serviceID,
            from_datetime: moment().format(),
            to_datetime: moment().add(4, "hours").format()
        });
        return request({
            url: `${API_ROOT}/availabilities/ranges?${query}`
        })
        .then(response => {
            return response;
        })
        .catch(err => {
            console.error(err);
        });
    }
};

export default API;
