var lookup = require("native-dns");
var hpi = require("./../models/honeypotinfo");

// turn arraound address
function rotateAddress (addr) {
  if (typeof addr !== typeof "") {
    return addr;
  }
  var tmp = addr.split(".");
  if (tmp.length !== 4) {
    return addr;
  }
  return tmp[3] + "." + tmp[2] + "." + tmp[1] + "." + tmp[0];
}

var DNS = function (cfg, addr, cb) {
  var url = cfg.apikey + "." + rotateAddress(addr) + ".dnsbl.httpbl.org";
  // judjzllkdhuq.1.0.0.127.dnsbl.httpbl.org
  // judjzllkdhuq.119.103.25.85.dnsbl.httpbl.org

  var req = lookup.Request({
    "question": lookup.Question({
      "name": url,
      "type": "A"
    }),
    "server": {
      "address": "8.8.8.8",
      "port": 53,
      "type": "udp"
    },
    "timeout": 1000
  });

  req.on("timeout", function () {
    console.log("DNS Timeout");
  });

  req.on("message", function (err, data) {
    if (typeof data.answer === typeof [] && data.answer.length > 0) {
      cb(hpi(data.answer[0].address));
    } else {
      cb(hpi(null));
    }
  });

  req.on("end", function () {
    console.log("finish");
  });

  req.send();
};

module.exports = DNS;
