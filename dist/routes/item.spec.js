"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionItem = require('supertest-session');
const appItem = require('../app').app;
const loggerItem = require("../logger")(module);
/**
* Tester CRUD des items & contract
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/
describe("Route Items & Contract", function () {
    var index = 3;
    let testSession = sessionItem(appItem);
    let authenticatedSession;
    let userValue = {
        email: "me@email.com",
        password: "mememe",
        account: "0x39dE252677e9afBa95EA48de2A540C67bF106E2D"
    };
    let catParentValue = {
        name: "my category",
    };
    let albumValue = {
        title: "Album titre",
        category: catParentValue,
        items: []
    };
    let itemValue = {
        category: catParentValue,
        album: albumValue
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
                /*					loggerItem.error(res.text);
                */ done.fail(err);
            }
            else {
                userValue = JSON.parse(res.text).user;
                authenticatedSession = testSession;
                done();
            }
        });
    });
    it("Create category", (done) => {
        authenticatedSession.post("/category/create")
            .set("accept-language", "fr")
            .send(catParentValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                /*					loggerItem.error(res.text);
                */ done.fail(err);
            }
            else {
                catParentValue = JSON.parse(res.text).category;
                albumValue.category = catParentValue;
                itemValue.category = catParentValue;
                done();
            }
        });
    });
    it("Create album", (done) => {
        authenticatedSession.post("/album/create")
            .send(albumValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                /*					loggerItem.error(res.text);
                */ done.fail(err);
            }
            else {
                albumValue = JSON.parse(res.text).album;
                itemValue.album = albumValue;
                done();
            }
        });
    });
    it("Create item", (done) => {
        authenticatedSession.post("/item/create")
            .set("accept-language", "fr")
            .send(catParentValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                itemValue = JSON.parse(res.text).item;
                /*					loggerItem.error(res.text);
                */ done.fail(err);
            }
            else {
                done();
            }
        });
    });
    it("Remove Album & Items", (done) => {
        authenticatedSession.post("/album/delete")
            .set("accept-language", "fr")
            .send(albumValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                /*					loggerItem.error(res.text);
                */ done.fail(err);
            }
            else {
                done();
            }
        });
    });
    it("Remove Category & Albums", (done) => {
        authenticatedSession.post("/category/delete")
            .set("accept-language", "fr")
            .send(catParentValue)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                /*					loggerItem.error(res.text);
                */ done.fail(err);
            }
            else {
                done();
            }
        });
    });
});
//# sourceMappingURL=item.spec.js.map