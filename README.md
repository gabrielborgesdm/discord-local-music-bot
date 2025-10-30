# 🎵 Discord Local Music Bot

A simple and user-friendly Discord bot that plays music from your local MP3 files in voice channels. No coding knowledge required!

**[🇧🇷 Versão em Português](#-bot-de-música-local-para-discord)** | **[📥 Download](#-how-to-download)**

## 📥 How to Download

1. Go to the [GitHub repository](https://github.com/gabrielborgesdm/discord-local-music-bot)
2. Click the green **"Code"** button
3. Select **"Download ZIP"**
4. Extract the ZIP file to a folder on your computer
5. Follow the setup instructions below

## 📋 What You Need

- Windows PC
- Discord account
- MP3 music files you want to play
- Internet connection

**No installation required!** Everything is bundled in the exe file.

## 🚀 Quick Start Guide (For Non-Developers)

### Step 1: Create Your Discord Bot

1. **Go to Discord Developer Portal**
   - Visit: https://discord.com/developers/applications
   - Log in with your Discord account

2. **Create a New Application**
   - Click the "New Application" button (top right)
   - Give it a name (e.g., "My Music Bot")
   - Click "Create"

3. **Get Your Bot Token**
   - In the left sidebar, click **"Bot"**
   - Under the bot's username, click **"Reset Token"** button
   - Click "Yes, do it!" to confirm
   - **Copy the token** that appears (you'll need this!)
   - ⚠️ **Important**: Keep this token secret! Don't share it with anyone.

4. **Enable Required Permissions**
   - Scroll down to **"Privileged Gateway Intents"**
   - Enable these options:
     - ✅ **MESSAGE CONTENT INTENT** (very important!)
     - ✅ **SERVER MEMBERS INTENT**
   - Click "Save Changes"

5. **Invite Bot to Your Server**
   - In the left sidebar, click **"OAuth2"** → **"URL Generator"**
   - Under **SCOPES**, check:
     - ✅ `bot`
   - Under **BOT PERMISSIONS**, check:
     - ✅ Send Messages
     - ✅ Read Messages/View Channels
     - ✅ Connect (Voice)
     - ✅ Speak (Voice)
   - Copy the URL at the bottom of the page
   - Paste it into your browser and select your server
   - Click "Authorize"

### Step 2: Set Up the Bot Files

1. **Locate Your Bot Files**
   - You should have these files in a folder:
     - `run-bot.bat` (the bot program)
     - `ffmpeg.exe` (audio processor - must be in same folder!)
     - `.env` (configuration file)

2. **Edit Your Configuration File**
   - Open `.env` with Notepad (or any text editor)
   - Find the line that says `DISCORD_BOT_TOKEN=`
   - Paste your Discord bot token after the `=` sign
   - Make sure there are no spaces before or after the token
   - Save and close the file

   Example `.env` file:
   ```
   DISCORD_BOT_TOKEN=MTI3ODUzMzQ2MDI2ODY3OTE4MA.GE-ooJ.hVpnCaAOy0tyqGuOGivb
   PREFIX=;;
   ```

3. **Add Your Music**
   - Create a folder called `songs` in the same location as `run-bot.bat`
   - Put your `.mp3` files in this folder
   - The bot will automatically find and play them!

   Your folder structure should look like this:
   ```
   📁 discord-local-music-bot-main/
   ├── bot.bat
   ├── ffmpeg.exe
   ├── .env
   ├── README.md
   └── 📁 songs/
       ├── song1.mp3
       ├── song2.mp3
       └── song3.mp3
   ```

### Step 3: Run the Bot

1. **Double-click `bot.bat`**
2. You should see messages like:
   ```
   ✓ FFmpeg configured successfully
   ✓ Discord token found
   ✓ Songs folder found
   ✓ Found 5 song(s) in the songs folder
   ✅ Bot is online and ready!
   ```
3. **Keep the window open** while you want the bot to run
4. If there are errors, read them carefully - they will tell you what's wrong!

### Step 4: Use the Bot in Discord

1. Join a voice channel in your Discord server
2. Type commands in any text channel:

**Available Commands:**
- `;;help` - Show all available commands
- `;;play` - Plays all songs in the songs folder
- `;;play song name` - Plays a specific song (without .mp3)
- `;;skip` - Skip to the next song
- `;;pause` - Pause the current song
- `;;resume` - Resume playback
- `;;stop` - Stop playing and clear the queue
- `;;queue` - Show what's coming up next
- `;;list` - See all available songs

**Examples:**
```
;;play                    (plays all songs)
;;play Feral Guardians    (plays specific song)
;;skip                    (skip current song)
;;list                    (see all songs)
```

## 🔧 For Developers

If you want to run from source code instead of run-bot.bat:

### Installation

```bash
npm install
```

### Configuration

Edit `.env` and add your bot token:
```
DISCORD_BOT_TOKEN=your_token_here
PREFIX=;;
```

### Running

```bash
npm start
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

### File Structure

- `src/index.js` - Main bot code
- `songs/` - Place your .mp3 files here (in root directory)
- `.env` - Configuration file
- `run-bot.bat` - Compiled executable (built with Nexe)

## ❓ FAQ / Troubleshooting

### Bot closes immediately when I open it

**Problem**: The window opens and closes right away.

**Solutions**:
- Make sure you have a `.env` file with your bot token filled in
- Check that `ffmpeg.exe` is in the same folder as `run-bot.bat`
- The bot now shows error messages before closing - read them carefully!

---

### "Discord Bot Token is missing or invalid"

**Problem**: Bot can't log in to Discord.

**Solutions**:
1. Check your `.env` file has the correct token
2. Make sure there are no extra spaces before or after the token
3. Verify the token hasn't been regenerated in Discord Developer Portal
4. Try resetting the token in the Developer Portal:
   - Go to https://discord.com/developers/applications
   - Select your application → Bot → Reset Token
   - Copy the new token and update your `.env` file

---

### "MESSAGE CONTENT intent is not enabled"

**Problem**: Bot can't read messages/commands.

**Solution**:
1. Go to https://discord.com/developers/applications
2. Select your application
3. Click **"Bot"** in the left sidebar
4. Scroll to **"Privileged Gateway Intents"**
5. Enable **"MESSAGE CONTENT INTENT"**
6. Click "Save Changes"
7. Restart the bot

---

### "FFmpeg not found"

**Problem**: Audio processing tool is missing.

**Solutions**:
- Make sure `ffmpeg.exe` is in the **same folder** as `run-bot.bat`
- If you're missing `ffmpeg.exe`:
  - For run-bot.bat users: Copy it from `node_modules/ffmpeg-static/ffmpeg.exe`
  - Or download from: https://www.gyan.dev/ffmpeg/builds/
- Both files must be in the same directory

---

### Bot doesn't respond to commands

**Problem**: Bot is online but ignoring commands.

**Solutions**:
1. Check that MESSAGE CONTENT intent is enabled (see above)
2. Make sure you're using the correct prefix (default is `;;`)
3. Verify the bot has "Read Messages" permission in the channel
4. Check that the bot is actually online (green status in Discord)
5. Try the command `;;help` to test

---

### "No .mp3 files found in songs folder"

**Problem**: Bot can't find your music.

**Solutions**:
- Create a `songs` folder in the same location as `run-bot.bat` if it doesn't exist
- Make sure your music files have the `.mp3` extension
- Check that the files are directly in the `songs` folder (not in subfolders)
- Restart the bot after adding songs

---

### Bot can't join voice channel

**Problem**: Bot doesn't connect when you use `;;play`.

**Solutions**:
1. Make sure **you** are in a voice channel first
2. Check bot permissions in Discord server settings:
   - View Channels
   - Connect
   - Speak
3. Try kicking and re-inviting the bot with proper permissions

---

### Audio is choppy or distorted

**Problem**: Music playback has poor quality.

**Solutions**:
- Check your internet connection
- Verify the MP3 files aren't corrupted (play them locally first)
- Make sure `ffmpeg.exe` is the correct version and not corrupted
- Try using lower bitrate MP3 files

---

### Where do I find my Bot Token again?

**Solution**:
1. Go to https://discord.com/developers/applications
2. Select your application
3. Click **"Bot"** in the left sidebar
4. Under the bot username, click **"Reset Token"**
5. Copy the new token (old one won't work anymore!)
6. Update your `.env` file

---

### Can I run multiple bots at once?

**Answer**: Yes, but each bot needs:
- Its own bot token (create multiple applications in Discord Developer Portal)
- Its own `.env` file with unique token
- Its own copy of the bot files in separate folders

---

### How do I stop the bot?

**Solutions**:
- Type `;;stop` in Discord to stop music and disconnect from voice
- Close the run-bot.bat window to shut down completely
- Press Ctrl+C in the command window

---

### "Unhandled Promise Rejection" or other errors

**Problem**: Random errors appear in the console.

**Solutions**:
- The bot should keep running despite these errors
- Check your internet connection
- Try restarting the bot
- If errors persist, check the Discord API status: https://discordstatus.com

---

### Bot keeps disconnecting

**Problem**: Bot goes offline randomly.

**Solutions**:
- Check your internet connection stability
- Verify your PC isn't going to sleep
- Make sure no firewall is blocking the bot
- Check Discord API status: https://discordstatus.com

---

### Want to change the command prefix?

**Solution**:
1. Open your `.env` file
2. Change the PREFIX line:
   ```
   PREFIX=?
   ```
   (Now commands would be `?play`, `?skip`, etc.)
3. Save the file and restart the bot

---

## 📝 Need More Help?

- Read error messages carefully - they usually tell you exactly what's wrong!
- Check that all files are in the correct locations
- Make sure you followed all setup steps
- Try restarting the bot after making changes
- Verify your Discord Developer Portal settings

## 📜 License

This project is licensed under the MIT License.

---

**Note**: This bot is for personal use. Make sure you have the rights to play any music files you use with it.

---
---

# 🎵 Bot de Música Local para Discord

Um bot simples e fácil de usar para Discord que toca músicas dos seus arquivos MP3 locais em canais de voz. Não precisa saber programar!

**[🇺🇸 English Version](#-discord-local-music-bot)** | **[📥 Download](#-como-baixar)**

## 📥 Como Baixar

1. Vá para o [repositório no GitHub](https://github.com/gabrielborgesdm/discord-local-music-bot)
2. Clique no botão verde **"Code"** (Código)
3. Selecione **"Download ZIP"** (Baixar ZIP)
4. Extraia o arquivo ZIP para uma pasta no seu computador
5. Siga as instruções de configuração abaixo

## 📋 O Que Você Precisa

- PC com Windows (para o run-bot.bat)
- Conta no Discord
- Arquivos de música MP3 que você quer tocar
- Conexão com internet

## 🚀 Guia de Início Rápido (Para Não-Desenvolvedores)

### Passo 1: Criar Seu Bot no Discord

1. **Acesse o Portal de Desenvolvedores do Discord**
   - Visite: https://discord.com/developers/applications
   - Faça login com sua conta Discord

2. **Crie uma Nova Aplicação**
   - Clique no botão "New Application" (canto superior direito)
   - Dê um nome (ex: "Meu Bot de Música")
   - Clique em "Create"

3. **Obtenha o Token do Seu Bot**
   - Na barra lateral esquerda, clique em **"Bot"**
   - Abaixo do nome do bot, clique no botão **"Reset Token"**
   - Clique em "Yes, do it!" para confirmar
   - **Copie o token** que aparecer (você vai precisar!)
   - ⚠️ **Importante**: Mantenha este token em segredo! Não compartilhe com ninguém.

4. **Habilite as Permissões Necessárias**
   - Role para baixo até **"Privileged Gateway Intents"**
   - Ative estas opções:
     - ✅ **MESSAGE CONTENT INTENT** (muito importante!)
     - ✅ **SERVER MEMBERS INTENT**
   - Clique em "Save Changes"

5. **Convide o Bot para Seu Servidor**
   - Na barra lateral esquerda, clique em **"OAuth2"** → **"URL Generator"**
   - Em **SCOPES**, marque:
     - ✅ `bot`
   - Em **BOT PERMISSIONS**, marque:
     - ✅ Send Messages
     - ✅ Read Messages/View Channels
     - ✅ Connect (Voice)
     - ✅ Speak (Voice)
   - Copie a URL que aparece na parte inferior da página
   - Cole no seu navegador e selecione seu servidor
   - Clique em "Authorize"

### Passo 2: Configurar os Arquivos do Bot

1. **Localize os Arquivos do Bot**
   - Você deve ter estes arquivos em uma pasta:
     - `run-bot.bat` (o programa do bot)
     - `ffmpeg.exe` (processador de áudio - deve estar na mesma pasta!)
     - `.env` (arquivo de configuração)

2. **Edite o Arquivo de Configuração**
   - Abra o arquivo `.env` com o Bloco de Notas (ou qualquer editor de texto)
   - Encontre a linha que diz `DISCORD_BOT_TOKEN=`
   - Cole o token do Discord após o sinal `=`
   - Certifique-se de não ter espaços antes ou depois do token
   - Salve e feche o arquivo

   Exemplo de arquivo `.env`:
   ```
   DISCORD_BOT_TOKEN=MTI3ODUzMzQ2MDI2ODY3OTE4MA.GE-ooJ.hVpnCaAOy0tyqGuOGivb
   PREFIX=;;
   ```

3. **Adicione Suas Músicas**
   - Crie uma pasta chamada `songs` no mesmo local do `run-bot.bat`
   - Coloque seus arquivos `.mp3` nesta pasta
   - O bot vai encontrá-los automaticamente!

   A estrutura de pastas deve ficar assim:
   ```
   📁 discord-local-music-bot-main/
   ├── run-bot.bat
   ├── ffmpeg.exe
   ├── .env
   ├── README.md
   └── 📁 songs/
       ├── musica1.mp3
       ├── musica2.mp3
       └── musica3.mp3
   ```

### Passo 3: Executar o Bot

1. **Clique duas vezes em `run-bot.bat`**
2. Você deve ver mensagens como:
   ```
   ✓ FFmpeg configured successfully
   ✓ Discord token found
   ✓ Songs folder found
   ✓ Found 5 song(s) in the songs folder
   ✅ Bot is online and ready!
   ```
3. **Mantenha a janela aberta** enquanto quiser que o bot funcione
4. Se houver erros, leia-os com atenção - eles dirão o que está errado!

### Passo 4: Usar o Bot no Discord

1. Entre em um canal de voz no seu servidor Discord
2. Digite comandos em qualquer canal de texto:

**Comandos Disponíveis:**
- `;;help` - Mostra todos os comandos disponíveis
- `;;play` - Toca todas as músicas da pasta songs
- `;;play nome da música` - Toca uma música específica (sem o .mp3)
- `;;skip` - Pula para a próxima música
- `;;pause` - Pausa a música atual
- `;;resume` - Retoma a reprodução
- `;;stop` - Para de tocar e limpa a fila
- `;;queue` - Mostra o que vem a seguir
- `;;list` - Vê todas as músicas disponíveis

**Exemplos:**
```
;;play                    (toca todas as músicas)
;;play Feral Guardians    (toca música específica)
;;skip                    (pula música atual)
;;list                    (vê todas as músicas)
```

## 🔧 Para Desenvolvedores

Se você quiser executar a partir do código fonte ao invés do run-bot.bat:

### Instalação

```bash
npm install
```

### Configuração

Edite o arquivo `.env` e adicione o token do bot:
```
DISCORD_BOT_TOKEN=seu_token_aqui
PREFIX=;;
```

### Executar

```bash
npm start
```

### Modo de Desenvolvimento (com recarregamento automático)

```bash
npm run dev
```

### Estrutura de Arquivos

- `src/index.js` - Código principal do bot
- `songs/` - Coloque seus arquivos .mp3 aqui (no diretório raiz)
- `.env` - Arquivo de configuração
- `run-bot.bat` - Executável compilado (construído com Nexe)

## ❓ Perguntas Frequentes / Solução de Problemas

### Bot fecha imediatamente quando eu abro

**Problema**: A janela abre e fecha rapidamente.

**Soluções**:
- Certifique-se de ter um arquivo `.env` com o token do bot preenchido
- Verifique se `ffmpeg.exe` está na mesma pasta que `run-bot.bat`
- O bot agora mostra mensagens de erro antes de fechar - leia-as com atenção!

---

### "Discord Bot Token is missing or invalid"

**Problema**: Bot não consegue fazer login no Discord.

**Soluções**:
1. Verifique se o arquivo `.env` tem o token correto
2. Certifique-se de não haver espaços extras antes ou depois do token
3. Verifique se o token não foi regerado no Portal de Desenvolvedores do Discord
4. Tente resetar o token no Portal de Desenvolvedores:
   - Vá para https://discord.com/developers/applications
   - Selecione sua aplicação → Bot → Reset Token
   - Copie o novo token e atualize seu arquivo `.env`

---

### "MESSAGE CONTENT intent is not enabled"

**Problema**: Bot não consegue ler mensagens/comandos.

**Solução**:
1. Vá para https://discord.com/developers/applications
2. Selecione sua aplicação
3. Clique em **"Bot"** na barra lateral esquerda
4. Role até **"Privileged Gateway Intents"**
5. Ative **"MESSAGE CONTENT INTENT"**
6. Clique em "Save Changes"
7. Reinicie o bot

---

### "FFmpeg not found"

**Problema**: Ferramenta de processamento de áudio está faltando.

**Soluções**:
- Certifique-se de que `ffmpeg.exe` está na **mesma pasta** que `run-bot.bat`
- Se estiver faltando o `ffmpeg.exe`:
  - Para usuários do run-bot.bat: Copie de `node_modules/ffmpeg-static/ffmpeg.exe`
  - Ou baixe de: https://www.gyan.dev/ffmpeg/builds/
- Ambos os arquivos devem estar no mesmo diretório

---

### Bot não responde aos comandos

**Problema**: Bot está online mas ignorando comandos.

**Soluções**:
1. Verifique se MESSAGE CONTENT intent está ativado (veja acima)
2. Certifique-se de estar usando o prefixo correto (padrão é `;;`)
3. Verifique se o bot tem permissão "Read Messages" no canal
4. Confirme que o bot está realmente online (status verde no Discord)
5. Tente o comando `;;help` para testar

---

### "No .mp3 files found in songs folder"

**Problema**: Bot não consegue encontrar suas músicas.

**Soluções**:
- Crie uma pasta `songs` no mesmo local do `run-bot.bat` se ela não existir
- Certifique-se de que seus arquivos de música têm a extensão `.mp3`
- Verifique se os arquivos estão diretamente na pasta `songs` (não em subpastas)
- Reinicie o bot depois de adicionar músicas

---

### Bot não consegue entrar no canal de voz

**Problema**: Bot não conecta quando você usa `;;play`.

**Soluções**:
1. Certifique-se de que **você** está em um canal de voz primeiro
2. Verifique as permissões do bot nas configurações do servidor Discord:
   - View Channels
   - Connect
   - Speak
3. Tente expulsar e reconvidar o bot com as permissões adequadas

---

### Áudio está picotado ou distorcido

**Problema**: A reprodução da música tem qualidade ruim.

**Soluções**:
- Verifique sua conexão com internet
- Confirme que os arquivos MP3 não estão corrompidos (toque-os localmente primeiro)
- Certifique-se de que `ffmpeg.exe` é a versão correta e não está corrompido
- Tente usar arquivos MP3 com bitrate mais baixo

---

### Onde encontro meu Token do Bot novamente?

**Solução**:
1. Vá para https://discord.com/developers/applications
2. Selecione sua aplicação
3. Clique em **"Bot"** na barra lateral esquerda
4. Abaixo do nome do bot, clique em **"Reset Token"**
5. Copie o novo token (o antigo não funcionará mais!)
6. Atualize seu arquivo `.env`

---

### Posso executar vários bots ao mesmo tempo?

**Resposta**: Sim, mas cada bot precisa de:
- Seu próprio token de bot (crie múltiplas aplicações no Portal de Desenvolvedores do Discord)
- Seu próprio arquivo `.env` com token único
- Sua própria cópia dos arquivos do bot em pastas separadas

---

### Como eu paro o bot?

**Soluções**:
- Digite `;;stop` no Discord para parar a música e desconectar do canal de voz
- Feche a janela do run-bot.bat para desligar completamente
- Pressione Ctrl+C na janela de comando

---

### "Unhandled Promise Rejection" ou outros erros

**Problema**: Erros aleatórios aparecem no console.

**Soluções**:
- O bot deve continuar funcionando apesar desses erros
- Verifique sua conexão com internet
- Tente reiniciar o bot
- Se os erros persistirem, verifique o status da API do Discord: https://discordstatus.com

---

### Bot continua desconectando

**Problema**: Bot fica offline aleatoriamente.

**Soluções**:
- Verifique a estabilidade da sua conexão com internet
- Confirme que seu PC não está entrando em modo de suspensão
- Certifique-se de que nenhum firewall está bloqueando o bot
- Verifique o status da API do Discord: https://discordstatus.com

---

### Quer mudar o prefixo dos comandos?

**Solução**:
1. Abra seu arquivo `.env`
2. Mude a linha PREFIX:
   ```
   PREFIX=?
   ```
   (Agora os comandos seriam `?play`, `?skip`, etc.)
3. Salve o arquivo e reinicie o bot

---

## 📝 Precisa de Mais Ajuda?

- Leia as mensagens de erro com atenção - elas geralmente dizem exatamente o que está errado!
- Verifique se todos os arquivos estão nos locais corretos
- Certifique-se de ter seguido todos os passos de configuração
- Tente reiniciar o bot após fazer mudanças
- Verifique suas configurações no Portal de Desenvolvedores do Discord

## 📜 Licença

Este projeto está licenciado sob a Licença MIT.

---

**Nota**: Este bot é para uso pessoal. Certifique-se de ter os direitos para tocar qualquer arquivo de música que usar com ele.
