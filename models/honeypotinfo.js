var enums = require("./../globals/honeypotenums");

var INFO = function (addr) {
  if (typeof addr !== typeof "" || addr.length < 8) {
    return null;
  }
  var tmp = addr.split(".");
  if (tmp.length !== 4) {
    return null;
  }
  return {
    "dayslastactive": parseInt(tmp[1]),
    "threatlevel": parseInt(tmp[2]),
    "attacktype": enums.attacktype[parseInt(tmp[3])]
  };
};

module.exports = INFO;
