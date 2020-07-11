/**
 * Frankie -- A sample IRC bot for Node.js.
 * Frankie is configured to log in and join the #hollywood channel.
 * Anything anyone says is met with Frankie's standard reply, "Relax."
 * Traffic to and from the server is logged on the console.
 * @author David Horton https://github.com/DavesCodeMusings/WeeNAS
 */
const net = require('net');

// Change the host and port number based on your requirements. 
const ircHost = "localhost";
const ircPort = 6667;
const ircChannel = "#hollywood";

// This is not a complete list of responses. (See RFC 2812 for that.)
// These are just the common ones encountered while testing with InspIRCd.
const commandResponses = {
  "001": "RPL_WELCOME",
  "002": "RPL_YOURHOST",
  "003": "RPL_CREATED",
  "004": "RPL_MYINFO",
  "005": "RPL_BOUNCE",
  "251": "RPL_LUSERCLIENT",
  "253": "RPL_LUSERUNKNOWN",
  "254": "RPL_LUSERCHANNELS",
  "255": "RPL_LUSERME",
  "353": "RPL_NAMREPLY",
  "366": "RPL_ENDOFNAMES",
  "372": "RPL_MOTD",
  "375": "RPL_MOTDSTART",
  "376": "RPL_ENDOFMOTD"
}

// Create a client connection to the IRC server and log in.
const client = net.createConnection(ircPort, ircHost, () => {
  console.log('Connecting to IRC server.');
  client.write('NICK frankie\r\n');
  client.write('USER frankie 0 * Frankie Goes to Hollywood\r\n');
});

client.on('data', (data) => {
  
  // Split the input buffer into lines of text. 
  let messageLines = data.toString().split("\r\n");

  // Examine each line for [:prefix] <response> <params>
  messageLines.forEach(line => {
    if (line.length > 0) {
      console.log(line);
      let prefix = '';
      let response = '';
      let params = '';
      let endOfPrefix = -1;

      // The prefix is optional. If it's there, it starts with a colon.
      if (line.charAt(0) == ':') {
        endOfPrefix = line.indexOf(' ');
        prefix = line.slice(0, endOfPrefix);
      }
      console.log(`  Prefix is...   '${prefix}'`);

      // The Server Response comes after the prefix and can be 3-digit numeric or variable-
      // length alpha. The end of the response is delimited by a space character.
      let endOfResponse = line.indexOf(' ', endOfPrefix + 1);
      response = line.slice(endOfPrefix + 1, endOfResponse);

      // As a courtesy, there's a subset of the 3-digit number to mnemonic look-up.
      let mnemonic = commandResponses[response] || '';
      console.log(`  Server say...  '${response}' ${mnemonic}`);

      // Anything after the prefix and the command response is captured as parameters and
      // shown in console output, but is not acted upon by this program.
      params = line.slice(endOfResponse + 1);
      console.log(`  With params... '${params}'`);

      // Compare server responses to decide what to do next.
      if (response == '004') {  // 001 - 004 are generated in sequence on successful registration.
        console.log('Registering as frankie.');
        client.write(`JOIN ${ircChannel}\r\n`);
      } else if (response == 'PING') {  // Keep the connection alive by responding to pings.
        console.log('Frankie say: PONG');
        client.write('PONG\r\n');
      } else if (response == 'PRIVMSG') {  // Respone to messages with catch phrase.
        console.log(`PRIVMSG ${ircChannel} :Relax.`);
        client.write(`PRIVMSG ${ircChannel} :Relax.\r\n`);
      }
    }
  });
});

// Frankie keeps going until someone presses CTRL+C or he gets kicked from IRC.
client.on('end', () => {
  console.log('Disconnected from server');
});
