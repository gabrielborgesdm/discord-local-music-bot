require('dotenv').config(); // Load environment variables from .env

const { Client, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

// Helper function to wait for user input before closing
function waitForKeyPress(message = '\nPress any key to exit...') {
  return new Promise((resolve) => {
    console.log(message);

    // For Windows PowerShell/Command Prompt compatibility
    if (process.platform === 'win32') {
      const readline = require('readline');
      readline.emitKeypressEvents(process.stdin);

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }

      process.stdin.resume();
      process.stdin.once('keypress', () => {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.pause();
        resolve();
      });
    } else if (process.stdin.isTTY && process.stdin.setRawMode) {
      // Unix-like systems
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        resolve();
      });
    } else {
      // Fallback: just keep the process alive
      console.log('(Waiting indefinitely - press Ctrl+C to exit)');
      // Don't resolve - keep process alive
    }
  });
}

// Function to handle fatal errors
async function handleFatalError(errorMessage, details = '') {
  console.error('\n' + '='.repeat(60));
  console.error('❌ ERROR: Bot cannot start');
  console.error('='.repeat(60));
  console.error(errorMessage);
  if (details) {
    console.error('\nDetails:', details);
  }
  console.error('\nPlease check the README.md file for setup instructions.');
  console.error('='.repeat(60));

  try {
    await waitForKeyPress();
  } catch (error) {
    // If waitForKeyPress fails, use a simple timeout
    console.error('\n(Closing in 30 seconds or press Ctrl+C to exit now)');
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  process.exit(1);
}

// Configure FFmpeg synchronously (before async operations)
function setupFFmpeg() {
  console.log('='.repeat(60));
  console.log('🎵 Discord Local Music Bot');
  console.log('='.repeat(60));
  console.log('Starting bot...\n');

  // Configure FFmpeg path to work with both Node.js and compiled exe
  let ffmpegPath;
  try {
    // Try to use ffmpeg-static when running with Node.js
    ffmpegPath = require('ffmpeg-static');
    console.log('✓ Using bundled FFmpeg (Node.js mode)');
  } catch (error) {
    // When running as exe, look for ffmpeg.exe in the same directory
    ffmpegPath = path.join(path.dirname(process.execPath), 'ffmpeg.exe');
    console.log('✓ Looking for FFmpeg in executable directory');
  }

  // Check if FFmpeg exists at the determined path
  if (!fs.existsSync(ffmpegPath)) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ ERROR: Bot cannot start');
    console.error('='.repeat(60));
    console.error('⚠️  FFmpeg not found!');
    console.error('\nDetails:', `Expected location: ${ffmpegPath}\n\nPlease ensure ffmpeg.exe is in the same directory as bot.exe`);
    console.error('\nPlease check the README.md file for setup instructions.');
    console.error('='.repeat(60));
    console.log('\nPress Ctrl+C to exit...');
    process.exit(1);
  }

  process.env.FFMPEG_PATH = ffmpegPath;
  console.log('✓ FFmpeg configured successfully');
  return ffmpegPath;
}

// Setup FFmpeg first (synchronous)
setupFFmpeg();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const PREFIX = process.env.PREFIX || '!';
// Use current working directory for songs folder (works for both npm and exe)
const songsPath = path.join(process.cwd(), 'songs');

let songQueue = [];
let isPlaying = false;
let currentPlayer = null;
let currentConnection = null;

// Validate environment and setup
async function validateSetup() {
  // Check Discord token
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token || token.trim() === '') {
    await handleFatalError(
      'Discord Bot Token is missing!',
      `Please add your Discord Bot Token to the .env file\n\nHow to get your token:\n1. Go to https://discord.com/developers/applications\n2. Select your application (or create a new one)\n3. Click "Bot" on the left sidebar\n4. Click "Reset Token" button\n5. Copy the token that appears\n6. Open .env with Notepad\n7. Paste your token after DISCORD_BOT_TOKEN=\n8. Save the file and restart the bot`
    );
  }
  console.log('✓ Discord token found');

  // Check songs folder
  if (!fs.existsSync(songsPath)) {
    console.log('⚠️  Songs folder not found, creating it...');
    try {
      fs.mkdirSync(songsPath, { recursive: true });
      console.log('✓ Songs folder created:', songsPath);
      console.log('  Please add .mp3 files to this folder and restart the bot.');
    } catch (error) {
      await handleFatalError(
        'Could not create songs folder!',
        `Path: ${songsPath}\nError: ${error.message}`
      );
    }
  } else {
    console.log('✓ Songs folder found:', songsPath);
  }

  // Check for songs
  const songs = getAvailableSongs();
  if (songs.length === 0) {
    console.log('⚠️  Warning: No .mp3 files found in songs folder');
    console.log('  Please add some .mp3 files to:', songsPath);
  } else {
    console.log(`✓ Found ${songs.length} song(s) in the songs folder`);
  }

  console.log(`✓ Command prefix: ${PREFIX}`);
  console.log('\nAll checks passed! Connecting to Discord...\n');
}

