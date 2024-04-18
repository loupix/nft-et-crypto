import {Request, Response} from 'express';
const sessionAlbum = require('supertest-session');
const appAlbum = require('../app').app;
const loggerAlbum = require("../logger")(module);

/**
* Tester CRUD des albums
* Create ; Update ; Delete
* @author Loïc Daniel <loicdaniel.fr>
**/

describe("Route Albums", function(){

	var index = 3;

	let testSession = sessionAlbum(appAlbum);
	let authenticatedSession;

	let userValue: Dictionary<string> = {
        email: "me@email.com",
        password: "mememe",
        account: "0x39dE252677e9afBa95EA48de2A540C67bF106E2D"
    };

    let catParentValue: Dictionary<string> = {
		name: "my category",
	}

    let albumValue = {
    	title: "Album titre",
    	category: catParentValue,
    	items: []
    }

	beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});


	it("Login", (done) => {
		testSession.post("/user/login")
			.set("accept-language", "fr")
			.send(userValue)
			.expect(200)
			.end(function(err, res) {
				if(err){
					done.fail(err);
				}else{
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
			.end(function(err, res) {
				if(err){
					done.fail(err);
				}else{
					catParentValue = JSON.parse(res.text).category;
					albumValue.category = catParentValue;
					done();
				}
			});
	});


	it("Create album", (done) => {
		authenticatedSession.post("/album/create")
			.send(albumValue)
			.expect(200)
			.end(function(err, res) {
				if(err){
					done.fail(err);
				}else{
					albumValue = JSON.parse(res.text).album;
					done();
				}
			});
	});


	it("Update album", (done) => {
		authenticatedSession.post("/album/update")
			.send(albumValue)
			.expect(200)
			.end(function(err, res) {
				if(err){
					done.fail(err);
				}else{
					albumValue = JSON.parse(res.text).album;
					done();
				}
			});
	});


	it("Delete album", (done) => {
		authenticatedSession.post("/album/delete")
			.set("Accept-Language", "fr-FR")
			.send(albumValue)
			.expect(200)
			.end(function(err, res) {
				if(err){
					done.fail(err);
				}else{
					done();
				}
			});
	});



	it("Remove Category & Albums", (done) => {
		authenticatedSession.post("/category/delete")
			.set("accept-language", "fr")
			.send(catParentValue)
			.expect(200)
			.end(function(err, res) {
				if(err){
					done.fail(err);
				}else{
					done();
				}
			});
	});
});