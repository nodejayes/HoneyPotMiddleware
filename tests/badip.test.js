var cfg = {
  "apikey": "judjzllkdhuq",
  "blacklistpath": "blacklist.list",
  "whitelistpath": "whitelist.list",
  "maxtimeonlist": 1000
};

var mod = require("./../index")(cfg);

mod.checkIp("192.168.33.11", function () {
  console.log("Address is good 192.168.33.11");
});

mod.checkIp("85.25.103.119", function () {
  console.log("Address is good 85.25.103.119");
});
