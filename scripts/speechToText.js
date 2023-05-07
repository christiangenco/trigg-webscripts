const { Polly, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
const { Readable } = require("stream");
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

// Configure Polly client
const polly = new Polly({ region: "us-west-2" });

// Configure Polly request parameters
const params = {
  OutputFormat: "mp3",
  Text: inputText,
  VoiceId: "Joanna",
  TextType: "text",
};

const synthesizeSpeech = async () => {
  try {
    const command = new SynthesizeSpeechCommand(params);
    const data = await polly.send(command);

    // Convert the AudioStream to a Readable stream
    const audioStream = Readable.from(data.AudioStream);

    const writeStream = fs.createWriteStream(outputFilePath);
    audioStream.pipe(writeStream);

    writeStream.on("finish", () => {
      console.log(
        "Text-to-speech conversion successful! Audio file saved to:",
        outputFilePath
      );
    });

    writeStream.on("error", (err) => {
      console.error("Error writing to file:", err);
    });
  } catch (err) {
    console.error("Error synthesizing speech:", err);
  }
};

synthesizeSpeech();
