/**
 * Created by SW on 2018-05-16.
 */

var mongoose = require('mongoose');
var moment = require('moment');

var MasterSchema = mongoose.Schema({
    id: {type: String, required: true}, // required: true -> 반드시 필요한 값, unique: true -> 고유값
    password: {type: String},
    nickname: {type: String, required: true, index:'hashed'},
    salt: {type: String},
    created_at: {type: Date, index: {unique: false}, 'default': moment().format()},
    updated_at: {type: Date, index: {unique: false}, 'default': moment().format()},
    sellercheck:{type:Boolean,default:true},
    name: {type: String},
    age: {type: Number},
    gender: {type: String},
    photo: {type: String},
    majors: {type: String},
    phone: {type: String}
});
MasterSchema.static('findById', function (id, callback) {
    return this.find({id:id}, callback);
});
module.exports = mongoose.model('masters', MasterSchema);