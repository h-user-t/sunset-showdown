/*
  Created on 3/28/2024
  @ author: william
*/

// SAVE OUR DATABASE HERE FOR NOW
let gameState = {}  // contains player id and location of all players
let id_counter = 1;

class ServerOps {
    constructor() {
        this._route = {
            "MOVE" : this._doMove,
            "LGIN" : this._doLogin,
            "ROTA" : this._doRotate,
            "LOUT" : this._doLogout
        }
    }

    // return a response after login
    _doLogin(request, response=null) {
        gameState[id_counter.toString()] = "0 0"; // assume player initializes at center of map
        console.log(gameState);
        if(response != null) {
            response.setType("SPWN");
            let gameState_data = Object.assign({}, gameState);  // copy dictionary data without passing reference
            response.setData(gameState_data);  // inform user about current game state when spawning
            response.addKey("0", id_counter.toString());    // informing player of their assigned player id
            id_counter += 1; 
        }
        return response;
    }

    // delete user from gamestate upon logout
    _doLogout(request, response=null) {
        delete gameState[request.getValue("PID")]; // delete based on playerid
        if(response != null) {
            response.setType("EXIT");
            response.setData({"PID" : request.getValue("PID")});
        }
        return response;
    }

    _doMove(request, response=null) {
        let request_data = request.getData();
        gameState[request_data["PID"]] = request_data["LOC"];  
        if(response != null) {
            response.setType("MOVE");
            response.setData(request_data);
        }
        return response
    }

    process(request, response=null) {
        let operation = this._route[request.getType()]
        return operation(request, response)   // returns response (if any)
    }

    _doRotate(request, response=null) {
        let request_data = request.getData();
        if(response != null) {
            response.setType("ROTA");
            response.setData(request_data);
        }
        return response;
    }
}

module.exports = { ServerOps };

