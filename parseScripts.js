const fs = require("fs").promises;
const path = require("path");
const { spawn } = require("child_process");

function parseHelpOutput(output) {
  const lines = output.split("\n");
  const options = [];

  const optionRegex =
    /^\s*-([a-zA-Z]),\s*--([a-zA-Z][a-zA-Z0-9-]*)\s*(.*)\s*\[(string|number|boolean)\].*$/;

  for (const line of lines) {
    const match = optionRegex.exec(line);
    if (match) {
      const [, shortOption, longOption, description, type] = match;
      options.push({
        alias: longOption,
        description: description.trim(),
        type,
      });
    }
  }

  return options;
}

function getHelpOutput(filePath) {
  return new Promise((resolve, reject) => {
    const helpProcess = spawn("node", [filePath, "--help"]);
    let helpOutput = "";

    helpProcess.stdout.on("data", (data) => {
      helpOutput += data.toString();
    });

    helpProcess.stderr.on("data", (data) => {
      reject(`Error running ${filePath} with --help: ${data.toString()}`);
    });

    helpProcess.on("close", (code) => {
      if (code === 0) {
        resolve(helpOutput);
      } else {
        reject(`Error running ${filePath} with --help. Exit code: ${code}`);
      }
    });
  });
}

async function getScriptOptions() {
  try {
    const files = await fs.readdir("./scripts");
    const jsFiles = files.filter((file) => path.extname(file) === ".js");
    const scriptOptions = {};

    for (const file of jsFiles) {
      const filePath = path.join("./scripts", file);
      const helpOutput = await getHelpOutput(filePath);
      const commandLineOptions = parseHelpOutput(helpOutput);
      scriptOptions[file] = commandLineOptions;
    }

    return scriptOptions;
  } catch (error) {
    console.error(
      "Error reading scripts directory or parsing help output:",
      error
    );
    throw error;
  }
}

module.exports = getScriptOptions;
