require = require("esm")(module);

const cluster = require("cluster");
const fs = require("fs");
const os = require("os");
const path = require("path");

const TIMEOUT = 1000;

const tests = fs
  .readdirSync(path.join(__dirname, "test"))
  .filter(name => name.endsWith(".b"))
  .map(name => name.split(".")[0]);

function dispatch(worker) {
  if (tests.length) {
    worker.send(tests.shift());
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

  cluster.on("online", worker => dispatch(worker));
  cluster.on("message", (worker, message) => {
    if (message.type === "next") {
      process.stdout.write(".");
      dispatch(worker);
    } else if (message.type === "fail") {
      process.stderr.write(
        `\nError occurred (${message.test}): ${message.text}\n`
      );
      process.exitCode = 1;
    } else if (message.type === "timeout") {
      process.stdout.write(`Timeout(${message.test})`);
    }
  });
  cluster.on("exit", (worker, code) => {
    if (code) {
      cluster.fork();
    }
  });
} else {
  const test = require(`./test/test-${process.argv[2]}.mjs`);
  process.on("message", async testName => {
    try {
      const timeout = setTimeout(() => {
        process.send({ type: "timeout", test: testName }, () => {
          process.exit(1);
        });
      }, TIMEOUT);

      await test.default(
        await readTestFile(testName + ".b"),
        await readTestFile(testName + ".in"),
        await readTestFile(testName + ".out")
      );

      clearTimeout(timeout);
    } catch (err) {
      process.send({ type: "fail", test: testName, text: err.message });
    } finally {
      process.send({ type: "next" });
    }
  });
}
