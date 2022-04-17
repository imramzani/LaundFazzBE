const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "testinghaloprof@gmail.com",
		pass: 'b123b123',
	},
});
const hbs = require('nodemailer-express-handlebars');
// const { path } = require("../app");
const handlebarsOption = {
	viewEngine:{
		extName:'.handlebars',
		partialsDir:'./views',
		defaultLayout:false
	},
	viewPath:'./views',
	extName:'.handlebars'
}

transporter.use('compile',hbs(handlebarsOption))

module.exports={
    transporter,
}