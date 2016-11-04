var cfg = {
  "apikey": "judjzllkdhuq",
  "blacklistpath": "blacklist.list",
  "whitelistpath": "whitelist.list",
  "maxtimeonlist": 1000
};

var mod     = require("./../index")(cfg);
var http    = require("http");
var express = require("express");
var app     = express(http);

app.use(mod.checkRequest);

app.get("/", function (req, res) {
  res.send("Youre are checked positive!");
});

app.listen(8085, "127.0.0.1", function () {
  console.log("Server running....");
});
