'use strict';

const express = require("express")

const bodyParser = require("body-parser")
const app = express()
const { check, validationResult, checkSchema } = require('express-validator');

const fs = require('fs');

let getJSONFile = (path) =>{
    if(typeof path !== "undefined"){
        let rawData = fs.readFileSync(path);
        return JSON.parse(rawData);
    }
}

//Return List of all Agents
let handleListAgentReq = (req, res, next) =>{
    try {
        if(typeof process.env.AGENT_FILE_PATH !== "undefined"){
            let agentData = getJSONFile(process.env.AGENT_FILE_PATH);
            let response = agentData.map((agent)=>{
                return typeof agent !== "undefined" ? agent.name : "No agent";
            })
            
            return handleResponse(response, {
                statusCode : 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Credentials" : true
                },
                body: response }, 
                req, res, next);
        }
    } catch (error) {
        console.log("Error", error);
        return handleResponse( error, {
        statusCode : 500,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
        },
        body: error }, 
        req, res, next);
    }
}

//Ability to Add New Agent
let handleAddAgentReq = (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }

        if(typeof process.env.AGENT_FILE_PATH !=="undefined"){
            let agentData = getJSONFile(process.env.AGENT_FILE_PATH);
            if(typeof req.body !== "undefined"){
                
                agentData.push(req.body)
                fs.writeFileSync(process.env.AGENT_FILE_PATH, JSON.stringify(agentData, null, 2));
                return handleResponse("Agent Added", {
                    statusCode : 200,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Agent Added" }, 
                    req, res, next);
            } else {
                return handleResponse( "Missing Request Body", {
                    statusCode : 500,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Missing Request Body" }, 
                    req, res, next);
            }
        }
    } catch (error) {
        console.log("Error", error);
        return handleResponse( error, {
        statusCode : 500,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
        },
        body: error }, 
        req, res, next);
    }
}

//Retrieve All Agent Details by agent's INT ID
let handleGetAgentByIdReq = (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }

        if(typeof process.env.AGENT_FILE_PATH !=="undefined"){
            let agentData = getJSONFile(process.env.AGENT_FILE_PATH);
            if(typeof req.params !== "undefined" && typeof req.params._id !== "undefined"){
                let agent = agentData.filter((agent)=>{
                    return agent._id == req.params._id;
                })
                let response =  agent.length > 0 ? agent: "No agent found";
                return handleResponse(response, {
                    statusCode : 200,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: response }, 
                    req, res, next);
            } else {
                return handleResponse( "Missing Request Body", {
                    statusCode : 500,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Missing Request Body" }, 
                    req, res, next);
            }
        }
    } catch (error) {
        console.log("Error", error);
        return handleResponse( error, {
        statusCode : 500,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
        },
        body: error}, 
        req, res, next);
    }
}

//Update Any/All Fields by Agent's INT IT
let handleUpdateAgentReq = (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }

        if(typeof process.env.AGENT_FILE_PATH !=="undefined"){
            let agentData = getJSONFile(process.env.AGENT_FILE_PATH);
            if(typeof req.body !== "undefined"){
                let agentList = agentData.filter((agent)=>{
                    if(agent._id == req.body._id) {
                        return agent = Object.assign(agent, req.body);
                    };
                })
                
                let response;
                if(agentList.length > 0){
                    fs.writeFileSync(process.env.AGENT_FILE_PATH, JSON.stringify(agentData, null, 2));
                    response = "Updated Agent."
                } else {
                    response = "Could not find agent."
                }

                return handleResponse(response, {
                    statusCode : 200,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: response }, 
                    req, res, next);
            } else {
                return handleResponse( "Missing Request Body", {
                    statusCode : 500,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Missing Request Body" }, 
                    req, res, next);
            }
        }
    } catch (error) {
         console.log("Error", error);
         return handleResponse( error, {
            statusCode : 500,
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
            },
            body:error}, 
            req, res, next);
    }
}

