# Users

## What is a user?

In the context of padgames, a user is anyone who plays the game.
Users that don't have accounts are anonymous.
A user has a PLAYER ID, which generated on demand per game.
This keeps track of a player across different games and is occasionally regenerated (usually once a day or so).
Playing a game causes the deadline on your PLAYER ID to reset, which means it won't expire midgame.
Paying for a game causes your Player ID to reset.

## Player ID

A player id includes:

- A GUID
- Player display name
- Paid status (for this game)

This allows games to perhaps denote something special about users who are paid (perhaps a gold star?)
The player ID does not determine if a player is a host.
The host is a specfic call to the game when it is first being setup and it is up to the game to decide what to do if/when the host becomes less active or inactive.
See the game document for more details.
TODO: how to prevent player IDs from being stolen?

## Sign in

Since a user can sign in with many methods, it can be tough to keep track of users.

## The room system

The room system keeps track of the users in the game and notifies games as needed.
That system is detailed in the document on games since it is a part of the IGame interface.
The room system keeps track of these things:

- The game ID (the 5 letter ccode)
- The players in the room
- The type of game being played

Players that leave the game are marked as less-active.
If they join a different game or after a certain timeout, they are marked as in-active.
The distinction is that the game can choose whether to remove them from the game or keep them around in hopes that they come back.
A game should not care about USER ID's and in fact should only care about PLAYER ID's.
This keeps data leakage low and since the PLAYER ID rotates frequently and once rotated cannot be traced back to the origonal user, the privacy concerns are low.
