const WebSocket = require("ws");
const yup = require("yup");

const wss = new WebSocket.Server({ port: 8086 });

/**
 * Collection of "yup" schemas for each event type
 * 
 * string is key , yup.Schema is value
 * @type {Object.<string, yup.Schema>}
 */
const yupEventSchemas = {
    "PLAYER_MOVEMENT": yup.object().shape({
        x: yup.number().required().integer(),
        y: yup.number().required().integer()
    })
};

/**
 * Validates and parses an incoming message to ensure it is in the form
 * of JSON and the Schema is OK
 * 
 * @param {string} message A WebSocket message received from the client
 * @returns {{event: string, payload: object}}
 * @throws Will throw an error if message is invalid
 */

function parseMessage(message) {
    const object = JSON.parse(message);

    if(!("event" in object)) {
        throw new Error("Event property not provided!");
    }

    if(!("payload" in object)) {
        throw new Error("Payload property not provided!");
    }

    // object.payload = yupEventSchemas["PLAYER_MOVEMENT"];
    object.payload = yupEventSchemas[object.event].validateSync(object.payload);
    // validateSync() of the yup package is going to throw an error if the actual object is not in the correct format or one of these is invalid

    return object;
}


wss.on("connection", ws => {
    console.log("New client connected!");

    ws.on("message", message => {
        let data;

        try {
            data = parseMessage(message);
        } catch(err) {
            console.log(`INVALID MESSAGE: ${err.message}`);
            return;
        }

        console.log(data);


        switch(data.event) {
            case "PLAYER_MOVEMENT":
                console.log("OK... received player movement");
                break;
        }
    });
});