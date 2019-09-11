# padgames

[![Build Status](https://dev.azure.com/matthewfcarlson/padgames/_apis/build/status/matthewfcarlson.padgames?branchName=master)](https://dev.azure.com/matthewfcarlson/padgames/_build/latest?definitionId=1&branchName=master)

Pad games is a collection of games that can played via webapp on your phone, using an ipad or laptop as the central screen.
It aims to be flexible and easy to use.

It can be found at www.padgames.app

Games are free to join but the ability to host a game is just $1 per game (unlimited hosts) and some games will always free to host (this may change).

I'm still figuring out details and I'm open to community feedback.
The reason for charging is that I'm trying to charge just enough to help cover my expenses/time developing these games and encourage myself to continue working on it, in addition to covering costs for server time since I don't have an ads.
The pricing is subject to change, but once you have access to something, that will never be taken away!

## What does a typical game look like?

Check out this video of what a typical game looks like:
[TODO: video here]

## What is this for?

This is a set of games that can be played with your friends and their phones. It also works better if you have a large screen in the middle, though not all games require it. 

The games only have two rules of thumb:

 1. It must persuade the people playing to talk to each other
 2. It must require at least two screens to play. Whether that's two phones, an big screen and a small screen, or maybe it is flexible in what in requires.

## How can I use this?

This repository is setup as both an example of how I'm running the padgames service as well as to provide others a way to create their own games.
The games included here are setup as a submodule to a private github repo that the community won't have access to. 
This is to prevent others from simply starting their own server.
However, the goal will be to have the interface between the two well documented and an example game provided to help people be up and running.

## I have an suggestion or idea for a game!

Please drop me a line at matt@padgames.app or by opening a github issue.
I'd love to hear from you.
Alternatively, if you have a fully formed game that you want on the padgames platforms (I will need to vet the quality of the code), you can submit a PR and I'll look at incorporating it into the repository of games. Your game will be free as I don't want to charge for other's work.

## I don't see any ads

I hate ads.

## I Found a bug or you misspelled something

Yeah- there tends to be a lot when you're the only person working on it.
There's a lot I can't do all by myself and having your help makes it much easier.
Write up a detailed github issue and I'll get to it!
When it comes to bugs, it can be hard to collect the right kind of information so I'll be working on this process as issues come up.

## When did padgames start?

A few christmases ago, I was sitting in a room with almost my whole family and we were all on our phones.
We wanted to be together, but no one really wanted to do anything.
Someone suggested playing a few different games but the consesus among several people was that it was too much effort to both get up and setup the game.
I happened to have my laptop nearby and started coding up a small web version of a new game we had started playing using websockets so it would work on phones.
We played and had a great time and slowly I added more and more games to the collection, even doing some one off games for special events (a stock simulator for a class I taught and a gameshow with very specific questions).

## What sort of data do you collect? Are you GDPR compliant?

I'm happy to report that I'm 100% GDPR compliant because I collect no PII (Personally identifying information).
Techically I do collect the stripe information that is needed to take payments and tie that to an account.
But you'll be happy to note that there are no analytics or other tracking methods.
Since this is an open-source project, you will be able to view the information that does get uploaded.
I will be keeping track of how many games are played but I will never log any of the following:

 - IP Address
 - Browser fingerprint
 - Browsing history
 - Operating system
 - Name
 - Location
 - The name of your dog
 - The last thing you ate
 - Shopping habits
 - How long that toaster oven has been in your Amazon shopping cart
 - Address
 - Gender
 - Bank account number
 - Social security number

Any probably a few other things I can't think of.

## I don't have anyone to play with

The best part about padgames is that since it's a simple website, it is accessible anywhere! 
So people don't need to install an app, just load up the website or scan the room QR code.
You could just go to a nearby park, talk to the cool old people playing chess or the young couple on the picnic blanket and ask them to play.
Frankly that sounds terrifying, but hey you're the one who doesn't have any friends to play with.
Some of the games don't actually need you to stand next to each other, invite some strangers to play with you via the power of the internet and hop into a discord together.

## Development

### Steps for getting started

1. Clone the repo to a local directory
2. Run "npm install" to get the dependencies you need
3. Run "npm run dev" - this  compiles the server and client and starts the server
4. With any luck you should see a "listening on port 3000" in your console (it might not be the last thing printed since route generation can take a while)

### Guide to contributing

Feel free to create an issue and go ahead with a PR to fix it. Tag me and I'll assign it to you. If you make a PR, I'll add you to the list of contributors on the about page. If you're a regular contributor, we can talk about furthuring your role at PadGames and what goals you have.

### Architecture

Everything in this repo is typescript from both the server and client side.
Padgames has three sections: client, server, and games. Client and Server are compiled into dist_client and dist_server respectively.
The games folder contains all the public/free games as well as a submodule to the private repo that contains the paid/closed source games.
This allows the engine and games of PadGames to be open source and freely modifyable but prevents someone from simply hosting their own padgames with all the games I've made.
As mentioned in earlier docs, in the event that PadGames shuts down due to a lack of time, legal copyright issues, or money to keep the servers up, all private code will be merged into the padgames codebase on github for anyone to use.

#### Routes

Since the games aren't known while we're writing the code, in the webpack step runs webpack.dynamic.js that looks for routes.json files.
The routes.json files look like this:

```json
[{
    "path": "/websitepath",
    "name": "named-route",
    "chunk": true,
    "component": "./client/index.vue"
},
{
    "path": "/websitepath2",
    "name": "named-route2",
    "chunk": true,
    "isGame": true,
    "component": "./client/game.vue"
}
]
```

Different attributes mean different things. Chunk means lazy load, isGame means that it should be put into the list of games. 
Future information will be included in this file to generate more at compile time.
Once the schema of the file is standardized, a doc will be created detailing it.
So to add a new route on the client side, make sure to add a routes.json or in the default.routes.json.

#### Communication between client and server

Client and server communicate over websockets as it's a pretty universal technology. 
I've used socket.io as it's easy and fairly reliable (I've found a few bugs here and there).
If you have a better suggestion for a cross platform, web compatible method, please drop me a line (matt@padgames.app)

#### Room system

Each game generated gets a unique room code (5 letters long).
Codes are randomly assigned.
TODO: finish this section

#### Sharding

Right now, I don't have a good way to scale out. I'll explore this in the future if demand ever requires it.
One way I've been considering is assigning ranges of room codes to servers as needed. This makes it harder to scale down.
Another option is to have data stored in a database rather than in-memory and just have game state be served from that.
