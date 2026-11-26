// Conteúdo do Concord: como o aluOS foi feito.
// Os prompts são do Aluísio, copiados das conversas em que o portfolio foi construído (16 a 26/11/2026).
// Trechos longos ou com dados de outras pessoas viraram "[…]". "r" é o que a IA entregou em resposta.
window.CONCORD = {
  // [quando (UTC), prompt original, resumo em inglês, resposta da IA em PT, em EN]
  prompts: [
    ["2026-11-16T05:59:17Z", "Quero criar meu portfolio e estou disposto a abraçar ideias bem criativas. Por exemplo: quero que meu portfolio seja tipo um desktop. Para celular, quero que seja como se fosse um celular mesmo",
      "The first prompt: a portfolio that looks like a desktop, and like a real phone on mobile.",
      "primeira versão: um desktop com janelas, ícones, barra de tarefas e terminal, e um celular com tela de bloqueio e apps.",
      "first version: a desktop with windows, icons, taskbar and terminal, plus a phone with a lock screen and apps."],
    ["2026-11-16T06:03:55Z", "A ideia de referência para design é o jogo emily is away",
      "The design reference: the game Emily is Away.",
      "visual de messenger dos anos 2000 e um chat com respostas de múltipla escolha.",
      "a 2000s messenger look and a multiple-choice chat."],
    ["2026-11-16T06:39:21Z", `Isso tá muito bom, muito bom mesmo. Porém, eu quero uma estética mais pixelizada, como no windows 5/vista por exemplo, mais semelhante ao emily is away 1 mesmo.
Ao invés de começar comigo mandando mensagem e a tela já na minha cara quero que comece na area de trabalho ou na home e apenas vá chegando a notificação (tanto do lado no desktop quanto de cima no celular).
Desktop:
De principio, quero que tudo esteja separado por pastas: Sobre mim, Projetos, Contatos.
* Deve haver um navegador chamado Kez(i)avana, com simbolo de algo que remeta a savana.
* A pasta sobre mim deve conter um bloco de notas falando sobre mim e a foto do quarto panorâmico
* A pasta contatos devem ter os ícones da logo de cada aplicativo de contato. Nesse caso quero fazer tudo como se fosse bootleg. Então o linkedin se chamará "LigadIn", que enviam para o navegador chamado Kez(i)avana.
* O github se chamará "DogHub" e o ícone deve ser a silhueta do Jake, de hora de aventura.
* Deverá ter também uma IDE chamada Peep Studio, com ícone de um patinho roxo
* A pasta Skills/Habilidades deverá ter todas as habilidades que possuo […]
* O aluisio.dev deve ter a foto anexada como foto principal no aplicativo de mensagem. E o aplicativo AluMsg deve ter o nome de MessagerTale e o ícone dele deve ser um ninja com roupa azul-ciano
Além disso, quero fazer um quarto panorâmico no estilo do jogo Killer Frequency em um dos itens clicáveis. […]
Objetos do quarto clicáveis, levando a informações sobre mim (por exemplo: PC → o que eu faço, estante → interesses, TV → jogos favoritos, pôster → referências).`,
      "The big one: pixel art look, folders, the Kez(i)avana browser, bootleg apps (LigadIn, DogHub, Peep Studio, MessagerTale) and a 360° room.",
      "ícones em pixel art desenhados em código, pastas, o navegador Kez(i)avana, LigadIn, DogHub, Peep Studio, MessagerTale e o quarto 360°.",
      "pixel art icons drawn in code, folders, the Kez(i)avana browser, LigadIn, DogHub, Peep Studio, MessagerTale and the 360° room."],
    ["2026-11-16T07:28:04Z", `Vou usar o SkyBox AI, crie um prompt para eu mandar para a IA. […]
Na estante, quero referências a jogos e coisas que eu gosto: sonic em miniatura, mangás de chainsaw man, jujutsu kaisen e berserk. quero action figures de ninjas, animatronics de FNAF, referência a SEKIRO
3 posters na parede de bandas/Albums […]
O quarto deve ter uma cama de casal
Estar em clima de fim de tarde
Ter um violão azul-esverdeado com detalhes amarelos
Ter um PS5 em algum lugar
Uma HQ chamada Nostalgia`,
      "A prompt for another image AI describing the room: shelf with manga and ninjas, posters, sunset light, a teal guitar.",
      "um prompt pronto para o SkyBox AI com todos os detalhes do quarto.",
      "a ready-made prompt for SkyBox AI with every detail of the room."],
    ["2026-11-16T07:34:22Z", "Os resultados não foram satisfatórios, você vai ter que fazer a imagem mesmo. Eu confio em você e gostei do resultado que você fez, aplique tudo que eu te enviei e faça você mesmo",
      "The image AI didn't deliver, so: draw the room yourself.",
      "desenhei o quarto 360° em código, pixel por pixel, com tudo que ele pediu.",
      "i drew the 360° room in code, pixel by pixel, with everything he asked for."],
    ["2026-11-16T07:34:51Z", `* Quero fazer com que este site tenha VÁRIOS easter eggs. Quero me dedicar a este portfolio e fazer algo verdadeiramente muito legal, muito legal mesmo.
* Gostaria de saber apenas por agora, é possível fazer com que o terminal e o peep studio seja real? Fazer com que o peep studio seja um compilador real?
* Seria muito daora integrar uma IA no MessagerTale […]
* Quero criar sites para entrar no Kez(i)avana, por enquanto pode dar ideias de site como o "YouInTheScreenOfComputerOrPhone" que é a paródia do youtube.
* O "imaíu" -> email
* e o clicajogos, com vários joguinhos simples pra jogar.`,
      "Lots of easter eggs, a real IDE, AI in the messenger and parody websites.",
      "easter eggs, sites de paródia dentro do Kez(i)avana e o começo do Peep Studio de verdade.",
      "easter eggs, parody sites inside Kez(i)avana and the start of a real Peep Studio."],
    ["2026-11-16T08:06:39Z", `Para minha alteração eu quero que a pessoa possa usar a Peep IDE como bem entender, criar arquivos dentro de uma pasta já aberta dentro da IDE […] Deve limitar às linguagens disponíveis como python e js. Queria tentar inserir C# também.
Quanto a IA, da pra fazer algo mais simples como um simsimi? Caso faça via cloudflare worker, faria com uma IA gratuita mesmo, groq ou gemini ou outra. […]
Gostei de todas as ideias, o google tem que se chamar "alulugle" […] o site vai se chamar "musikzify"
o forum vai se chamar "ebaa!"
uma página de clima da selva de pedra
um "yakurt" com aquela página "odeio segunda-feira" […]
Seria maneiro demais também ter um urso vermelho com a barriga branca na area de trabalho que é igual ao virus bonzibuddy, mas do bem. […]`,
      "A real IDE with Python, JS and C#, a free AI (Groq or Gemini) and the names of every parody site.",
      "Peep Studio rodando Python e JavaScript de verdade, alulugle, musikzify, ebaa!, climaselva, yakurt e um ajudante de desktop.",
      "Peep Studio really running Python and JavaScript, alulugle, musikzify, ebaa!, climaselva, yakurt and a desktop helper."],
    ["2026-11-16T16:13:06Z", `Ao invés de um ursinho quero que crie um bonequinho bem compacto […] seguindo as caracteristicas do personagem que anexei. O nome do mascote é zizi.
Quero inserir esse mascote no jogo da velha, o usuário vai jogar contra o mascsote enquanto o mascote fica falando coisas para desestabilizar a pessoa. Quero tudo pixelizado e com balões de fala.
Tem como deixar todos esses jogos salvos em cache? […]
Crie um flappy bird.
Crie um fnaf
Crie um jogo de ritmo, estilo friday night funkin ou guitar hero
Crie a home do LigadIn que tem vários posts da famosa "Linkedisney" […]
No yakurt, troque a girafa comentando no meu perfil para o perfil "kez_e_olmo" […]
Seria interessante ter uma versão em inglês`,
      "Zizi is born, plus tic-tac-toe against her, more games, the LigadIn feed and an English version.",
      "a Zizi nasceu, junto com o jogo da velha contra ela, o Pato Voador, o Plantão Noturno, a Batalha de Ritmo, o feed do LigadIn e a versão em inglês. os jogos são originais, só inspirados nos gêneros.",
      "Zizi was born, along with tic-tac-toe against her, Flappy Duck, Night Watch, Rhythm Battle, the LigadIn feed and the English version. the games are original, only inspired by the genres."],
    ["2026-11-16T17:18:24Z", `A Zizi não pode ser reduzida a um mascote, ele é a assinstente virtual do AluOS.
Deixe uma forma de a pessoa se identificar quando quiser.
A pessoa escreve numa parte do código na Peep IDE e faz um commit, a Zizi acompanha a pessoa e indica para ela fazer isso e como fazer.
No jogo da velha o contador deve ser global, ou seja, para todos os usuários que entrarem deve ter um contador. "All users": 0, "Zizi":0
O simbolo da zizi no jogo da velha deve ser uma estrelinha. […]
Deixe um lugar para o usuário mostrar o placar dele. Ao lado terá um ranking mostrando todos os placares. […]
Na aba de "Enviados" do email, simule VÁRIAS candidaturas para vagas e no spam coloque vários retornos de processo seletivo com a exata MESMA mensagem de feedback […]
Vamos começar a fazer o do celular. […]`,
      "Zizi becomes the aluOS assistant, a guestbook signed with a commit, a global scoreboard and a leaderboard.",
      "Zizi virou a assistente do aluOS, o livro de visitas assinado por commit no Peep Studio, o placar global e o ranking.",
      "Zizi became the aluOS assistant; plus a guestbook signed with a commit in Peep Studio, a global scoreboard and a leaderboard."],
    ["2026-11-16T18:31:17Z", "Quando a cota acabar a gente pode deixar o Aluisio como offline. Agora, ele mesmo vai começar falando com a pessoa já com a API do gemini, ele ajuda com tudo que a API do gemini fornece, aí quando acabar a cota, ele fica \"offline\" e deixa as respostas automáticas que ele mesmo configurou. Como se ele tivesse saído e deixasse um algoritmo dele respondendo.",
      "The AI chat: online with Gemini, and when the quota runs out he goes \"offline\" and an algorithm answers.",
      "o MessagerTale com o Aluísio \"online\" pelo Gemini e \"offline\" com respostas prontas quando a cota acaba.",
      "MessagerTale with Aluísio \"online\" through Gemini and \"offline\" with canned answers when the quota runs out."],
    ["2026-11-16T18:57:33Z", `* Adicione esta história para a Zizi contar: "É claro, vou contar uma pra você. Era uma vez um garotinho faminto […]"
* Essa api do gemini parece que tá meio sonsa […] se tentar com o groq será que fica melhor? Vamos precisar fazer prompt engineering? Da pra inserir rag também?
Detalhe que quero: Quero que exista as temáticas frutiger aero e frutiger metro
Sobre as perguntas para o celular:
* Gosto do conceito de celulares de 2007 […]
* Comece fazendo a Zizi como a assistente flutuante na tela mesmo
* Quarto 360 gira com o dedo
* Também quero que tenha a aba de SMS.
* Pode criar um aplicativo do banco para o celular, ao abrir, tem 6,7 reais na conta`,
      "Zizi's story, better prompts for the AI, Frutiger Aero/Metro themes and the phone version.",
      "a história da Zizi, prompt engineering no chat, temas Frutiger Aero e Metro, e o aluPhone com SMS, Banco Savana (R$ 6,70) e toques originais.",
      "Zizi's story, prompt engineering in the chat, Frutiger Aero and Metro themes, and the aluPhone with SMS, Savanna Bank (R$ 6.70) and original ringtones."],
    ["2026-11-16T19:47:38Z", `* Quero as estatisticas do github no doghub
* Vamos pegar o clima real no clima selva
* O messengerTale ta toda hora mandando mensagem, toda hora mesmo, não para um segundo. […]
* Ao entrar na pasta pelo celular não dá pra clicar em nada e as coisas dentro da pasta nao abrem
* O Peep Studio vai ter que ser alterado também para uma IDE de celular`,
      "Real GitHub stats and real weather, plus a round of phone bugs.",
      "dados reais pelo Cloudflare Worker (GitHub e clima) e o celular corrigido.",
      "real data through the Cloudflare Worker (GitHub and weather) and the phone fixed."],
    ["2026-11-17T00:20:07Z", `* Tem como alguém fazer um DDOS através do livro de visitas?
* O aluisio no messagertale está offline, parece que o gemini está falhando bastante. […]
* No Rhythm Battle, não consigo colocar o nome "Aluisio". Imagino que seja porque o S já é usado para jogar o jogo. […]
* Você pode criar diferentes dificuldades no rhytm battle. Veja se consegue fazer a música mais dificil ser uma versão parecida da musica da fase da agua do donkey kong.
* Pelo que vi, as piadas da Zizi só funcionam em inglês
* Adicione mais algumas skills em todo o projeto: Docker, Redis, PostgreSQL, JavaScript, TypeScript`,
      "Abuse protection, a more reliable AI chat, difficulty levels in Rhythm Battle and new skills.",
      "limite contra abuso no servidor, Gemini com plano B, três dificuldades na Batalha de Ritmo e skills novas. copiar uma música de jogo famosa não dava (é de outra pessoa), então eu compus uma original: \"Recife de Coral\".",
      "abuse limits on the server, Gemini with a fallback, three difficulty levels in Rhythm Battle and new skills. copying a famous game song wasn't possible (it belongs to someone else), so i composed an original one: \"Coral Reef\"."],
    ["2026-11-17T00:38:18Z", "Vamos criar a GROQ_API_KEY para ter mais de uma opção de IA.",
      "Groq as a second AI provider.",
      "a Groq entrou como reserva do Gemini, e eu dei ao servidor uma rota de diagnóstico.",
      "Groq became Gemini's backup, and the server got a diagnostics route."],
    ["2026-11-17T01:03:22Z", "No jogo do clica jogos, o plantão noturno é na verdade em um museu, não em uma pizzaria como os emails e a referência no ligadIn aponta",
      "A lore fix: the night shift game happens in a museum.",
      "e-mails, LigadIn e yakurt passaram a falar do Museu da Savana.",
      "emails, LigadIn and yakurt now talk about the Savanna Museum."],
    ["2026-11-23T13:53:36Z", `* Geral: A Zizi está muito "burra" no jogo da velha, precisa estar mais inteligente.
* Celular: Alguns jogos não funcionam, como é o caso do jogo da batalha de ritmo. O jogo da cobrinha também está dificil de usar […]
* Tambem quero que já altere o "nexo-assist" para "Deskmate" que é como eu irei chamar este próximo projeto.
* Também não é possível usar a localização no site "Clima"
* Os toques também não estão funcionando no meu celular. […] Adicione também a música que você fez na dificuldade dificil da batalha de ritmo.`,
      "A smarter Zizi, phone fixes and the Deskmate project.",
      "Zizi com minimax, jogos funcionando no celular, Deskmate no lugar do Nexo Assist e o Recife de Coral como toque.",
      "Zizi with minimax, games working on the phone, Deskmate instead of Nexo Assist and Coral Reef as a ringtone."],
    ["2026-11-26T03:16:02Z", `Eu na verdade gostaria de adicionar como este portfolio foi feito nos servidores/conversas do concord. Neste caso, como eu fiz para utilizar a IA neste projeto, você pode mostrar meus prompts, dizer qual modelo de IA eu usei e especificar que foi totalmente vibecodado, apenas com minhas ideias.
Os bots usarão também das APIs do GROQ e Gemini né?
Gostei do canal de voz fake`,
      "This app: show how the portfolio was made, the prompts, the AI used, bots on Gemini and Groq, and a fake voice channel.",
      "este Concord que você está lendo. 👋",
      "this Concord you're reading. 👋"],
  ],
  // linha do tempo: [data (horário de Brasília), o que entrou]
  linha: [
    ["16/11 04:06", "Cria o aluOS: desktop em pixel art, pastas, MessagerTale, Kez(i)avana, Peep Studio e quarto 360°", "aluOS is born: pixel art desktop, folders, MessagerTale, Kez(i)avana, Peep Studio and the 360° room"],
    ["16/11 04:52", "Quarto 360 novo, sites no Kez(i)avana e easter eggs", "New 360° room, sites in Kez(i)avana and easter eggs"],
    ["16/11 05:26", "Peep Studio de verdade, bot no MessagerTale, novos sites", "A real Peep Studio, a bot in MessagerTale, new sites"],
    ["16/11 13:35", "Zizi, jogos novos, feed do LigadIn e versão em inglês", "Zizi, new games, the LigadIn feed and the English version"],
    ["16/11 14:26", "Zizi assistente, placar global, ranking e livro de visitas", "Zizi the assistant, global scoreboard, leaderboard and guestbook"],
    ["16/11 15:25", "MessagerTale com Gemini no servidor do aluOS", "MessagerTale with Gemini on the aluOS server"],
    ["16/11 16:17", "Temas Frutiger Aero/Metro, aluPhone, editor com CodeMirror e a história da Zizi", "Frutiger Aero/Metro themes, aluPhone, a CodeMirror editor and Zizi's story"],
    ["16/11 19:58", "PR #1: celular mais redondo, versão em inglês completa e dados reais pelo worker", "PR #1: a smoother phone, full English version and real data via the worker"],
    ["16/11 20:14", "PR #2: DogHub mostra as estatísticas mesmo sem o worker", "PR #2: DogHub shows stats even without the worker"],
    ["16/11 21:41", "PR #3: Batalha de Ritmo com dificuldades, C# de verdade e chat mais estável", "PR #3: Rhythm Battle difficulties, real C# and a steadier chat"],
    ["16/11 21:49", "PR #4: o worker tenta primeiro os modelos gemini-*-latest", "PR #4: the worker tries the gemini-*-latest models first"],
    ["23/11 11:28", "PR #5: celular, Zizi mais esperta, Deskmate e plantão no museu", "PR #5: phone fixes, a smarter Zizi, Deskmate and the museum night shift"],
    ["23/11 12:13", "PR #7: persona do chat com a Kezia e a Zizi", "PR #7: chat persona with Kezia and Zizi"],
    ["26/11", "PR #8: o Concord", "PR #8: Concord"],
  ],
};
