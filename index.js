const express = require('express');
const WebSocketClient = require('websocket').client;
var socket = new WebSocketClient();
const APIv1 = require("./api/v1");
require('dotenv').config();

socket.on('connectFailed', (error) => {
    console.log('Connect Error: ' + error.toString());
});

socket.on("connect", (connection) => {
    
    console.log("Socket Conected");
    connection.on('close', () => {
        console.log('Connection closed');
        setTimeout(() => {
            connectWebsockets();
        }, 10000);
    });

    connection.on('message', (data) => {
        parsedData = JSON.parse(data.utf8Data)
        //Auth
        if(parsedData.type == "auth_required"){
            connection.sendUTF(JSON.stringify({
                type: "auth",
                access_token: `${process.env.HATOKEN}`
            }));
        }
        //We are authenticated
        if(parsedData.type == "auth_ok"){
            connection.sendUTF(JSON.stringify({
                "id": 1,
                "type": "subscribe_events",
                "event_type": "state_changed"
            }));
        }
        //Only care about entety_id: sensor.david_iphonee_battery_state
        try {
            if(parsedData.event.data){
                if(parsedData.event.data.entity_id == "sensor.david_iphonee_battery_state"){
                    console.log(parsedData.event.data.new_state.state);
                }
            } 
        } catch (error) {
            
        }
    });
});
function connectWebsockets(){
    socket.connect("wss://home.tomerello.se/api/websocket");
}
connectWebsockets();

setTimeout(() => {
    //console.log(socket);
}, 1000);

const app = express();


app.get('/', (req, res, next) => {
    /* res.json({
        Message: "API is working ✨"
    }); */
    APIv1.getChargingStatus()
    .then((result) => {
        res.send(result.data);
    })
    .catch((err) => {
        next(err);
    })
});


//Error handeler
function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next){
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

//start server on port 3000

const server = app.listen(3000, () =>{
    console.log(`Server started listening on ${server.address().port}`)
});