require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

//----------------------------------------------------
// - You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
// - When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
// - If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }
//----------------------------------------------------

app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json());
let WEB_DIC = {};

//handle post : url submitted
app.post("/api/shorturl", function (req, res) {
  //if url is neither empty or undefined
  if (req.body.url != "" && req.body.url != undefined){
    try {
      var url = new URL(req.body.url);
    } 
    //if wrong url format
    catch (_) {
      res.send({error: "Invalid URL"});
    }
    dns.lookup(url.hostname, (err, _) => {
      //if hostname is invalid
      if (err) {
        res.send({error: "Invalid URL"});
      }
      //if hostname is correct
      else{
        var indexWeb = Object.keys(WEB_DIC).length;
        WEB_DIC[indexWeb] = url;
        console.log(indexWeb)
        res.send({original_url: url, short_url: indexWeb});
      }
    })   
  }
  //if url is empty or undefined
  else{
    res.send({error: "Invalid URL"});
  }
})


//handle /api/shorturl/:shortCurl
app.get("/api/shorturl/:shortCurl", 
        function(req, res){
          var shortCurl = req.params.shortCurl;
          //if shortCurl is correct
          if(Object.keys(WEB_DIC).indexOf(String(shortCurl))>-1){
            res.redirect(WEB_DIC[String(shortCurl)]);
          }
          //if shortCurl is incorrect
          else{
            res.send({error: "Invalid short_url"});
          }
})
