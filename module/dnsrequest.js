var dns = require("dns");
var hpi = require("./../models/honeypotinfo");

var DNS = function (addr, cb) {
  dns.lookup(addr, function (err, address, family) {
    if (err) {
      throw err;
    } else {
      cb(hpi(address));
    }
  });
};

module.exports = DNS;
