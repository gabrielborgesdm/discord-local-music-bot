require('dotenv').config(); // Carregar variáveis de ambiente do .env

const { Client, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const PREFIX = process.env.PREFIX;
const songsPath = '../songs';

let songQueue = [];
let isPlaying = false;
let currentPlayer = null;
let currentConnection = null;

client.once('ready', () => {
  console.log(`Logado como ${client.user.tag}`);
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
  const songsDir = path.join(__dirname, songsPath);
  return fs.readdirSync(songsDir).filter(file => file.endsWith('.mp3')).map(file => path.parse(file).name);
}

// Função para obter os caminhos de todas as músicas disponíveis
function getAvailableSongsPaths() {
  const songsDir = path.join(__dirname, songsPath);
  return fs.readdirSync(songsDir).filter(file => file.endsWith('.mp3')).map(file => path.join(songsDir, file));
}

// Função para obter o caminho de uma música específica pelo nome
function getSongPath(songName) {
  const songsDir = path.join(__dirname, songsPath);
  const songPath = path.join(songsDir, `${songName}.mp3`);
  return fs.existsSync(songPath) ? songPath : null;
}

// Função para adicionar uma música à fila
function addSongToQueue(songPath, message) {
  songQueue.push(songPath);
  message.reply(`Adicionado à fila: ${path.parse(songPath).name}`);
}

const token = process.env.DISCORD_BOT_TOKEN; // Use o token do .env
client.login(token);
