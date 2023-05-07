const AWS = require("aws-sdk");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

// Process command line arguments using yargs
const argv = yargs(hideBin(process.argv))
  .options({
    t: {
      alias: "text",
      description: "Input text to convert to speech",
      type: "string",
      demandOption: true,
    },
    o: {
      alias: "output",
      description: "Output file path for the speech audio",
      type: "string",
      demandOption: true,
    },
  })
  .usage("Usage: $0 -t [text] -o [output]")
  .example('$0 -t "Hello, World!" -o "./output.mp3"')
  .help("h")
  .alias("h", "help").argv;

const inputText = argv.text;
const outputFilePath = argv.output;

// Configure AWS SDK
AWS.config.update({ region: "us-west-2" });
const polly = new AWS.Polly({ apiVersion: "2016-06-10" });

// Configure Polly request parameters
const params = {
  OutputFormat: "mp3",
  Text: inputText,
  VoiceId: "Joanna",
  TextType: "text",
};

// Make a request to Amazon Polly
polly.synthesizeSpeech(params, (err, data) => {
  if (err) {
    console.error("Error synthesizing speech:", err);
  } else {
    // Save the output to the specified file path
    fs.writeFile(outputFilePath, data.AudioStream, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log(
          "Text-to-speech conversion successful! Audio file saved to:",
          outputFilePath
        );
      }
    });
  }
});
