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
    phoneAuthCheck:{type: Boolean, default: false}, // 사용자도 서비스 이용할때에는 추가정보와 핸드폰 인증 최초 1회 받아야하는데 그거 체크하기 위함.
    name: {type: String},
    age: {type: Number},
    gender: {type: String},
    photo: {type: String},
    majors: {type: String},
    phone: {type: String},
    address: {type: String},
    interested: {type: String} // 관심분야
});
UserSchema.static('findById', function (username, callback) {
    return this.find({id:username}, callback);
});
UserSchema.static('findAll', function (callback) {
    return this.find({}, callback);
});

module.exports = mongoose.model('users', UserSchema);