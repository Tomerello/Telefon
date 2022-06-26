require('dotenv').config();
const axios = require('axios').default;


function getChargingStatus(){ 
    return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url: process.env.HADOMAIN + "/api/states/sensor.david_iphonee_battery_state",
            headers: {
                Authorization: "Bearer " + process.env.HATOKEN
            }
        })
        .then((result) => {
            resolve(result);
        })
        .catch((err) => {
            console.log(err);
            reject(err);
        })
    })
}
    


module.exports = {
    getChargingStatus,
};