//List all customers associated with a given Agent's INT ID
let handleAgentsCustomersReq = (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }

        if(typeof process.env.CUSTOMER_FILE_PATH !=="undefined"){
            let customerData = getJSONFile(process.env.CUSTOMER_FILE_PATH);
            if(typeof req.params !== "undefined" && typeof req.params.agent_id !== "undefined"){
                let customerList = customerData.filter((customer)=>{
                        return customer.agent_id == req.params.agent_id;
                }).map((customer)=>{
                    return {
                        "name": customer.name,
                        "city": customer.address.split(",").slice(1,2),
                        "state": customer.address.split(",").slice(2,3)
                    } 
                })
                
                let response = customerList.length > 0 ? customerList : "No customers found for this agent.";

                return handleResponse(response, {
                    statusCode : 200,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: response }, 
                    req, res, next);
            } else {
                return handleResponse( "Missing Request Body", {
                    statusCode : 500,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Missing Request Body" }, 
                    req, res, next);
            }
        }
    } catch (error) {
         console.log("Error", error);
         return handleResponse( error, {
            statusCode : 500,
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
            },
            body:error}, 
            req, res, next);
    }
}

//Ability to Add new Customer
let handleAddCustomerReq = (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }

        if(typeof process.env.AGENT_FILE_PATH !=="undefined"){
            let agentData = getJSONFile(process.env.AGENT_FILE_PATH);
            if(typeof req.body !== "undefined"){
                let filteredAgents = agentData.filter((agent) =>{
                    return agent._id === req.body.agent_id
                });
                if(filteredAgents.length > 0){
                    let customerData = getJSONFile(process.env.CUSTOMER_FILE_PATH);
                    customerData.push(req.body);
                    fs.writeFileSync(process.env.CUSTOMER_FILE_PATH, JSON.stringify(customerData, null, 2));

                } else {
                    return handleResponse("Agent does not exist to add customer to.", {
                        statusCode : 200,
                        headers: {
                            "Access-Control-Allow-Origin" : "*",
                            "Access-Control-Allow-Credentials" : true
                        },
                        body: "Agent does not exist to add customer to." }, 
                        req, res, next);
                }

                return handleResponse("Agent Customer", {
                    statusCode : 200,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Agent Customer" }, 
                    req, res, next);
            } else {
                return handleResponse( "Missing Request Body", {
                    statusCode : 500,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Missing Request Body" }, 
                    req, res, next);
            }
        }
    } catch (error) {
        console.log("Error", error);
        return handleResponse( error, {
        statusCode : 500,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
        },
        body: error }, 
        req, res, next);
    }
}

//Ability to Delete Exisiting Customer
let handleDeleteCustomerReq = (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }

        if(typeof process.env.CUSTOMER_FILE_PATH !=="undefined"){
            let customerData = getJSONFile(process.env.CUSTOMER_FILE_PATH);
            if(typeof req.params !== "undefined" && typeof req.params._id !== "undefined"){
                let customerList = customerData.filter((customer)=>{
                    return customer._id !== parseInt(req.params._id);
                });

                let response;
                if(customerList.length < customerData.length){
                    fs.writeFileSync(process.env.CUSTOMER_FILE_PATH, JSON.stringify(customerList, null, 2));
                    response = "Deleted Customer";
                }else {
                    response = "Could not find Customer."
                }
                return handleResponse(response, {
                    statusCode : 200,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: response }, 
                    req, res, next);
            } else {
                return handleResponse( "Missing Request Body", {
                    statusCode : 500,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Missing Request Body" }, 
                    req, res, next);
            }
        }
    } catch (error) {
         console.log("Error", error);
         return handleResponse( error, {
            statusCode : 500,
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
            },
            body:error}, 
            req, res, next);
    }
}

//Return all customer data from our system
let handleAgentsCustomersDetailsReq = (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }

        if(typeof process.env.CUSTOMER_FILE_PATH !=="undefined"){
            let customerData = getJSONFile(process.env.CUSTOMER_FILE_PATH);
            if(typeof req.params !== "undefined" && typeof req.params._id !== "undefined"){
                let customerList = customerData.filter((customer)=>{
                        return customer._id == req.params._id;
                });
                
                let response = customerList.length > 0 ? customerList : "No customer found.";

                return handleResponse(response, {
                    statusCode : 200,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: response }, 
                    req, res, next);
            } else {
                return handleResponse( "Missing Request Body", {
                    statusCode : 500,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Missing Request Body" }, 
                    req, res, next);
            }
        }
    } catch (error) {
         console.log("Error", error);
         return handleResponse( error, {
            statusCode : 500,
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
            },
            body:error}, 
            req, res, next);
    }
}

