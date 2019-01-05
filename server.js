const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

// hbs.register is part of html content and __dirname is first parent folder address
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// app.use is middleware function
app.use((req, res, next) => {
  var time = new Date().toString();
  var log = `${time} :${req.method} ${req.url}`;
  console.log(log);

// this below appendFile takes another error callback function if not it will give callback error function
  fs.appendFile('server.log', log + '\n', (error)=> {
    if (error) {
      console.log('unable to get log');
    }
  });
  next();
  // this above code execute in cdm terminal also
});

// this app.use doesnot use next so it doesnot let other things run.
// app.use((req, res , next) => {
//     res.render('maintenance.hbs');
// }); this is commented so other routes will work as defined. This is used for default special page
// so when this runs no routes work(next(); is not defined so..)

// this use fuction is placed here because express run from top to botton.
// and we want to avoid it running , we want to run after maintenance.hbs
app.use(express.static(__dirname + '/public'));

// this is also hbs (handler.js)  feature. when we define this registerHelper.
// it will work as global variable  and cn be executed from anywhere.
hbs.registerHelper('currentDate', () => {
 return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
return text.toUpperCase();
});

// this is node js routing function
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeScreen: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle:'about'
  });
});

app.get('/bad', (req, res) => {
 res.send({
   error: 'this page is not available',
   try: 'try another page'
 });

});

app.listen(3000);
