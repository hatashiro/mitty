#!/usr/bin/env node

// Set global WabtModule
global.WabtModule = require("wabt");

require = require("esm")(module);
module.exports = require("./main.mjs");
