var dnsreq  = require("./dnsrequest");
var listing = require("./listing");

var CHECKER = function (cfg) {
  var list = listing(cfg);

  return {
    "check": function (addr, cb) {
      var item = list.findBlacklist(addr);
      if (item === null) {
        item = list.findWhitelist(addr);
      } else {
        cb(item.obj);
      }
      if (item === null) {
        dnsreq(cfg, addr, function (result) {
          if (result === null) {
            list.addWhitelist(addr);
          } else {
            list.addBlacklist(addr);
          }
          cb(result);
        });
      } else {
        cb(null);
      }
    }
  }
};

module.exports = CHECKER;
