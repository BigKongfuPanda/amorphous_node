'use strict';

const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const meltSchema = new Schema({
	user_name: String,
	password: String,
	id: Number,
	create_time: String,
	admin: {type: String, default: '管理员'},
	status: Number,  //1:普通管理、 2:超级管理员
	avatar: {type: String, default: 'default.jpg'},
	city: String,
})

meltSchema.index({id: 1});

const Melt = mongoose.model('Melt', meltSchema);


module.exports = Melt;