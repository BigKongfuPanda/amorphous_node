'use strict';

module.exports = {
	hostname: '192.168.0.89',
	port: parseInt(process.env.PORT, 10) || 8001,
	// url: 'mongodb://192.168.0.89:27017/amorphous',
	db: {
		host: '192.168.0.89',
		port: '3306',
		user: 'root',
		password: 'root1234#',
		database: 'daicai'
	},
	session: {
		name: 'SID',//这里的name值得是cookie的name，默认cookie的name是：connect.sid
		secret: 'SID',//
		cookie: {
			httpOnly: true,
			secure: false,//如果为true，则只能通过https
			maxAge: 365 * 24 * 60 * 60 * 1000, //单位 ms  可以通过 req.session.cookie.maxAge 来访问
		}
	}
}