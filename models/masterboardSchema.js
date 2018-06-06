/**
 * Created by SW on 2018-05-10.
 */

var mongoose = require('mongoose');
var moment = require('moment');

var MasterBoardSchema = mongoose.Schema({
    title : String,
    author: String,
    category : Array,
    board_date: {type: Date, default: moment().format()},
    region : String,
    deadline : {type: Date, default: moment().format()},
    minNum : {type:Number, min:1},
    maxNum : {type:Number},
    currentNum : {type:Number, default:0},
    studyTerm : {type:Number, min:1},
    price : {type:Number,min:1,max:100},
    masterInfo : String,
    studyInfo : String,
    masterReview : String,
    path : String,
    count : {type:Number, default:0}
});

module.exports = mongoose.model('masterboards', MasterBoardSchema);
