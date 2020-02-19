# take_home_exam

## Possible assumptions :
- The project is to only create an api not a front end application to consume the api.
### Agent List Page:
- "Return List of all agents" would be to return the name of all agents not all data of all agents.
### Agent Detail Page:
- "Update Any/All Fields by Agent's INT ID" request would include an agent object with _id property and optional other fields
### Agent's Customer Detail Page
- "Return all customer data from our system" the request will be given a customer id and return all information for a that single customer

## How to install :
You will need to install npm and node on your computer.

In order to run this interview exam project you need to clone this repository. Second, change directories into the "take_home_exam" directory. Third, run npm install in this directory. Next you need to run node index.js with two additional environment variables.
- AGENT_FILE_PATH
- CUSTOMER_FILE_PATH

For example : AGENT_FILE_PATH=/Users/me/take_home_exam/agent.json CUSTOMER_FILE_PATH=/Users/me/take_home_exam/customer.json node index.js

Optionally you can create a .env file and use npm start to launch the server.

These two environment varibles should point to the json where you cloned the json files included in this repo or to any other compatible agent/customer json files.

Here is a list of the available endpoints in order: 

GET http://localhost:4444/agents
POST http://localhost:4444/agent
GET http://localhost:4444/agent/:_id
PUT http://localhost:4444/agent/
GET http://localhost:4444/customer/:agent_id
POST http://localhost:4444/customer/
DELETE http://localhost:4444/customer/:_id
GET http://localhost:4444/customer/details/:_id
PUT http://localhost:4444/customer/

## Test :
Jasmine is included with this project. In order to test the included specs use npm test.
