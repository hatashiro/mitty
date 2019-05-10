#!/bin/sh
":" //; exec /usr/bin/env node --experimental-modules --no-warnings "$0" "$@"

import WabtModule from "wabt";
import cluster from "cluster";
import fs from "fs";
import os from "os";
import path from "path";

global.WabtModule = WabtModule;

const TIMEOUT = 20000;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const tests = fs
  .readdirSync(path.join(__dirname, "test"))
  .filter(name => name.endsWith(".b"))
  .map(name => path.basename(name, ".b"));

const timeoutMap = [];

function dispatch(worker) {
  clearTimeout(timeoutMap[worker.id]);

  if (tests.length) {
    const test = tests.shift();

    timeoutMap[worker.id] = setTimeout(() => {
      process.stdout.write(`Timeout(${test})`);
      worker.process.kill();
    }, TIMEOUT);

    worker.send(test);
  } else {
    worker.kill();
  }
}

async function readTestFile(fileName) {
  try {
    return await fs.promises.readFile(path.join("test", fileName), "utf-8");
  } catch {
    return null;
  }
}

if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on("message", (worker, message) => {
    if (message.type === "ready") {
      dispatch(worker);
    } else if (message.type === "next") {
      process.stdout.write(".");
      dispatch(worker);
    } else if (message.type === "fail") {
      process.stderr.write(
        `\nError occurred (${message.test}): ${message.text}\n`
      );
      process.exitCode = 1;
    }
  });
  cluster.on("exit", (worker, code) => {
    if (tests.length) {
      cluster.fork();
    }
  });
} else {
  (async function () {
    const { default: task } = await import(`./test/runner/${process.argv[2]}.mjs`);

    process.on("message", async testName => {
      try {
        await task(
          await readTestFile(testName + ".b"),
          await readTestFile(testName + ".in"),
          await readTestFile(testName + ".out")
        );
      } catch (err) {
        process.send({ type: "fail", test: testName, text: err.message });
      } finally {
        process.send({ type: "next" });
      }
    });

    process.send({ type: "ready" });
  })();
}
