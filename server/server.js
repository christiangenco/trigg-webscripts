const express = require("express");
const getScriptOptions = require("./parseScripts");
const { spawn } = require("child_process");
const path = require("path");

const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 4031;

let cachedScriptOptions;

app.use(bodyParser.json());
// Set the CORS headers on every response
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Get the script options when the server starts
(async () => {
  try {
    cachedScriptOptions = await getScriptOptions();
  } catch (error) {
    console.error("Error getting script options:", error);
  }
})();

// serve the react app too
app.use(express.static(path.join(__dirname, "build")));

app.get("/:scriptName.js", (req, res) => {
  // serve index.html
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

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
  for (const option of cachedScriptOptions[scriptFilename].options) {
    const value = req.query?.[option.alias] || req.body?.[option.alias];
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