client.once('ready', () => {
  console.log('='.repeat(60));
  console.log(`✅ Bot is online and ready!`);
  console.log(`   Logged in as: ${client.user.tag}`);
  console.log(`   Bot ID: ${client.user.id}`);
  console.log(`   Servers: ${client.guilds.cache.size}`);
  console.log('='.repeat(60));
  console.log(`\nUse ${PREFIX}help in Discord to see available commands.\n`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'play') {
    const songName = args.join(' ');

    if (!message.member.voice.channel) {
      return message.reply('Você precisa estar em um canal de voz para tocar música!');
    }

    if (songName) {
      const songPath = getSongPath(songName);
      if (!songPath) {
        return message.reply(`Música não encontrada! Músicas disponíveis: ${getAvailableSongs().join(', ')}`);
      }
      addSongToQueue(songPath, message);
    } else {
      const allSongs = getAvailableSongsPaths();
      if (allSongs.length === 0) {
        return message.reply('Nenhuma música disponível no diretório!');
      }
      songQueue = songQueue.concat(allSongs);
    }

    if (!isPlaying) {
      playNextSong(message);
    }
  } else if (command === 'skip') {
    if (isPlaying) {
      playNextSong(message);
    } else {
      message.reply('Nenhuma música está tocando atualmente.');
    }
  } else if (command === 'queue') {
    if (songQueue.length > 0) {
      message.reply(`Fila atual: ${songQueue.map(song => path.parse(song).name).join(', ')}`);
    } else {
      message.reply('A fila está vazia.');
    }
  } else if (command === 'list') {
    const availableSongs = getAvailableSongs();
    if (availableSongs.length > 0) {
      message.reply(`*Músicas disponíveis:* \n${availableSongs.join('\n')}`);
    } else {
      message.reply('Nenhuma música encontrada no diretório.');
    }
  } else if (command === 'stop') {
    if (isPlaying && currentPlayer) {
      currentPlayer.stop();
      songQueue = [];
      isPlaying = false;
      if (currentConnection) {
        currentConnection.destroy(); // Faz o bot sair do canal de voz
        currentConnection = null;
      }
      message.channel.send('Reprodução parada, fila limpa e bot desconectado do canal de voz.');
    } else {
      message.reply('Nenhuma música está tocando atualmente.');
    }
  } else if (command === 'pause') {
    if (isPlaying && currentPlayer) {
      if (currentPlayer.state.status === AudioPlayerStatus.Playing) {
        currentPlayer.pause();
        message.channel.send('Reprodução pausada.');
      } else {
        message.reply('A reprodução já está pausada.');
      }
    } else {
      message.reply('Nenhuma música está tocando atualmente.');
    }
  } else if (command === 'resume') {
    if (isPlaying && currentPlayer) {
      if (currentPlayer.state.status === AudioPlayerStatus.Paused) {
        currentPlayer.unpause();
        message.channel.send('Reprodução retomada.');
      } else {
        message.reply('A reprodução já está em execução.');
      }
    } else {
      message.reply('Nenhuma música está tocando atualmente.');
    }
  } else if (command === 'help') {
    message.reply(getHelpMessage());
  }
});

// Função para obter a mensagem de ajuda
function getHelpMessage() {
  return `
**Lista de Comandos:**
- \`${PREFIX}play [nome-da-música]\`: Toca a música especificada ou todas as músicas se nenhum nome for fornecido.
- \`${PREFIX}skip\`: Pula a música atual.
- \`${PREFIX}pause\`: Pausa a música atual.
- \`${PREFIX}stop\`: Para a reprodução, limpa a fila e desconecta o bot do canal de voz.
- \`${PREFIX}leave\`: Sai do canal de voz.
- \`${PREFIX}queue\`: Lista todas as músicas na fila.
- \`${PREFIX}list\`: Lista todas as músicas disponíveis no diretório.
- \`${PREFIX}help\`: Mostra esta mensagem de ajuda.
`;
}

