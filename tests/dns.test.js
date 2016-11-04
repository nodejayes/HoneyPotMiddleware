var lookup = require("native-dns");
// judjzllkdhuq.1.0.0.127.dnsbl.httpbl.org
// judjzllkdhuq.119.103.25.85.dnsbl.httpbl.org

var req = lookup.Request({
  "question": lookup.Question({
    "name": "judjzllkdhuq.119.103.25.85.dnsbl.httpbl.org",
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
  console.log(data.answer);
});

req.on("end", function () {
  console.log("finish");
});

req.send();
