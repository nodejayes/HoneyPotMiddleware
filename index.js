var config  = require("./globals/config");
var checker = require("./module/checker");

function checkAddress (addr, next, res) {
  checker(config).check(addr, function (result) {
    if (result === null) {
      next();
    } else {
      console.log("Address was blocked: " + addr);
      if (typeof res !== typeof undefined && res !== null) {
        res.status(403).send();
      }
    }
  });
}

var HONEYPOT = function (cfg) {
  config = cfg;

  return {
    "checkRequest": function (req, res, next) {
      checkAddress(req.connection.remoteAddress, next, res);
    },
    "checkIp": function (addr, cb) {
      checkAddress(addr, cb);
    }
  }
};

module.exports = HONEYPOT;
