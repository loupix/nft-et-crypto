"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionCategory = require('supertest-session');
const appCategory = require('../app').app;
const loggerCategory = require("../logger")(module);
/**
* Tester CRUD des catégories
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/
describe("Route Category", function () {
    var index = 2;
    let testSession = sessionCategory(appCategory);
    let authenticatedSession;
    let userValue = {
        email: "me@email.com",
        password: "mememe",
        account: "0x39dE252677e9afBa95EA48de2A540C67bF106E2D"
    };
    let catParentValue = {
        name: "my category",
    };
    let catChildValue = {
        parent: catParentValue,
        name: { 'en': "my child category", 'fr': "ma catégorie enfant" }
    };
    let catSubChildValue = {
        parent: catChildValue,
        name: { 'en': "my sub child category" }
    };
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    it("Login", (done) => {
        testSession.post("/user/login")
            .set("accept-language", "fr")
            .send(userValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                done.fail(err);
            }
            else {
                userValue = JSON.parse(res.text);
                authenticatedSession = testSession;
                done();
            }
        });
    });
    it("Create parent", (done) => {
        authenticatedSession.post("/category/create")
            .set("accept-language", "fr")
            .send(catParentValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                done.fail(err);
            }
            else {
                catParentValue = JSON.parse(res.text);
                catChildValue.parent = catParentValue;
                done();
            }
        });
    });
    it("Create child", (done) => {
        authenticatedSession.post("/category/create")
            .set("accept-language", "fr")
            .send(catChildValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                done.fail(err);
            }
            else {
                catChildValue = JSON.parse(res.text).category;
                catSubChildValue.parent = catChildValue;
                done();
            }
        });
    });
    it("Create sub child", (done) => {
        authenticatedSession.post("/category/create")
            .set("accept-language", "fr")
            .send(catSubChildValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                done.fail(err);
            }
            else {
                catSubChildValue = JSON.parse(res.text).category;
                /*					loggerCategory.info(catSubChildValue);
                */ done();
            }
        });
    });
    it("Update parent", (done) => {
        authenticatedSession.post("/category/update")
            .set("accept-language", "fr")
            .send(catParentValue)
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
    it("Remove parent & child", (done) => {
        authenticatedSession.post("/category/delete")
            .set("accept-language", "fr")
            .send(catParentValue)
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
});
//# sourceMappingURL=category.spec.js.map