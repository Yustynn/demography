// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var DataSet = mongoose.model('DataSet')
var Dashboard = mongoose.model('Dashboard');
var expect = require('chai').expect;
var _ = require('lodash')
var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');


//This function checks if an object in an array contains a keyValue pair
var arrayContainsKeyVal = function(array, keyVal) {
    var key = Object.keys(keyVal);
    var value = keyVal[key];
    var contains = !!array.find(function(obj){
        return obj[key] === value;
    })

    return contains;
}

describe('Dashboard Route', function() {

    var userInfo = {
        email: "cellar@door.com",
        password: '28d6h42m12s'
    }

    var datasetInfo = {
        title: "Test Public Dataset",
        isPublic: true
    }

    var publicDashboard = {
        title: "Test Public Dashboard",
        shortDescription: "This is a short description",
        isPublic: true
    }

    var privateDashboard = {
        title: "Test Private Dashboard",
        shortDescription: "This is a short description",
        isPublic: false
    }

    var userAgent;
    var guestAgent;
    var userId;
    var publicDataset;
    var updatedCart;

    beforeEach('Establish DB connection', function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    //Add product expects product in form of {product: _id, quantity: number}

    beforeEach('Create user and add a dataset', function(done) {
        User.create(userInfo, function(err, user) {
            userId = user._id;
            datasetInfo.user = userId;
            DataSet.create(datasetInfo, function(err, createdDataset) {
                if (err) return done(err)

                publicDataset = createdDataset;
                privateDashboard.dataset = publicDataset._id;
                privateDashboard.user = userId;
                publicDashboard.user = userId;
                publicDashboard.dataset = publicDataset._id;
                done();
            })
        })
    })


    beforeEach('Create guest and User', function(done) {
        userAgent = supertest.agent(app);
        guestAgent = supertest.agent(app)

        userAgent.post('/login').send(userInfo)
            .end(function(err, response) {
                done()
            });
    });


    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    describe('Logged in Users', function() {

        it('can make a Public and Private Dashboard', function(done) {
            userAgent.post('/api/dashboards').send(publicDashboard)
                .expect(201)
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.title).to.be.equal('Test Public Dashboard');
                    expect(response.body.isPublic).to.be.true;
                    userAgent.post('/api/dashboards').send(privateDashboard)
                        .expect(201)
                        .end(function(err, response) {
                            if (err) return done(err);

                            expect(response.body.title).to.be.equal('Test Private Dashboard');
                            expect(response.body.isPublic).to.be.false
                            done()
                        })
                });
        });


    });

    describe('Non logged in Users', function() {

        it('cannot make a Dashboard', function(done) {
            guestAgent.post('/api/dashboards').send(publicDashboard)
                .expect(401)
                .end(done)

        });


    });

    describe('Viewing dashboards', function() {

        beforeEach('Create public and private dashboard for logged in user', function(done) {
            userAgent.post('/api/dashboards').send(publicDashboard)
                .end(function(err, response) {
                    if (err) return done(err);
                    userAgent.post('/api/dashboards').send(privateDashboard)
                        .end(function(err, response) {
                            done()
                        })
                });
        });

        it('Logged in users can view all of their private and public dashboards', function(done) {

            userAgent.get('/api/dashboards')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err)
                    expect(res.body.length).to.be.equal(2)
                    expect(arrayContainsKeyVal(res.body, {isPublic: true})).to.be.true;
                    expect(arrayContainsKeyVal(res.body, {isPublic: false})).to.be.true;
                    done()
                })
        })

        it('Non Logged in users can view only public dashboards', function(done) {

            guestAgent.get('/api/dashboards')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err)
                    expect(res.body.length).to.be.equal(1)
                    expect(arrayContainsKeyVal(res.body, {isPublic: true})).to.be.true;
                    expect(arrayContainsKeyVal(res.body, {isPublic: false})).to.be.false;
                    done()
                })

        })



    })

});