// Função para tocar a próxima música na fila
function playNextSong(message) {
  if (songQueue.length === 0) {
    // Se a fila está vazia, recarregar todas as músicas e tocar novamente
    const allSongs = getAvailableSongsPaths();
    if (allSongs.length > 0) {
      songQueue = allSongs; // Recarregar todas as músicas na fila
    } else {
      isPlaying = false;
      if (currentConnection) currentConnection.destroy(); // Limpar a conexão
      currentConnection = null;
      message.channel.send('A fila está vazia e não há músicas disponíveis para reproduzir.');
      return;
    }
  }

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    message.reply('Você precisa estar em um canal de voz para tocar música!');
    return;
  }

  const songPath = songQueue.shift(); // Pega a primeira música da fila

  if (currentConnection) {
    currentConnection.destroy(); // Destroi a conexão anterior se existir
  }

  currentConnection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();
  currentPlayer = player;
  const resource = createAudioResource(songPath);

  player.play(resource);
  currentConnection.subscribe(player);
  isPlaying = true;

  message.channel.send(`Tocando: ${path.parse(songPath).name}`);

  player.on(AudioPlayerStatus.Idle, () => {
    playNextSong(message); // Tocar a próxima música quando a atual terminar
  });

  player.on('error', error => {
    console.error('Erro ao tocar a música:', error);
    message.channel.send('Houve um erro ao tocar a música.');
    playNextSong(message); // Tentar tocar a próxima música em caso de erro
  });
}

// Função para obter todas as músicas disponíveis
function getAvailableSongs() {
  try {
    return fs.readdirSync(songsPath).filter(file => file.endsWith('.mp3')).map(file => path.parse(file).name);
  } catch (error) {
    return [];
  }
}

// Função para obter os caminhos de todas as músicas disponíveis
function getAvailableSongsPaths() {
  try {
    return fs.readdirSync(songsPath).filter(file => file.endsWith('.mp3')).map(file => path.join(songsPath, file));
  } catch (error) {
    return [];
  }
}

// Função para obter o caminho de uma música específica pelo nome
function getSongPath(songName) {
  const songPath = path.join(songsPath, `${songName}.mp3`);
  return fs.existsSync(songPath) ? songPath : null;
}

// Função para adicionar uma música à fila
function addSongToQueue(songPath, message) {
  songQueue.push(songPath);
  message.reply(`Adicionado à fila: ${path.parse(songPath).name}`);
}

// Add error handlers for the client
client.on('error', async (error) => {
  console.error('\n❌ Discord Client Error:', error.message);
  console.error('The bot encountered an error but will try to continue running.\n');
});

process.on('unhandledRejection', async (error) => {
  console.error('\n❌ Unhandled Promise Rejection:', error);
  console.error('An unexpected error occurred, but the bot will try to continue.\n');
});

// Start the bot
async function startBot() {
  await validateSetup();

  const token = process.env.DISCORD_BOT_TOKEN;

  try {
    await client.login(token);
  } catch (error) {
    let errorMessage = 'Failed to login to Discord!';
    let details = '';

    if (error.code === 'TokenInvalid') {
      details = 'Your Discord Bot Token is invalid.\n\nPlease check:\n1. The token in your .env file is correct\n2. You copied the entire token without extra spaces\n3. The token hasn\'t been regenerated in the Discord Developer Portal\n\nTo get a new token:\n1. Go to https://discord.com/developers/applications\n2. Select your application\n3. Click "Bot" in the left sidebar\n4. Click "Reset Token" and copy the new token\n5. Update your .env file with the new token';
    } else if (error.message.includes('Privileged intent')) {
      details = 'MESSAGE CONTENT intent is not enabled!\n\nPlease enable it:\n1. Go to https://discord.com/developers/applications\n2. Select your application\n3. Click "Bot" in the left sidebar\n4. Scroll down to "Privileged Gateway Intents"\n5. Enable "MESSAGE CONTENT INTENT"\n6. Save changes and restart the bot';
    } else {
      details = `Error: ${error.message}\n\nPlease check your internet connection and try again.`;
    }

    await handleFatalError(errorMessage, details);
  }
}

// Run the bot
startBot().catch(async (error) => {
  await handleFatalError('Unexpected startup error!', error.message);
});
