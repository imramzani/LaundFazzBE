const accountSid = 'ACf52aa5f107142e3b40b8c4458846f87a'; 
const authToken = `039ab11107549314a36757eccc98be53`; 
const client = require('twilio')(accountSid, authToken); 
 
// client.messages 
//       .create({ 
//          body: 'Kontol Your Yummy Cupcakes Company order of 1 dozen frosted cupcakes has shipped and should be delivered on July 10, 2019. Details: http://www.yummycupcakes.com/', 
//          from: 'whatsapp:+14155238886',       
//          to: 'whatsapp:+6282139987938' 
//        }) 
//       .then(message => console.log(message.sid)) 
//       .done();
module.exports = client