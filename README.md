# Discord Music Bot

A simple Discord music bot using Node.js, `discord.js`, and `@discordjs/voice`. This bot allows you to play songs from a local folder in a voice channel.

## Setup

### 1. Installation

IMPORTANT: Please ignore the code quality—it's a quick draft generated with ChatGPT and might be a bit messy.

To run the server, I've used Nexe to create a .exe file. Follow these steps:

Copy the .env.example file to .env.
Obtain your Discord bot token from the Discord Developer Portal and add it to the .env file. [Discord Developer Portal](https://discord.com/developers/applications)
Add the bot to your server.
Place your songs in the songs folder.
Run bot.exe.

### 2. Environment Variables

Create a `.env` file in the root directory with the following content:

```bash
DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN
```

Replace `YOUR_BOT_TOKEN` with your actual Discord bot token.

### 3. Adding Songs

Add your `.mp3` files to the `src/songs` directory. The bot will automatically load these songs.

### 6. Usage

In your Discord server, use the following commands:

- **`!play [song-name]`**: Plays the specified song from the `songs` directory, or all songs if no name is provided.
- **`!skip`**: Skips the current song and plays the next one in the queue.
- **`!queue`**: Lists all songs currently in the queue.

### 7. Available Commands

- **`!play <song-name>`**: Plays the specified song or all songs in the `songs` directory.
- **`!skip`**: Skips the current song.
- **`!queue`**: Lists all songs in the queue.
- **`!help`**: List all of commands (in portuguese)
  
## License

This project is licensed under the MIT License.