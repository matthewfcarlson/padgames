# padgames

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