var config  = require("./globals/config");
var checker = require("./module/checker");

function checkAddress (addr, next, req) {
  checker(config).check(addr, function (result) {
    if (result === null) {
      next();
    } else {
      console.log("Address was blocked: " + addr);
      if (typeof req !== typeof undefined && req !== null) {
        req.status(403).send("forbidden");
      }
    }
  });
}

var HONEYPOT = function (cfg) {
  config = cfg;

  return {
    "checkRequest": function (req, res, next) {
      checkAddress(req.connection.remoteAddress, next, req);
    },
    "checkIp": function (addr, cb) {
      checkAddress(addr, cb);
    }
  }
};

module.exports = HONEYPOT;
