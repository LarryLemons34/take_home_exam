var Request = require("request");
require('dotenv').config()
describe("Server", () => {
    var server;
    beforeAll(() => {
        server = require("../../index");
    });
    afterAll(() => {
        server.close();
    });
    describe("GET /agents", () => {
        var data = {};
        beforeAll( (done) => {
            Request("http://localhost:4444/agents", (err, response, body)=>{
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     if(typeof data !== "undefiend" && typeof data.body !== "undefined"){
        //         console.log("BODY " + JSON.stringify(data.body))
        //         for(key in Object.keys(data.body)){
        //             if(typeof key !== "undefined"){
        //                 expect(data.body).toContain(key);
        //             } else {
        //                 fail("key undefined");
        //             }
        //         }
        //     } else {
        //         fail("Data or body undefined");
        //     }
        // });
    });
});