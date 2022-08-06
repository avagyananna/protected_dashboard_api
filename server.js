const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

require("./http/index.js");

process.on("beforeExit", (code) => {
    console.log("ProcessEnded - Process beforeExit event with code: ", code);
});
process.on("exit", (code) => {
    console.log("ProcessEnded - Process exit event with code: ", code);
});
process.on("warning", (warning) => {
    console.warn(warning.name); // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack); // Print the stack trace
});
