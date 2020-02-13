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

In order to run this interview exam project you need to clone this repository and run npm install in the directory you cloned the repo in. Next you need to run node index.js with two additional environment variables.
    - AGENT_FILE_PATH
    - CUSTOMER_FILE_PATH
These two environment varibles should point to the json where you cloned the json files included in this repo or to any other compatible agent/customer json files.