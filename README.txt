ircFrankie -- An IRC bot written in JavaScript for educational purposes.

frankie.js is a Node.js program that will connect to an IRC server and join
a channel called #hollywood. It will then sit quietly and respond to pings
to keep the channel open. Any messages on the channel are met with a reply
of "Relax" from Frankie.

ircFrankie is totally useless for any purpose other than learning about IRC
communications and what takes place between the server and the client. To
this end, all communications are logged to the console.

To use ircFrankie, you'll need an IRC server. They are fairly rare these
days. InspIRCd is a package available for FreeBSD and other unix-like OS.
InspIRCd was used in testing ircFrankie.

I have a Docker container for InspIRCd on Raspberry Pi that may be helpful.
https://hub.docker.com/r/davescodemusings/inspircd

Once you have an IRC server available, check the top of frankie.js for the
hostname and port number. By default, they are configured for an IRC server
on the local host.

Run like this:
  node frankie.js

Configure a second IRC client and join the #hollywood channel to interact
with ircFrankie.

Frankie say: Have Fun!
