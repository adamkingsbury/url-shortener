var flatfile = require('flat-file-db');
var cleanup = require('../cleanup');
var URL = require('url');
var validUrl = require('valid-url');


var db = flatfile.sync('./data/db.db');
cleanup.Cleanup(function(){
  console.log('Cleaning Up!!!');
  
  db.close();
});




var encode = function(req,res, next){
  
  if(!req.query.longURL){
    return next();
  }
  
  var reqURL = req.query.longURL;
  console.log('Requested shortening of long URL: '+reqURL);

  /*var urlTest;
  try{
    urlTest = URL.parse(reqURL);
  }
  catch(e) {
    console.log('The URL ' + reqURL + ' was invalid.');
    console.log('Error: ' + e);
    res.status(401);
    res.json({});
    return;
  }*/
  
  if (!validUrl.isWebUri(reqURL)) {
  
    console.log('The URL ' + reqURL + ' was invalid.');
    res.status(201);
    res.json({});
    return;
  
  }


  console.log('valid url');

  //get latest link index or create
  var index = db.get('linkCount') || 1 ;

  //hexadecimal encode the counter as the shortened link path
  var shortURL = index.toString(16);
  db.put(shortURL, reqURL);
  db.put('linkCount', index+1);

  res.status(200)
  res.json({
    shortURL: process.env.ENCODEPATH +'/'+shortURL,
    longURL: reqURL
  });
};




var decode = function(req, res, next){

  var reqURL = req.params.thing;
  console.log('Requested short URL: '+reqURL);

  if (db.has(reqURL)){
    var lookup = db.get(reqURL);
    console.log('the following long URL was found: ' + lookup);
    res.status(302)
    res.redirect(lookup);
  }
  else {
    res.status(201);
    res.json({});
  }
};


module.exports = {
  encode: encode,
  decode: decode
};