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
    var contains = !!array.find(function(obj) {
        return obj[key] === value;
    })

    return contains;
}

describe('Dataset Route', function() {

    //First users login credentials
    var userInfo1 = {
        email: "cellar@door.com",
        password: '28d6h42m12s'
    }

    //Second users login credentials
    var userInfo2 = {
        email: "test@test.com",
        password: 'password'
    }
    
    //First users public dataset
    var publicDatasetInfo1 = {
        title: "Test Public Dataset for user1",
        isPublic: true
    }

    //First users private dataset
    var privateDatasetInfo1 = {
        title: "Test Private Dataset For user1",
        isPublic: false
    }

    //Second users private dataset
    var privateDatasetInfo2 = {
        title: "Test Private Dataset for user2",
        isPublic: false
    }
    var userAgent1;
    var userAgent2;
    var guestAgent;
    var userId1;
    var userId2;
    var publicDataset1;
    var privateDataset1;
    var privateDataset2;
    var updatedCart;

    beforeEach('Establish DB connection', function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    //Add product expects product in form of {product: _id, quantity: number}

    beforeEach('Create users and add datasets', function(done) {
        User.create([userInfo1,userInfo2], function(err, users) {
            //Create two logged in users and set their ids on the appropriate dataset info
            //(1 public and 1 private dataset for user 1, 1 private dataset for user2)
            userId1 = users[0]._id;
            userId2 = users[1]._id;
            publicDatasetInfo1.user = userId1;
            privateDatasetInfo1.user = userId1;
            privateDatasetInfo2.user = userId2;
            //create the datasets
            DataSet.create([publicDatasetInfo1, privateDatasetInfo1,privateDatasetInfo2], function(err, createdDatasets) {
                if (err) return done(err)

                publicDataset1 = createdDatasets[0];
                privateDataset1 = createdDatasets[1];
                privateDataset2 = createdDatasets[2];

                done();
            })
        })
    })


    beforeEach('Create guest and User', function(done) {
        userAgent1 = supertest.agent(app);
        userAgent2 = supertest.agent(app);
        guestAgent = supertest.agent(app)

        userAgent1.post('/login').send(userInfo1)
            .end(function(err, response) {
                if(err) return done(err);
                userAgent2.post('/login').send(userInfo2)
                .end(done)

            });
    });


    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    describe('Logged in Users', function() {

        it('can view all public datasets and only their private datasets', function(done) {
            userAgent2.get('/api/datasets')//This user should have access to their private dataset and user1's public dataset 
                .expect(200)
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.length).to.be.equal(2);
                    expect(arrayContainsKeyVal(response.body,{user: userId1})).to.be.true;
                    userAgent1.get('/api/datasets')//User should only have access to their private and public datasets
                    .expect(200)
                    .end(function(err,response){
                        if(err) return done(err);
                        expect(arrayContainsKeyVal(response.body,{user: userId2})).to.be.false;
                        done();
                    })
                });
        });


    });

    describe('Non logged in Users', function() {

        it('can only view public datasets', function(done) {
            guestAgent.get('/api/datasets')
                .expect(200)
                .end(function(err,response){
                    if(err) return done(err);
                    expect(response.body.length).to.be.equal(1);
                    expect(arrayContainsKeyVal(response.body,{isPublic: false})).to.be.false;
                })
        });


    });

});
