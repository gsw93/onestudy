/**
 * Created by SW on 2018-05-10.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

//스키마 정의
var UserSchema = new mongoose.Schema({
    id: {type: String, required: true}, // required: true -> 반드시 필요한 값, unique: true -> 고유값
    password: {type: String},
    nickname: {type: String, required: true, index:'hashed'},
    salt: {type: String},
    created_at: {type: Date, index: {unique: false}, 'default': moment().format()},
    updated_at: {type: Date, index: {unique: false}, 'default': moment().format()},
    provider: {type: String, default: ''},
    authToken: {type: String, default: ''},
    sellercheck:{type:Boolean, default:false},
    name: {type: String},
    age: {type: Number},
    gender: {type: String},
    photo: {type: String},
    majors: {type: String},
    phone: {type: String}
});
UserSchema.static('findById', function (username, callback) {
    return this.find({id:username}, callback);
});
UserSchema.static('findAll', function (callback) {
    return this.find({}, callback);
});

module.exports = mongoose.model('users', UserSchema);