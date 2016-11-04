var fs        = require("fs");
var os        = require("os");
var path      = require("path");
var blacklist = null;
var whitelist = null;
var maxtime   = 0;
var bltmp     = [];
var wltmp     = [];

function createFolderIfNotExists (p) {
  var dir = path.dirname(p);
  if (fs.existsSync(dir)) {
    return;
  }
  try {
    fs.makeDirSync(dir);
  } catch (err) {
    if (err.code === "ENOENT") {
      createFolderIfNotExists(path.dirname(dir));
      createFolderIfNotExists(dir);
    }
  }
}

function createFileIfNotExists (p, mode) {
  for (var i in p.split(path.sep)) {
    createFolderIfNotExists(p[i]);
    fs.writeFileSync(p[i], "", {"flag": mode});
  }
}

function find (type, ip) {
  clear();
  switch (type) {
    case "W":
      for (var i in wltmp) {
        var tmp = wltmp[i].split("|");
        if (tmp[0] === ip) {
          return {
            "idx": i,
            "obj": wltmp[i]
          };
        }
      }
      return null;
      break;
    default:
      for (var i in bltmp) {
        var tmp = bltmp[i].split("|");
        if (tmp[0] === ip) {
          return {
            "idx": i,
            "obj": bltmp[i]
          };
        }
      }
      return null;
  }
}

function addList (type, ip) {
  clear(type);
  if (find(type, ip) !== null) {
    return;
  }
  var entry = ip + "|" + new Date().getTime();
  switch (type) {
    case "W":
      wltmp.push(entry);
      break;
    default:
      bltmp.push(entry);
  }
  writeList(type);
}

function removeList (type, ip) {
  clear(type);
  var found = find(type, ip);
  if (found === null) {
    return;
  }
  switch (type) {
    case "W":
      wltmp.splice(found, 1);
      break;
    default:
      bltmp.splice(found, 1);
  }
  writeList(type);
}

// Sync File Content to Memory
function reloadList (type) {
  switch (type) {
    case "W":
      createFileIfNotExists(whitelist);
      wltmp = fs.readFileSync(whitelist).split(os.EOL);
      break;
    default:
      createFileIfNotExists(blacklist);
      bltmp = fs.readFileSync(blacklist).split(os.EOL);
  }
}

// Sync Memory to File
function writeList (type) {
  switch (type) {
    case "W":
      createFileIfNotExists(whitelist);
      fs.writeFileSync(whitelist, wltmp.join(os.EOL));
      break;
    default:
      createFileIfNotExists(blacklist);
      fs.writeFileSync(blacklist, bltmp.join(os.EOL));
  }
}

// Clear Old Entrys of Blacklist and Whitelist
function clear () {
  reloadList("W");
  clearList(wltmp);
  writeList("W");

  reloadList("B");
  clearList(bltmp);
  writeList("B");
}

function clearList (list) {
  for (var i in list) {
    var line = list[i].split("|");
    if (line.length !== 2 || isNaN(parseInt(line[2]))) {
      continue;
    }
    var diff = new Date().getTime() - parseInt(line[2]);
    if (diff > maxtime) {
      list.splice(i, 1);
    }
  }
}

var LISTING = function (cfg) {
  blacklist = cfg.blacklistpath;
  whitelist = cfg.whitelistpath;
  maxtime   = ((cfg.maxtimeonlist * 60) * 60) * 1000;

  // create whitelist/blacklist file
  createFileIfNotExists([blacklist, whitelist], "a");

  return {
    "findBlacklist": function (ip) {
      return find("B", ip);
    },
    "findWhitelist": function (ip) {
      return find("W", ip);
    },
    "addBlacklist": function (ip) {
      addList("B", ip);
    },
    "addWhitelist": function (ip) {
      addList("W", ip);
    },
    "removeBlacklist": function (ip) {
      removeList("B", ip);
    },
    "removeWhitelist": function (ip) {
      removeList("W", ip);
    },
    "reloadBlacklist": function () {
      reloadList("B");
    },
    "reloadWhitelist": function () {
      reloadList("W");
    },
    "clearLists": function () {
      clear();
    }
  }
}

module.exports = LISTING;
