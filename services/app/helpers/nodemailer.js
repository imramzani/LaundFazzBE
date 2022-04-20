const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "testinghaloprof@gmail.com",
		pass: 'b123b123',
	},
});
const hbs = require('nodemailer-express-handlebars');
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