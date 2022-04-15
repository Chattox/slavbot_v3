# Slavbot v3

## Slav harder

&nbsp;

&nbsp;

This is Slavbot, a discord bot for (preferably) smaller, personal servers. Main features are:

- Soundboard, with ability to play random (and random curated lists) and specific sounds
- User-specific join sounds. Announce yourself as you join! Never have to alt tab your game or turn your head slightly to your second monitor to see who's joined the channel again!
- Secret santa!
- Admin-only trolling commands! Bonk people into other channels!
- Some other stuff that literally never gets used like steam ratings and weather forecasts!

## Setup:

### Step 1: Installation

Clone repo and `npm i`

&nbsp;

### Step 2: Set up local files

Bit more involved now.

Need to make the following .json files in the installation directory (I'll probably make this automated at some point):

- `sound_manifest.json`
- `regular_users.json`
- `config.json`

The config file needs the following variables:

```json
"SND_PREFIX": "the prefix you want for sound commands",
"CMD_PREFIX": "the prefix you want for all other commands",
"TOKEN": "your discord bot token",
"ADMIN_IDS": ["an array containing the discord user IDs of any admins (you should start with your own to use slavbot properly)"],
"WEATHER_KEY": "your API key for openweathermap (you don't need this, but slavbot will likely crash if you use the weather command without it)",
"INTENTS": "your gateway intents int"
```

`sound_manifest.json` should look like this:

```json
{
  "randsounds": [],
  "regularSounds": []
}
```

You can add more for each specific rand command. The ones set up currently for me are:

```json
{
  "randime": [],
  "randomaly": [],
  "randcoind": [],
  "randgeralt": [],
  "randsmord": []
}
```

You get the picture.

`regular_users.json` just looks like this to begin with:

```json
{}
```

### Step 3: Running

```
node slavmain.js
```

---

## Some things to note:

Running slavbot on multiple servers from the same instance is not supported. It _kinda_ works currently, but don't expect it to be remotely stable or predictable.

If you want to run slavbot on multiple servers, you will need a fresh, separate installation of slavbat with it's own config files per server.

This is something I _might_ address in the future, but it would likely require a lot of time and effort that I'm probably not going to put into this bot.