//Provide ability to Update Customer Information
let handleUpdateCustomerReq = (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }

        if(typeof process.env.CUSTOMER_FILE_PATH !=="undefined"){
            let customerData = getJSONFile(process.env.CUSTOMER_FILE_PATH);
            if(typeof req.body !== "undefined"){
                let customerList = customerData.filter((customer)=>{
                    if(customer._id == req.body._id) {
                        return customer = Object.assign(customer, req.body);
                    };
                })
                
                let response;
                if(customerList.length > 0){
                    fs.writeFileSync(process.env.CUSTOMER_FILE_PATH, JSON.stringify(customerData, null, 2));
                    response = "Updated Customer."
                } else {
                    response = "Could not find customer."
                }

                return handleResponse(response, {
                    statusCode : 200,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: response }, 
                    req, res, next);
            } else {
                return handleResponse( "Missing Request Body", {
                    statusCode : 500,
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: "Missing Request Body" }, 
                    req, res, next);
            }
        }
    } catch (error) {
         console.log("Error", error);
         return handleResponse( error, {
            statusCode : 500,
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
            },
            body:error}, 
            req, res, next);
    }
}
const handleResponse = (bodyRes, response, req, res, next) => {
    res.status(response.statusCode);
    res.send(bodyRes);
    next();
};

app.get("/agents", bodyParser.text({type: "application/*", limit: "11mb"}), handleListAgentReq);

app.post("/agent",[ bodyParser.json(),
    check("_id").isInt(),
    check("name").exists(),
    check("address").exists(),
    check("city").exists(),
    check("state").exists(),
    check("zipCode").exists(),
    check("tier").exists(),
    check("phone").exists(),
    check("phone.primary").exists(),
    check("phone.mobile").exists()
], handleAddAgentReq);

app.get("/agent/:_id",[ bodyParser.json(),
    check("_id").isInt()
], handleGetAgentByIdReq);


app.put("/agent/",[ bodyParser.json(),
    check("_id").isInt(),
    check("name").optional(),
    check("address").optional(),
    check("city").optional(),
    check("state").optional(),
    check("zipCode").optional(),
    check("tier").optional(),
    check("phone").optional(),
    check("phone.primary").optional(),
    check("phone.mobile").optional()
], handleUpdateAgentReq);

app.get("/customer/:agent_id",[ bodyParser.json(),
    check("agent_id").isInt()
], handleAgentsCustomersReq);

app.post("/customer/",[ bodyParser.json(),
    check("agent_id").isInt(),
    check("_id").isInt(),
    check("guid").exists(),
    check("isActive").isBoolean(),
    check("balance").exists(),
    check("age").isInt(),
    check("eyeColor").exists(),
    check("name").exists(),
    check("name.first").exists(),
    check("name.last").exists(),
    check("company").exists(),
    check("email").isEmail(),
    check("phone").exists(),
    check("address").exists(),
    check("registered").exists(),
    check("latitude").exists(),
    check("longitude").exists(),
    check("tags").exists()
], handleAddCustomerReq);

app.delete("/customer/:_id",[ bodyParser.json(),
    check("_id").isInt()
], handleDeleteCustomerReq);

app.get("/customer/details/:_id",[ bodyParser.json(),
    check("_id").isInt()
], handleAgentsCustomersDetailsReq);

app.put("/customer/",[ bodyParser.json(),
    check("agent_id").isInt(),
    check("_id").isInt(),
    check("guid").optional(),
    check("isActive").optional().isBoolean(),
    check("balance").optional(),
    check("age").optional().isInt(),
    check("eyeColor").optional(),
    check("name").optional(),
    check("name.first").optional(),
    check("name.last").optional(),
    check("company").optional(),
    check("email").optional().isEmail(),
    check("phone").optional(),
    check("address").optional(),
    check("registered").optional(),
    check("latitude").optional(),
    check("longitude").optional(),
    check("tags").optional()
], handleUpdateCustomerReq);

console.info("listening on port 4444");
app.listen(4444);