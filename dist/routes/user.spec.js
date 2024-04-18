"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionUser = require('supertest-session');
const appUser = require('../app').app;
const loggerUser = require("../logger")(module);
/**
* Testeur des utilisateurs
* Create ; Update ; Delete
* login ; unlogin ; register ; unregister
* @author Loïc Daniel <loicdaniel.fr>
**/
describe("Route User", function () {
    var index = 1;
    let testSession = sessionUser(appUser);
    var authenticatedSession;
    let userValue = {
        email: "me@email.com",
        password: "mememe",
        account: "0x39dE252677e9afBa95EA48de2A540C67bF106E2D",
    };
    let user;
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });
    xit("Register", (done) => {
        testSession.post("/user/register")
            .set("accept-language", "fr")
            .send(userValue)
            .end(function (err, res) {
            if (err) {
                if (res.text === "User already exist")
                    done();
                done.fail(err);
            }
            else {
                authenticatedSession = testSession;
                done();
            }
        });
    });
    it("Login", (done) => {
        testSession.post("/user/login")
            .set("accept-language", "fr")
            .set("content-type", "application/json")
            .send(userValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                done.fail(err);
            }
            else {
                user = JSON.parse(res.text);
                authenticatedSession = testSession;
                done();
            }
        });
    });
    it("Set admin", (done) => {
        authenticatedSession.post("/user/setAdmin")
            .set("accept-language", "fr")
            .set("content-type", "application/json")
            .send({ user: user, admin: true })
            .expect(200)
            .end(function (err, res) {
            if (err) {
                done.fail(err);
            }
            else {
                done();
            }
        });
    });
    it("Set banned", (done) => {
        authenticatedSession.post("/user/setBanned")
            .set("accept-language", "fr")
            .set("content-type", "application/json")
            .send({ user: user, banned: false })
            .expect(200)
            .end(function (err, res) {
            if (err) {
                done.fail(err);
            }
            else {
                done();
            }
        });
    });
    it("Unlogin", (done) => {
        authenticatedSession.get("/user/unlogin")
            .expect(200)
            .end(function (err, res) {
            if (err) {
                done.fail(err);
            }
            else {
                done();
            }
        });
    });
    /*	it("Unregister", (done) => {
            testSession.post("/user/unregister")
                .expect(200)
                .end(function(err, res) {
                    if(err){
                        done.fail(err);
                    }else{
                        done();
                    }
                });
        })*/
});
//# sourceMappingURL=user.spec.js.map