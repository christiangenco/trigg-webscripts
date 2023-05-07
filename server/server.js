const express = require("express");
const getScriptOptions = require("./parseScripts");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const port = process.env.PORT || 4000;

let cachedScriptOptions;

// Get the script options when the server starts
(async () => {
  try {
    cachedScriptOptions = await getScriptOptions();
  } catch (error) {
    console.error("Error getting script options:", error);
  }
})();

app.get("/commands.json", (req, res) => {
  res.json(cachedScriptOptions);
});

app.post("/:scriptFilename.json", (req, res) => {
  const { scriptFilename } = req.params;
  const scriptPath = path.join("./scripts", scriptFilename);

  // Check if the script exists in the cached options
  if (!cachedScriptOptions.hasOwnProperty(scriptFilename)) {
    res.status(404).send("Script not found");
    return;
  }

  // Prepare the script arguments from the query parameters
  const args = [];
  for (const option of cachedScriptOptions[scriptFilename]) {
    const value = req.query[option.alias];
    if (value) {
      args.push(`--${option.alias}`, value);
    }
  }

  const scriptProcess = spawn("node", [scriptPath, ...args]);
  let stdout = "";
  let stderr = "";

  scriptProcess.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  scriptProcess.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  scriptProcess.on("close", (code) => {
    res.json({
      exitCode: code,
      stdout,
      stderr,
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
