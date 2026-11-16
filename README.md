# aluOS — portfolio do Aluísio

Portfolio em forma de sistema operacional em pixel art, no clima dos desktops de 2004–2007
e de jogos como *Emily is Away* e *Killer Frequency*.

## O que tem no desktop

- **Pastas:** Sobre mim, Projetos, Contatos e Skills, abertas num explorador de arquivos.
- **Sobre mim:** `sobre_mim.txt` (bloco de notas) e `quarto_360.png`, um quarto panorâmico 360° com objetos clicáveis.
- **MessagerTale:** messenger que começa com notificações no canto da tela. O visitante escolhe as respostas,
  a frase é "digitada" (qualquer tecla acelera) e o `aluisio.dev` responde.
- **Kez(i)avana:** navegador da savana, com as páginas *bootleg* LigadIn e DogHub (os botões "Sair da savana" levam aos perfis reais), o buscador Alulugle (página inicial), o YouInTheScreenOfComputerOrPhone, o e-mail imaíu, o clicajogos (Cobrinha, Jogo da velha, Pato Clicker e Memória), o musikzify (playlist com prévia pelo player do Spotify), o fórum ebaa!, o Clima da Selva de Pedra (dados reais do Open-Meteo), a rede social yakurt e a Kezpédia.
- **Peep Studio:** IDE de verdade. Na pasta `meus-codigos` dá pra criar arquivos `.py`, `.js` e `.cs` e executar no navegador: Python pelo Pyodide (em `js/vendor/pyodide`, código aberto), JavaScript num Web Worker e C# pela API do Piston, com um "C# de bolso" (tradução para JavaScript) quando o servidor não responde.
- **MessagerTale:** além do roteiro, tem conversa livre com um bot no estilo SimSimi, que aprende frases (`ensina: frase = resposta`). Para usar uma IA de verdade, publique `worker/chat-worker.js` no Cloudflare e coloque a URL em `ALU.CONFIG.chatApi`.
- **Bonzinho:** o urso vermelho que mora na área de trabalho, dá dicas e conta piadas.
- **Segredos:** 22 conquistas escondidas pelo sistema. O Painel de controle mostra quantas você já achou.
- **Peep Studio:** IDE do patinho roxo, com `Aluisio.cs` e um README de cada projeto. O botão ▶ Executar "roda" o código.
- **Terminal**, **Painel de controle** (papel de parede e cor das janelas) e **Lixeira**.

Feito só com HTML, CSS e JavaScript, sem build. O quarto 360° usa three.js r128 (em `js/vendor`, licença MIT).

## Editar o conteúdo

Tudo fica em [`js/data.js`](js/data.js): perfil, contatos, skills, certificações, projetos e os pontos clicáveis do quarto.
Os campos com `TODO` ainda precisam do seu texto.

### Trocar a imagem do quarto

Coloque uma imagem equirretangular (proporção 2:1, por exemplo 4096×2048) em `img/` e aponte `QUARTO.imagem` para ela.
Cada ponto clicável tem `u` e `v` de 0 a 1: a posição do objeto na imagem dividida pela largura e pela altura.
A imagem atual foi gerada por código como placeholder.

## Rodar no computador

```bash
python3 -m http.server 8000   # ou: npx serve .
```

Abra http://localhost:8000.

## Arquivos

```
index.html        estrutura e boot
css/style.css     visual pixel art
img/              foto, papéis de parede e quarto 360°
js/data.js        conteúdo  <- EDITE
js/pixel.js       ícones em pixel art, desenhados em código
js/apps.js        registro de apps, pastas, bloco de notas, propriedades
js/chat.js        MessagerTale: roteiro da conversa e sons
js/kez.js         navegador Kez(i)avana e suas páginas
js/sites.js       sites do Kez(i)avana (vídeos, e-mail, jogos)
js/jogos.js       joguinhos do clicajogos
js/eggs.js        easter eggs e conquistas
js/sites2.js      alulugle, musikzify, ebaa!, clima, yakurt e Kezpédia
js/bot.js         bot do MessagerTale
js/buddy.js       Bonzinho, o urso
js/peep*.js       Peep Studio, o executor (worker) e o C# de bolso
worker/           Cloudflare Worker opcional para a IA do chat
js/peep.js        IDE Peep Studio
js/quarto.js      visualizador 360°
js/terminal.js    terminal
js/desktop.js     janelas, barra de tarefas, menu iniciar, notificações
js/mobile.js      modo celular (em pausa por enquanto)
js/main.js        estado, papéis de parede, boot
```
