#!/usr/bin/env python3
"""Gera o relatório de auditoria de segurança do aluOS em PDF.

Uso (sem instalar nada globalmente):
    python3 -m venv .venv-audit
    .venv-audit/bin/pip install reportlab matplotlib
    .venv-audit/bin/python docs/security-audit/gerar_relatorio.py

Saídas (nesta pasta):
    relatorio-auditoria-seguranca.pdf   o relatório
    issues-github.md                    as mesmas issues do fim do PDF, prontas para colar

Os trechos de código são lidos do commit auditado (AUDIT_COMMIT) pelo git, então o relatório
continua fiel ao código que foi auditado mesmo depois das correções. Se o commit não existir
no clone, o script lê os arquivos atuais e avisa.
"""
import io
import os
import subprocess
import sys
import textwrap
from datetime import date

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from reportlab.lib import colors  # noqa: E402
from reportlab.lib.enums import TA_CENTER  # noqa: E402
from reportlab.lib.pagesizes import A4  # noqa: E402
from reportlab.lib.styles import ParagraphStyle  # noqa: E402
from reportlab.lib.units import cm  # noqa: E402
from reportlab.pdfbase import pdfmetrics  # noqa: E402
from reportlab.pdfbase.ttfonts import TTFont  # noqa: E402
from reportlab.platypus import (  # noqa: E402
    CondPageBreak, Image, KeepTogether, PageBreak, Paragraph, Preformatted,
    SimpleDocTemplate, Spacer, Table, TableStyle,
)

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(AQUI, "..", ".."))
SAIDA_PDF = os.path.join(AQUI, "relatorio-auditoria-seguranca.pdf")
SAIDA_MD = os.path.join(AQUI, "issues-github.md")
PROJETO = "aluOS (aluisiodev.github.io)"
TITULO = f"Relatório de Auditoria de Segurança — {PROJETO}"
AUDIT_COMMIT = "ff63291"  # main em 17/11/2026 (merge do PR #4)
DATA_AUDITORIA = date(2026, 11, 17)

# ---------------------------------------------------------------- paleta
COR = {
    "crítica": "#B91C1C", "alta": "#EA580C", "média": "#D97706",
    "baixa": "#2563EB", "informativa": "#6B7280", "ponto forte": "#059669",
}
ORDEM_SEV = ["crítica", "alta", "média", "baixa", "informativa"]
TINTA, SUAVE, LINHA, FUNDO = "#111827", "#4B5563", "#E5E7EB", "#F9FAFB"

# ---------------------------------------------------------------- fontes
FONTES = "/usr/share/fonts/truetype/dejavu/"
try:
    pdfmetrics.registerFont(TTFont("Sans", FONTES + "DejaVuSans.ttf"))
    pdfmetrics.registerFont(TTFont("Sans-B", FONTES + "DejaVuSans-Bold.ttf"))
    pdfmetrics.registerFont(TTFont("Mono", FONTES + "DejaVuSansMono.ttf"))
    from reportlab.pdfbase.pdfmetrics import registerFontFamily
    registerFontFamily("Sans", normal="Sans", bold="Sans-B", italic="Sans", boldItalic="Sans-B")
    SANS, SANS_B, MONO = "Sans", "Sans-B", "Mono"
except Exception:  # sem DejaVu: usa as fontes padrão do PDF
    SANS, SANS_B, MONO = "Helvetica", "Helvetica-Bold", "Courier"

# ---------------------------------------------------------------- categorias
CATS = {
    "C1": "Banco sem tranca (isolamento)",
    "C2": "Permissão definida no navegador",
    "C3": "IDOR",
    "C4": "Chaves expostas e defaults",
    "C5": "Inputs sem tratamento (XSS)",
    "C6": "Abuso e limites (DoS)",
}

METODOLOGIA = [
    ("C1", "Não há usuários, login, tenants nem banco relacional: o estado global fica em um namespace Cloudflare KV "
           "com chaves fixas (placar:velha, ranking:&lt;jogo&gt;, visitas, musicas:&lt;id&gt;, conhecimento). RLS e middleware "
           "de tenant <b>não se aplicam</b>. O único dado privado do dono é a lista do livro de visitas; o mecanismo "
           "de isolamento é a checagem de CHAVE_ADMIN no Worker. Auditado: se alguma rota devolve esse dado sem a chave."),
    ("C2", "O frontend não tem papéis, login nem tela de admin (busca por admin/isAdmin/role/canEdit sem resultado). "
           "O equivalente são as rotas administrativas do Worker (GET /visitas e /diagnostico): conferido se o "
           "servidor valida o privilégio e quão forte é essa validação."),
    ("C3", "Sem objetos por dono. Foram percorridos os 10 handlers do Worker (todas as rotas, não amostras) "
           "procurando parâmetros que escolhem um objeto (jogo, nome, id da playlist, lat/lon)."),
    ("C4", "Varredura do código, README, comentários de deploy e de todo o histórico git (21 commits, todas as "
           "branches, incluindo o arquivo apagado worker/chat-worker.js) por chaves, tokens e padrões AIza/gsk_/ghp_/sk-. "
           "Não há Docker, CI, Helm, Terraform nem wrangler.toml: o deploy é colar o arquivo no painel da Cloudflare. "
           "O equivalente a ${VAR:-default} são os fallbacks env.X || \"valor\" do Worker."),
    ("C5", "Frontend em JavaScript puro, sem framework e sem build: todos os innerHTML, insertAdjacentHTML, "
           "new Function e atribuições de href/src (96 ocorrências) foram rastreados até a origem do dado. "
           "Não há lib de sanitização; o projeto usa um escape próprio (ALU.esc). No backend, conferido se "
           "alguma resposta sai como HTML."),
    ("C6", "Categoria extra pedida no projeto (\"dá pra fazer DDoS no livro de visitas?\"): limites de taxa, "
           "custo por requisição, cotas do plano grátis (KV: 1.000 gravações/dia; Workers: 100 mil requisições/dia) "
           "e rotas que funcionam como proxy aberto."),
]

# ---------------------------------------------------------------- achados
# cada trecho: (arquivo, linha_inicial, linha_final)
ACHADOS = [
    {
        "id": "A1", "sev": "alta", "cat": "C6",
        "titulo": "Esgotar a cota diária de gravações do KV derruba livro de visitas, placar e ranking",
        "local": [("worker/aluos-worker.js", 95, 102), ("worker/aluos-worker.js", 176, 181),
                  ("worker/aluos-worker.js", 189, 189), ("worker/aluos-worker.js", 204, 204),
                  ("worker/aluos-worker.js", 312, 312), ("worker/aluos-worker.js", 341, 341)],
        "linhas": "worker/aluos-worker.js:95-102, 176-181, 189, 204, 221, 312, 341",
        "desc": "O único freio é um contador em memória (Map BALDES), separado por isolate e por data center, e só vale "
                "para POST. Cada POST em /placar e /ranking grava no KV (20 por minuto por IP por isolate), e "
                "GET /musicas?atualizar ignora o cache, consulta o Spotify e grava no KV sem limite nenhum, porque GET "
                "não passa pelo limitador. O KV grátis aceita 1.000 gravações por dia na conta toda.",
        "explora": "Um único IP com um laço de ~1.000 requisições a /musicas?atualizar (ou ~50 minutos de POST em /placar) "
                   "esgota a cota. A partir daí db.put falha, a exceção não é tratada e as rotas que gravam respondem "
                   "erro 500 até a virada do dia em UTC. Isso responde à pergunta do DDoS: sim, um visitante sozinho tira "
                   "o livro de visitas do ar pelo resto do dia, sem precisar de botnet.",
        "condicao": "Plano Workers/KV grátis (o padrão do passo a passo). No plano pago vira custo em vez de queda.",
    },
    {
        "id": "A2", "sev": "média", "cat": "C6",
        "titulo": "Livro de visitas lota com ~34 IPs: teto global de 100 assinaturas por dia",
        "local": [("worker/aluos-worker.js", 214, 217)],
        "linhas": "worker/aluos-worker.js:214-217",
        "desc": "Cada IP (hash) assina até 3 vezes por dia e o livro aceita 100 assinaturas por dia no total. Não há "
                "captcha nem prova de trabalho.",
        "explora": "Com 34 IPs (proxies, VPN ou um bloco IPv6, que é barato) alguém preenche as 100 vagas logo depois da "
                   "meia-noite UTC e todo visitante real recebe \"o livro de visitas encheu hoje\" (429). As 100 entradas "
                   "falsas também empurram as reais para fora do limite de 1.000 guardadas.",
        "condicao": "Nenhuma: funciona com a configuração padrão.",
    },
    {
        "id": "A3", "sev": "média", "cat": "C6",
        "titulo": "Chat com IA: cota do Gemini/Groq esgotável e persona controlável por histórico forjado",
        "local": [("worker/aluos-worker.js", 179, 180), ("worker/aluos-worker.js", 231, 232),
                  ("worker/aluos-worker.js", 237, 238)],
        "linhas": "worker/aluos-worker.js:179-180, 231-232, 237-238",
        "desc": "POST /chat aceita qualquer cliente (12 por minuto por IP por isolate) e repassa até 350 tokens de saída "
                "por chamada às chaves do Aluísio. O cliente manda o histórico: qualquer entrada cujo de não seja "
                "\"visitante\" vira fala do modelo (linha 232), então dá para inventar respostas anteriores do "
                "\"Aluísio IA\". A base \"conhecimento\" inteira (até 12 mil caracteres) vai no prompt de sistema.",
        "explora": "(1) Um script com rotação de IP esgota a cota diária grátis e o chat cai para o modo offline para todo "
                   "mundo. (2) Com falas falsas do modelo no histórico, é fácil levar a IA, que fala em primeira pessoa como "
                   "o Aluísio, a dizer algo ofensivo e tirar print. (3) Pedindo para repetir as instruções, a IA tende a "
                   "revelar o texto da base de conhecimento.",
        "condicao": "Custo em dinheiro só se o projeto do Google/Groq tiver faturamento ligado. O vazamento (3) só importa se "
                    "a base tiver algo que não deveria ser público.",
    },
    {
        "id": "A4", "sev": "média", "cat": "C4",
        "titulo": "ORIGEM ausente vira \"*\": CORS aberto e checagem de origem desligada",
        "local": [("worker/aluos-worker.js", 160, 162), ("worker/aluos-worker.js", 178, 178)],
        "linhas": "worker/aluos-worker.js:160-162, 178",
        "desc": "Se a variável ORIGEM não for criada, o padrão é \"*\": qualquer site recebe CORS liberado e a checagem "
                "de Origin dos POSTs é pulada. Mesmo configurada, a linha 178 só barra quando o cabeçalho Origin "
                "existe, então curl e scripts sem Origin passam (o comentário da linha 172 já admite isso).",
        "explora": "Com o padrão, qualquer página de terceiros pode usar o navegador dos próprios visitantes para gastar a cota "
                   "do chat e gravar no KV (acelerando A1), com IPs reais e variados que o limitador por IP não segura.",
        "condicao": "Só com ORIGEM ausente ou \"*\". Não foi possível confirmar o valor em produção: a auditoria é estática e "
                    "a rede do ambiente bloqueou o acesso ao Worker publicado.",
    },
    {
        "id": "A5", "sev": "média", "cat": "C2",
        "titulo": "CHAVE_ADMIN viaja na URL e pode ser testada sem limite",
        "local": [("worker/aluos-worker.js", 224, 225), ("worker/aluos-worker.js", 259, 259),
                  ("worker/aluos-worker.js", 177, 177)],
        "linhas": "worker/aluos-worker.js:177, 224-225, 259; README.md (instrução ?chave=)",
        "desc": "As rotas de admin validam a chave no servidor (bom), mas ela vai em ?chave= na URL, que fica no "
                "histórico do navegador, nos logs da Cloudflare e em qualquer print ou link compartilhado. O limitador só "
                "roda para POST, então GET /visitas aceita tentativas ilimitadas, e a comparação com !== não é de tempo "
                "constante.",
        "explora": "Com uma senha curta ou de dicionário, força bruta em GET /visitas revela nome, contato e recado de todos "
                   "que assinaram (dado pessoal). A chave também é o sal do hash de IP (A6), então vazá-la enfraquece os dois.",
        "condicao": "Depende da força da CHAVE_ADMIN escolhida. Com 32+ caracteres aleatórios a força bruta é inviável e sobra "
                    "o risco do vazamento pela URL.",
    },
    {
        "id": "A6", "sev": "baixa", "cat": "C4",
        "titulo": "Sal padrão público \"aluos\" no hash de IP quando CHAVE_ADMIN não existe",
        "local": [("worker/aluos-worker.js", 104, 107)],
        "linhas": "worker/aluos-worker.js:104-107",
        "desc": "O hash que identifica o visitante usa CHAVE_ADMIN como sal e cai para o texto fixo \"aluos\", que está no "
                "código público. São só 6 bytes de SHA-256.",
        "explora": "Sem CHAVE_ADMIN, quem obtiver o KV (ou um backup dele) reverte o campo quem para o IP calculando o hash dos "
                   "~4 bilhões de IPv4 em minutos. Trocar a CHAVE_ADMIN também zera o limite de 3 assinaturas por IP do dia.",
        "condicao": "Só sem CHAVE_ADMIN e com acesso ao conteúdo do KV; o campo quem não é devolvido pela API (linha 225).",
    },
    {
        "id": "A7", "sev": "baixa", "cat": "C3",
        "titulo": "Ranking e placar sem dono: qualquer um publica com o nome de outra pessoa",
        "local": [("worker/aluos-worker.js", 186, 189), ("worker/aluos-worker.js", 199, 202)],
        "linhas": "worker/aluos-worker.js:186-189, 199-202",
        "desc": "A entrada do ranking é identificada só pelo nome (sem diferenciar maiúsculas). Não há vínculo com quem a "
                "criou, e os pontos são o que o cliente mandar, até 1.000.000. O placar global soma +1 para quem o "
                "cliente disser que venceu.",
        "explora": "Um POST {\"jogo\":\"ritmo\",\"nome\":\"<nome de alguém>\",\"pontos\":1000000} assume a entrada daquela pessoa e "
                   "ocupa o topo; um laço infla o placar \"All users × Zizi\". É o equivalente a IDOR desta stack: o objeto "
                   "(entrada do ranking) é escolhido por um identificador que qualquer um pode citar.",
        "condicao": "Nenhuma. Impacto só de integridade do jogo.",
    },
    {
        "id": "A8", "sev": "baixa", "cat": "C6",
        "titulo": "/csharp e /clima funcionam como proxy aberto para Wandbox e Open-Meteo",
        "local": [("worker/aluos-worker.js", 246, 252), ("worker/aluos-worker.js", 298, 302)],
        "linhas": "worker/aluos-worker.js:246-252, 298-302",
        "desc": "/csharp repassa até 20 KB de código para compilar no Wandbox com o IP do Worker (6 por minuto por isolate). "
                "/clima é GET, então não tem limite; a chave de cache usa 2 casas decimais, mas a busca usa o valor "
                "cru, e variar lat/lon fura o cache.",
        "explora": "Abuso do Wandbox atribuído ao Worker pode levar a bloqueio do IP da Cloudflare e o C# do Peep Studio para de "
                   "funcionar. Um laço em /clima consome as 100 mil requisições diárias do Worker e a cota do Open-Meteo.",
        "condicao": "Nenhuma.",
    },
    {
        "id": "A9", "sev": "baixa", "cat": "C6",
        "titulo": "Ler, alterar e gravar no KV sem trava perde dados e fura os limites",
        "local": [("worker/aluos-worker.js", 214, 221)],
        "linhas": "worker/aluos-worker.js:185-189, 197-204, 214-221",
        "desc": "Placar, ranking e livro de visitas leem a lista inteira, mudam na memória e gravam de volta. KV não tem "
                "transação e é eventualmente consistente (até ~60 s entre data centers).",
        "explora": "Duas assinaturas simultâneas fazem a segunda apagar a primeira; requisições paralelas contornam o limite de "
                   "3 por IP e o teto de 100 por dia, porque todas leem a mesma lista antiga.",
        "condicao": "Requisições concorrentes; acontece até sem má intenção quando o tráfego sobe.",
    },
    {
        "id": "A10", "sev": "informativa", "cat": "C5",
        "titulo": "Sem Content-Security-Policy e script de terceiro sem SRI",
        "local": [("index.html", 10, 12), ("js/servidor.js", 55, 58)],
        "linhas": "index.html:1-46; js/servidor.js:55-58",
        "desc": "A página não declara CSP e carrega https://gc.zgo.at/count.js dinamicamente, sem integrity. Não há XSS "
                "conhecido hoje (ver pontos fortes), então é defesa em profundidade.",
        "explora": "Se um dia algum innerHTML esquecer o esc(), nada limita o que o script injetado faz. Se o CDN do GoatCounter "
                   "for comprometido, o script roda com acesso total à página.",
        "condicao": "Depende de uma segunda falha.",
    },
    {
        "id": "A11", "sev": "informativa", "cat": "C1",
        "titulo": "Nome de quem assina o livro de visitas vai para o GoatCounter",
        "local": [("js/servidor.js", 37, 42)],
        "linhas": "js/servidor.js:41",
        "desc": "Ao assinar, o nome digitado (até 40 caracteres) vira o caminho de um evento no GoatCounter.",
        "explora": "Se o painel do GoatCounter estiver público, os nomes ficam visíveis para qualquer um, fora do isolamento que "
                   "a CHAVE_ADMIN dá ao livro no Worker.",
        "condicao": "Só com o painel do GoatCounter público.",
    },
    {
        "id": "A12", "sev": "informativa", "cat": "C6",
        "titulo": "Corpo JSON null derruba a requisição com exceção não tratada",
        "local": [("worker/aluos-worker.js", 166, 166), ("worker/aluos-worker.js", 187, 187)],
        "linhas": "worker/aluos-worker.js:166, 187, 196, 199, 212, 230",
        "desc": "req.json() de um corpo \"null\" devolve null sem cair no catch; em seguida corpo.vencedor, corpo.nome ou "
                "corpo.mensagem lançam TypeError e o Worker responde erro 1101.",
        "explora": "Só gera erro para quem manda; não vaza dado. Polui logs e métricas de erro.",
        "condicao": "Nenhuma.",
    },
]

PONTOS_FORTES = [
    ("C4", "Nenhum segredo no código nem no histórico",
     "Varridos os 21 commits de todas as branches, inclusive o arquivo apagado worker/chat-worker.js. Gemini, Groq, "
     "Spotify, GitHub e CHAVE_ADMIN só existem como env.* (worker/aluos-worker.js:15-28, 114-123, 146, 268, 316). "
     "A chave do Gemini vai no cabeçalho x-goog-api-key, não na URL (linha 123). js/data.js:181-186 só tem a URL "
     "pública do Worker e o código público do GoatCounter."),
    ("C1", "Livro de visitas fechado para leitura e fail-closed",
     "GET /visitas exige CHAVE_ADMIN e nega quando ela não existe (linha 224: !env.CHAVE_ADMIN || ...). O campo quem "
     "(hash do IP) é removido da resposta (linha 225). Nenhuma outra rota lê a chave visitas do KV."),
    ("C2", "Privilégio validado no servidor, não no navegador",
     "Não há UI de admin nem flag de papel no frontend. As duas rotas privilegiadas (/visitas GET e /diagnostico) "
     "checam a chave no Worker (linhas 224 e 259), e /diagnostico só devolve booleanos sobre as chaves, nunca os "
     "valores (linha 261)."),
    ("C3", "Todas as rotas usam whitelist ou valor do servidor para escolher o objeto",
     "Os 10 handlers foram revisados: vencedor e jogo passam por whitelist (linhas 187, 196), pontos são truncados "
     "(199), lat/lon validados (300), id da playlist e usuário do GitHub vêm de env (266, 310), então a consulta "
     "GraphQL da linha 286 não recebe entrada do visitante."),
    ("C5", "Escape central aplicado em todos os pontos com dado externo",
     "ALU.esc (js/apps.js:5) troca & < > \" '. Conferidos: ranking global (js/jogos2.js:35), estatísticas do GitHub "
     "(js/kez.js:96-103), playlist do Spotify (js/sites2.js:165), respostas da IA (js/chat.js:138, js/mobile.js:113), "
     "URL da página 404 (js/kez.js:163), busca do Alulugle (js/sites2.js:113-115), eco do terminal "
     "(js/terminal.js:82-86), nome na Zizi (js/buddy.js:167) e o realce de sintaxe, que escapa antes de colorir "
     "(js/peep.js:157-172). Títulos vão por textContent (js/kez.js:166)."),
    ("C5", "Sem vetor de XSS refletido",
     "O site não lê location.hash, location.search nem postMessage para montar páginas; o endereço kez:// só vem "
     "do que o visitante digita na própria aba. Os new Function de js/peep-worker.js:27 e 47 executam o código "
     "do próprio visitante dentro de um Web Worker, sem DOM, por design."),
    ("C5", "Respostas do Worker são sempre JSON",
     "Toda resposta sai com Content-Type application/json (linha 163), e limpa() remove < > e caracteres de "
     "controle e corta o tamanho de tudo que é gravado (linhas 93, 199, 212, 230-232)."),
    ("C6", "Já existe uma primeira camada contra spam",
     "Limite por IP nos POSTs (linhas 176-181), 3 assinaturas por IP por dia (216), listas com tamanho máximo "
     "(ranking 50, livro 1.000: linhas 203 e 221), cache de 1 hora para GitHub e 10 min para clima e playlist, "
     "e o IP nunca é guardado em claro (104-107). CF-Connecting-IP não pode ser forjado pelo cliente."),
    ("C4", "Bibliotecas servidas localmente e token do GitHub sem permissões",
     "three.js, CodeMirror e Pyodide estão em js/vendor (sem CDN de terceiros); o passo a passo pede um token "
     "fine-grained sem nenhuma permissão extra (linhas 27-28). Links externos usam rel=\"noopener\"."),
]

FRACOS = [
    "<b>Disponibilidade é o elo fraco.</b> O limitador em memória não é compartilhado entre servidores e ignora GET, e o "
    "plano grátis tem tetos diários baixos (1.000 gravações no KV). Um visitante sozinho tira do ar livro de visitas, "
    "placar e ranking pelo resto do dia (A1, A2, A9).",
    "<b>A IA fala em nome do Aluísio e aceita histórico do cliente.</b> Isso abre risco de reputação e de gasto de cota (A3).",
    "<b>A segurança depende de duas variáveis configuradas à mão no painel.</b> Sem ORIGEM o CORS fica aberto e sem "
    "CHAVE_ADMIN forte a lista de visitantes fica exposta à força bruta (A4, A5, A6). Como não há wrangler.toml no repo, "
    "nada garante que estejam certas.",
    "<b>Pontuações são o que o cliente disser.</b> Normal em jogo de navegador, mas o ranking global aceita "
    "impersonação (A7).",
]

RECOMENDACOES = [
    ("P1", "Limite de taxa de verdade e proteção da cota do KV (A1, A2, A9)",
     "Usar o Rate Limiting binding dos Workers (ou um Durable Object contador) em todas as rotas, inclusive GET. "
     "Tirar ?atualizar do público (exigir CHAVE_ADMIN). Mover livro de visitas e ranking para D1 (grátis: 100 mil "
     "gravações/dia, com transação), o que também acaba com a perda de dados. Colocar Cloudflare Turnstile no envio do "
     "livro de visitas e trocar o teto global de 100 por dia por um teto por IP + Turnstile."),
    ("P1", "Configuração segura por padrão (A4)",
     "Trocar o fallback de ORIGEM de \"*\" para \"https://aluisiodev.github.io\" e recusar POST sem Origin quando ORIGEM "
     "estiver definida. Conferir no painel que ORIGEM e CHAVE_ADMIN existem."),
    ("P2", "Chave de admin fora da URL (A5, A6)",
     "Aceitar a chave por cabeçalho (Authorization: Bearer), comparar em tempo constante, limitar tentativas erradas "
     "por IP e usar 32+ caracteres aleatórios. Separar o sal do hash de IP em um segredo próprio (IP_SAL) sem default."),
    ("P2", "Chat com teto e histórico confiável (A3)",
     "Contador diário global de chamadas à IA, Turnstile ou token de sessão antes de liberar o chat, aceitar no "
     "histórico só turnos do visitante (ou assinar as respostas do servidor com HMAC) e não colocar nada privado na "
     "base de conhecimento. Deixar o faturamento desligado (ou com limite) nos projetos Gemini/Groq."),
    ("P3", "Integridade do ranking e proxies (A7, A8)",
     "Vincular o nome ao hash do IP que o criou, limitar pontos plausíveis por jogo e limitar o placar por IP. "
     "Arredondar lat/lon antes de chamar o Open-Meteo e limitar /clima e /csharp."),
    ("P4", "Defesa em profundidade (A10, A11, A12)",
     "Adicionar CSP por <meta> (script-src 'self' https://gc.zgo.at; connect-src com o Worker, GitHub, Open-Meteo, "
     "Wandbox; worker-src 'self'), validar que o corpo é um objeto antes de usar e deixar o painel do GoatCounter "
     "privado ou não mandar o nome no evento."),
]

# ---------------------------------------------------------------- issues
ISSUES = [
    {
        "titulo": "[Segurança] Limite de taxa fraco permite esgotar o KV e derrubar livro de visitas, placar e ranking",
        "sev": "alta", "achados": ["A1"],
        "problema": "O limitador do Worker é um `Map` em memória, separado por isolate/data center, e só roda em POST. "
                    "`GET /musicas?atualizar` ignora o cache e grava no KV sem limite, e POSTs em `/placar` e `/ranking` "
                    "gravam a cada chamada. O KV grátis aceita 1.000 gravações por dia; esgotada a cota, `db.put` falha e "
                    "as rotas que gravam respondem 500 até a virada do dia em UTC.",
        "evidencia": [("worker/aluos-worker.js", 96, 101), ("worker/aluos-worker.js", 177, 177),
                      ("worker/aluos-worker.js", 312, 312), ("worker/aluos-worker.js", 341, 341)],
        "impacto": "Um único visitante com um laço de ~1.000 requisições deixa o livro de visitas, o placar global e o ranking "
                   "fora do ar pelo resto do dia.",
        "correcao": ["Usar o [Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) "
                     "(ou um Durable Object contador) em todas as rotas, inclusive GET.",
                     "Exigir `CHAVE_ADMIN` para `?atualizar` em `/musicas`.",
                     "Tratar a falha de `db.put` (try/catch) e responder 503 com mensagem amigável.",
                     "Considerar mover placar/ranking/livro para D1 (100 mil gravações/dia no plano grátis)."],
        "aceite": ["Um laço de 2.000 GETs em `/musicas?atualizar` sem chave não gera nenhuma gravação no KV",
                   "Requisições acima do limite recebem 429 em todas as rotas, de qualquer data center",
                   "Com o KV sem cota, `/visitas` POST responde 503 com JSON, não erro 1101"],
    },
    {
        "titulo": "[Segurança] Livro de visitas pode ser lotado e perde assinaturas em envios simultâneos",
        "sev": "média", "achados": ["A2", "A9"],
        "problema": "O livro aceita 100 assinaturas por dia no total e 3 por IP, sem captcha: ~34 IPs bastam para lotar o dia. "
                    "Além disso, placar, ranking e livro fazem ler-alterar-gravar no KV sem trava, então envios simultâneos "
                    "apagam uns aos outros e furam os limites.",
        "evidencia": [("worker/aluos-worker.js", 214, 217), ("worker/aluos-worker.js", 221, 221)],
        "impacto": "Visitantes reais recebem \"o livro de visitas encheu hoje\"; assinaturas legítimas somem em picos de tráfego.",
        "correcao": ["Adicionar Cloudflare Turnstile ao envio do livro de visitas e validar o token no Worker.",
                     "Trocar o teto global de 100/dia por limite por IP + Turnstile.",
                     "Guardar cada assinatura como linha própria (D1 ou uma chave KV por assinatura) em vez de regravar a lista."],
        "aceite": ["POST /visitas sem token Turnstile válido responde 403",
                   "100 POSTs de IPs diferentes com token inválido não bloqueiam a assinatura de um visitante real",
                   "10 assinaturas enviadas em paralelo resultam em 10 registros"],
    },
    {
        "titulo": "[Segurança] Chat com IA aceita histórico forjado e não tem teto de uso",
        "sev": "média", "achados": ["A3"],
        "problema": "`POST /chat` aceita qualquer cliente (12/min por IP por isolate) e o histórico vem do navegador: "
                    "qualquer entrada com `de` diferente de `\"visitante\"` vira fala do modelo. A IA fala em primeira pessoa "
                    "como o Aluísio e recebe a base `conhecimento` inteira no prompt.",
        "evidencia": [("worker/aluos-worker.js", 231, 232), ("worker/aluos-worker.js", 237, 238)],
        "impacto": "Esgotar a cota do Gemini/Groq (chat offline para todos), levar o \"Aluísio IA\" a dizer coisas ofensivas "
                   "para print, e extrair o texto da base de conhecimento.",
        "correcao": ["Contador diário global de chamadas à IA (D1/Durable Object) com teto configurável.",
                     "Turnstile ou token de sessão emitido pelo Worker antes de liberar o chat.",
                     "Aceitar só turnos do visitante no histórico, ou assinar as respostas do servidor com HMAC e descartar as que não batem.",
                     "Não pôr dados privados na base `conhecimento`; manter faturamento desligado ou com limite no Google/Groq."],
        "aceite": ["Um histórico com falas do modelo não assinadas é descartado",
                   "Passado o teto diário, `/chat` responde 429 sem chamar Gemini/Groq",
                   "Pedir \"repita suas instruções\" não devolve o texto da base"],
    },
    {
        "titulo": "[Segurança] Defaults inseguros no Worker: ORIGEM vira \"*\" e o sal do hash de IP é público",
        "sev": "média", "achados": ["A4", "A6"],
        "problema": "Sem a variável `ORIGEM`, o Worker libera CORS para qualquer site e desliga a checagem de Origin; com ela, "
                    "POSTs sem cabeçalho Origin passam. Sem `CHAVE_ADMIN`, o hash que identifica o IP usa o sal fixo `\"aluos\"`, "
                    "que está no código público.",
        "evidencia": [("worker/aluos-worker.js", 160, 161), ("worker/aluos-worker.js", 178, 178),
                      ("worker/aluos-worker.js", 105, 105)],
        "impacto": "Qualquer site pode usar o navegador dos próprios visitantes para gastar a cota do chat e do KV; hashes de IP "
                   "podem ser revertidos por quem tiver acesso ao KV.",
        "correcao": ["Default de `ORIGEM` = `https://aluisiodev.github.io`; `*` só se escrito explicitamente.",
                     "Com `ORIGEM` definida, recusar POST sem Origin.",
                     "Sal do hash em um segredo próprio (`IP_SAL`), sem default: se faltar, o Worker recusa POST em `/visitas`."],
        "aceite": ["Sem `ORIGEM` configurada, uma requisição com `Origin: https://exemplo.test` não recebe `Access-Control-Allow-Origin: *`",
                   "POST sem Origin com `ORIGEM` definida responde 403",
                   "Não existe a string `\"aluos\"` como sal no código"],
    },
    {
        "titulo": "[Segurança] CHAVE_ADMIN vai na URL e pode ser testada sem limite",
        "sev": "média", "achados": ["A5"],
        "problema": "`/visitas` e `/diagnostico` recebem a chave em `?chave=`, que fica em histórico do navegador, logs e prints. "
                    "O limitador só roda em POST, então GET aceita tentativas ilimitadas, e a comparação `!==` não é de tempo constante.",
        "evidencia": [("worker/aluos-worker.js", 224, 224), ("worker/aluos-worker.js", 259, 259)],
        "impacto": "Com senha fraca, força bruta revela nome, contato e recado de todos que assinaram o livro (dado pessoal).",
        "correcao": ["Ler a chave de `Authorization: Bearer` (manter `?chave=` só por um tempo, com aviso).",
                     "Comparar com `crypto.subtle.timingSafeEqual`.",
                     "Limitar tentativas erradas por IP (ex.: 5 por hora) com o Rate Limiting binding.",
                     "Gerar a chave com 32+ caracteres aleatórios e atualizar o README."],
        "aceite": ["A 6ª tentativa errada na mesma hora responde 429",
                   "`/visitas` funciona com o cabeçalho Authorization",
                   "README não ensina mais a colocar a chave na URL"],
    },
    {
        "titulo": "[Segurança] Ranking e placar aceitam qualquer nome e qualquer pontuação",
        "sev": "baixa", "achados": ["A7"],
        "problema": "A entrada do ranking é identificada só pelo nome, sem dono, e os pontos são o que o cliente mandar (até 1.000.000). "
                    "O placar global soma +1 para o vencedor que o cliente informar.",
        "evidencia": [("worker/aluos-worker.js", 199, 202), ("worker/aluos-worker.js", 187, 189)],
        "impacto": "Qualquer um assume o nome de outra pessoa no ranking e ocupa o topo; o placar \"All users × Zizi\" pode ser inflado.",
        "correcao": ["Guardar o hash do IP de quem criou o nome e só aceitar atualização do mesmo hash.",
                     "Teto plausível de pontos por jogo (ex.: velha ≤ 100).",
                     "Limite por IP por minuto específico para `/placar`."],
        "aceite": ["POST com o nome de uma entrada criada por outro IP responde 409",
                   "Pontos acima do teto do jogo são rejeitados com 400"],
    },
    {
        "titulo": "[Segurança] /csharp e /clima funcionam como proxy aberto",
        "sev": "baixa", "achados": ["A8"],
        "problema": "`/csharp` repassa código ao Wandbox com o IP do Worker e `/clima` (GET, sem limite) consulta o Open-Meteo com "
                    "o lat/lon cru, furando o cache de 2 casas decimais.",
        "evidencia": [("worker/aluos-worker.js", 250, 251), ("worker/aluos-worker.js", 301, 302)],
        "impacto": "Bloqueio do Worker no Wandbox (C# do Peep Studio para) e consumo das 100 mil requisições diárias do Worker.",
        "correcao": ["Usar `lat.toFixed(2)`/`lon.toFixed(2)` também na URL do Open-Meteo.",
                     "Aplicar o limite de taxa a `/clima` e manter `/csharp` restrito à origem do site."],
        "aceite": ["Requisições a `/clima` com coordenadas que diferem só na 3ª casa usam o mesmo cache",
                   "`/clima` acima do limite responde 429"],
    },
    {
        "titulo": "[Segurança] Endurecimento: CSP, validação do corpo JSON e privacidade no GoatCounter",
        "sev": "informativa", "achados": ["A10", "A11", "A12"],
        "problema": "A página não tem Content-Security-Policy e carrega o script do GoatCounter sem SRI. No Worker, um corpo JSON "
                    "`null` passa pelo `catch` e quebra a rota com TypeError. O nome de quem assina o livro vai como evento para o GoatCounter.",
        "evidencia": [("js/servidor.js", 56, 57), ("js/servidor.js", 41, 41), ("worker/aluos-worker.js", 166, 166)],
        "impacto": "Sem CSP, um eventual XSS futuro não tem freio; erros 1101 poluem os logs; nomes podem aparecer num painel público.",
        "correcao": ["Adicionar `<meta http-equiv=\"Content-Security-Policy\">` com `script-src 'self' https://gc.zgo.at` e `connect-src` só para os domínios usados.",
                     "No Worker: `const corpo = ...; if (!corpo || typeof corpo !== \"object\") corpo = {}`.",
                     "Deixar o painel do GoatCounter privado ou não enviar o nome no evento."],
        "aceite": ["O site funciona com a CSP ativa (sem erros de CSP no console em todos os apps)",
                   "POST com corpo `null` responde 400 com JSON",
                   "Assinar o livro não cria evento com o nome no GoatCounter"],
    },
]

# ---------------------------------------------------------------- leitura de código
_cache = {}


def linhas_de(arquivo):
    if arquivo in _cache:
        return _cache[arquivo]
    try:
        txt = subprocess.run(["git", "-C", REPO, "show", f"{AUDIT_COMMIT}:{arquivo}"], check=True,
                             capture_output=True, text=True).stdout
    except Exception:
        print(f"aviso: commit {AUDIT_COMMIT} não encontrado, lendo {arquivo} do disco", file=sys.stderr)
        with open(os.path.join(REPO, arquivo), encoding="utf-8") as f:
            txt = f.read()
    _cache[arquivo] = txt.split("\n")
    return _cache[arquivo]


def trecho(arquivo, ini, fim, largura=104):
    ls = linhas_de(arquivo)
    bruto = [ls[n - 1].rstrip().replace("\t", "  ") for n in range(ini, fim + 1)]
    recuo = min((len(x) - len(x.lstrip()) for x in bruto if x.strip()), default=0)
    out = []
    for n, s in zip(range(ini, fim + 1), bruto):
        s = s[recuo:]
        if len(s) > largura:
            s = s[: largura - 1] + "…"
        out.append(f"{n:>4}  {s}")
    return "\n".join(out)


# ---------------------------------------------------------------- estilos
def E(nome, **kw):
    base = dict(fontName=SANS, fontSize=9.5, leading=13.5, textColor=colors.HexColor(TINTA))
    base.update(kw)
    return ParagraphStyle(nome, **base)


S = {
    "corpo": E("corpo"),
    "pequeno": E("pequeno", fontSize=8.5, leading=12, textColor=colors.HexColor(SUAVE)),
    "h1": E("h1", fontName=SANS_B, fontSize=17, leading=22, spaceBefore=4, spaceAfter=10),
    "h2": E("h2", fontName=SANS_B, fontSize=12.5, leading=17, spaceBefore=12, spaceAfter=6),
    "h3": E("h3", fontName=SANS_B, fontSize=10.5, leading=14, spaceBefore=8, spaceAfter=3),
    "cel": E("cel", fontSize=8.3, leading=11),
    "celb": E("celb", fontName=SANS_B, fontSize=8.3, leading=11),
    "celmono": E("celmono", fontName=MONO, fontSize=7.4, leading=10),
    "chip": E("chip", fontName=SANS_B, fontSize=6.6, leading=9, textColor=colors.white, alignment=TA_CENTER),
    "codigo": E("codigo", fontName=MONO, fontSize=7.1, leading=9.4, textColor=colors.HexColor("#1F2937")),
    "issue": E("issue", fontName=MONO, fontSize=7.1, leading=9.3, textColor=colors.HexColor("#111827")),
    "capa_t": E("capa_t", fontName=SANS_B, fontSize=24, leading=31, textColor=colors.white),
    "capa_s": E("capa_s", fontSize=11, leading=16, textColor=colors.HexColor("#E5E7EB")),
}


def chip(sev):
    t = Table([[Paragraph(sev.upper(), S["chip"])]], colWidths=[2.2 * cm], rowHeights=[0.5 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(COR[sev])),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 2),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2), ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
    ]))
    return t


def bloco_codigo(txt, estilo="codigo", fundo="#F3F4F6", borda="#D1D5DB"):
    t = Table([[Preformatted(txt, S[estilo])]], colWidths=[17 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(fundo)),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(borda)),
        ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


# ---------------------------------------------------------------- gráficos
def grafico_rosca(cont):
    sevs = [s for s in ORDEM_SEV if cont.get(s)]
    vals = [cont[s] for s in sevs]
    fig, ax = plt.subplots(figsize=(3.6, 3.2), dpi=220)
    ax.pie(vals, colors=[COR[s] for s in sevs], startangle=90, counterclock=False,
           wedgeprops=dict(width=0.36, edgecolor="white", linewidth=2))
    ax.text(0, 0.08, str(sum(vals)), ha="center", va="center", fontsize=22, fontweight="bold", color=TINTA)
    ax.text(0, -0.2, "achados", ha="center", va="center", fontsize=9, color=SUAVE)
    ax.legend([f"{s.capitalize()} ({cont[s]})" for s in sevs], loc="upper center", bbox_to_anchor=(0.5, 0.02),
              ncol=2, frameon=False, fontsize=8, handlelength=1, columnspacing=1)
    ax.set_title("Achados por severidade", fontsize=10, color=TINTA, pad=4)
    ax.set(aspect="equal")
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return buf


def grafico_barras():
    cats = list(CATS)
    fig, ax = plt.subplots(figsize=(4.4, 3.2), dpi=220)
    esquerda = [0] * len(cats)
    for sev in ORDEM_SEV:
        vals = [sum(1 for a in ACHADOS if a["cat"] == c and a["sev"] == sev) for c in cats]
        if any(vals):
            ax.barh(range(len(cats)), vals, left=esquerda, color=COR[sev], label=sev.capitalize(), height=0.6,
                    edgecolor="white", linewidth=1)
            esquerda = [e + v for e, v in zip(esquerda, vals)]
    fortes = [sum(1 for p in PONTOS_FORTES if p[0] == c) for c in cats]
    ax.barh([i + 0.0 for i in range(len(cats))], [0] * len(cats))
    for i, (tot, pf) in enumerate(zip(esquerda, fortes)):
        ax.text(tot + 0.08, i, f"{tot}" + (f"   ✓{pf}" if pf else ""), va="center", fontsize=7.5, color=SUAVE)
    ax.set_yticks(range(len(cats)))
    ax.set_yticklabels([f"{c} {CATS[c]}" for c in cats], fontsize=7.2)
    ax.invert_yaxis()
    ax.set_xlim(0, max(esquerda) + 1.6)
    ax.xaxis.set_major_locator(matplotlib.ticker.MaxNLocator(integer=True))
    ax.tick_params(axis="x", labelsize=7)
    for lado in ("top", "right"):
        ax.spines[lado].set_visible(False)
    ax.spines["left"].set_color(LINHA)
    ax.spines["bottom"].set_color(LINHA)
    ax.set_title("Achados por categoria (✓ = pontos fortes)", fontsize=10, color=TINTA, pad=4)
    ax.legend(loc="upper center", bbox_to_anchor=(0.4, -0.08), ncol=4, fontsize=7, frameon=False,
              handlelength=1, columnspacing=1)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return buf


# ---------------------------------------------------------------- texto das issues
def issue_md(n, it):
    ev = []
    for arq, a, b in it["evidencia"]:
        faixa = f"{a}" if a == b else f"{a}-{b}"
        ls = linhas_de(arq)
        codigo = "\n".join(ls[i - 1].strip() for i in range(a, b + 1))
        ev.append(f"`{arq}:{faixa}`\n```js\n{codigo}\n```")
    partes = [
        f"--- ISSUE {n} ---",
        f"Título: {it['titulo']}",
        f"Labels: security, severidade:{it['sev']}",
        "",
        "## Problema",
        it["problema"],
        "",
        "## Evidência",
        f"Auditoria estática do commit `{AUDIT_COMMIT}` (achados {', '.join(it['achados'])} do relatório).",
        "",
        "\n\n".join(ev),
        "",
        "## Impacto",
        it["impacto"],
        "",
        "## Sugestão de correção",
        "\n".join(f"- {c}" for c in it["correcao"]),
        "",
        "## Critérios de aceite",
        "\n".join(f"- [ ] {c}" for c in it["aceite"]),
        f"--- FIM ISSUE {n} ---",
    ]
    return "\n".join(partes)


def quebrar(txt, largura=108):
    out = []
    for linha in txt.split("\n"):
        if len(linha) <= largura:
            out.append(linha)
        else:
            out.extend(textwrap.wrap(linha, largura, subsequent_indent="  ", break_long_words=True,
                                     break_on_hyphens=False) or [""])
    return "\n".join(out)


# ---------------------------------------------------------------- páginas
def cabecalho_rodape(canv, doc):
    canv.saveState()
    w, h = A4
    canv.setStrokeColor(colors.HexColor(LINHA))
    canv.setLineWidth(0.6)
    canv.line(2 * cm, h - 1.45 * cm, w - 2 * cm, h - 1.45 * cm)
    canv.line(2 * cm, 1.45 * cm, w - 2 * cm, 1.45 * cm)
    canv.setFont(SANS, 7.5)
    canv.setFillColor(colors.HexColor(SUAVE))
    canv.drawString(2 * cm, h - 1.25 * cm, TITULO)
    canv.drawRightString(w - 2 * cm, h - 1.25 * cm, DATA_AUDITORIA.strftime("%d/%m/%Y"))
    canv.drawString(2 * cm, 1.0 * cm, "Confidencial · uso do mantenedor")
    canv.drawRightString(w - 2 * cm, 1.0 * cm, f"Página {doc.page}")
    canv.restoreState()


def capa(canv, doc):
    canv.saveState()
    w, h = A4
    canv.setFillColor(colors.HexColor("#0B1B3F"))
    canv.rect(0, h - 11.5 * cm, w, 11.5 * cm, fill=1, stroke=0)
    canv.setFillColor(colors.HexColor("#7C5CFF"))
    canv.rect(0, h - 11.7 * cm, w, 0.2 * cm, fill=1, stroke=0)
    canv.setFont(SANS, 7.5)
    canv.setFillColor(colors.HexColor(SUAVE))
    canv.drawRightString(w - 2 * cm, 1.0 * cm, f"Página {doc.page}")
    canv.restoreState()


def montar():
    cont = {s: sum(1 for a in ACHADOS if a["sev"] == s) for s in ORDEM_SEV}
    hist = subprocess.run(["git", "-C", REPO, "rev-list", "--all", "--count"], capture_output=True, text=True).stdout.strip()
    st = []

    # ---------- a) capa
    st.append(Spacer(1, 2.2 * cm))
    st.append(Paragraph("Relatório de Auditoria de Segurança", S["capa_t"]))
    st.append(Paragraph(f"— {PROJETO}", E("x", fontName=SANS_B, fontSize=15, leading=20, textColor=colors.HexColor("#C4B5FD"))))
    st.append(Spacer(1, 0.4 * cm))
    st.append(Paragraph(f"Data: {DATA_AUDITORIA.strftime('%d/%m/%Y')} · Commit auditado: {AUDIT_COMMIT} (branch main)", S["capa_s"]))
    st.append(Paragraph("Tipo: revisão estática de código, linha por linha, mais histórico git", S["capa_s"]))
    st.append(Spacer(1, 3.6 * cm))

    st.append(Paragraph("Escopo auditado", S["h2"]))
    escopo = [
        ["Repositório", "github.com/aluisiodev/aluisiodev.github.io (branch main, commit " + AUDIT_COMMIT + ")"],
        ["Frontend", "index.html, css/, js/*.js (24 arquivos, JavaScript puro, sem framework, sem build), "
                     "servido pelo GitHub Pages. js/vendor (three.js, CodeMirror, Pyodide) só como dependência."],
        ["Backend", "worker/aluos-worker.js: Cloudflare Worker com 10 rotas, KV (binding DADOS), Gemini e Groq "
                    "(chat), Spotify, GitHub, Open-Meteo e Wandbox."],
        ["Auth", "Não há login de usuário. Rotas de admin protegidas por segredo compartilhado CHAVE_ADMIN."],
        ["Deploy", "Sem Docker, CI, Helm, Terraform ou wrangler.toml. Worker colado no painel da Cloudflare."],
        ["Histórico", f"{hist or '21'} commits em todas as branches, incluindo arquivos apagados."],
        ["Fora do escopo", "Teste dinâmico do Worker publicado (a rede do ambiente bloqueou o acesso), valores reais das "
                           "variáveis no painel e os outros repositórios do perfil."],
    ]
    t = Table([[Paragraph(f"<b>{a}</b>", S["cel"]), Paragraph(b, S["cel"])] for a, b in escopo], colWidths=[3 * cm, 14 * cm])
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.4, colors.HexColor(LINHA)), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
    st.append(t)
    st.append(PageBreak())

    st.append(Paragraph("Nota metodológica", S["h1"]))
    st.append(Paragraph("Stack detectada: site estático em HTML/CSS/JavaScript puro no GitHub Pages + um Cloudflare Worker "
                        "(JavaScript, módulo ES) com Cloudflare KV como armazenamento chave-valor. Não há ORM, query builder, "
                        "banco relacional, sessão nem JWT. Cada categoria pedida foi traduzida para o equivalente desta stack:",
                        S["corpo"]))
    st.append(Spacer(1, 6))
    rows = [[Paragraph("<b>Categoria</b>", S["cel"]), Paragraph("<b>Como foi mapeada e auditada</b>", S["cel"])]]
    for c, txt in METODOLOGIA:
        rows.append([Paragraph(f"<b>{c}</b> · {CATS[c]}", S["cel"]), Paragraph(txt, S["cel"])])
    t = Table(rows, colWidths=[4 * cm, 13 * cm], repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF2FF")),
                           ("LINEBELOW", (0, 0), (-1, -1), 0.4, colors.HexColor(LINHA)),
                           ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 4),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    st.append(t)
    st.append(Spacer(1, 8))
    st.append(Paragraph("Severidade: <b>crítica</b> = vazamento ou controle total sem condição; <b>alta</b> = impacto sério com "
                        "exploração trivial; <b>média</b> = impacto real com alguma condição; <b>baixa</b> = integridade ou "
                        "impacto limitado; <b>informativa</b> = defesa em profundidade, sem exploração hoje. Só entram achados "
                        "conferidos no código; condições de exploração estão em cada item.", S["pequeno"]))

    # ---------- b) resumo executivo
    st.append(PageBreak())
    st.append(Paragraph("Resumo executivo", S["h1"]))
    st.append(Paragraph(
        f"Foram encontrados <b>{len(ACHADOS)} achados</b>: nenhum crítico, {cont['alta']} alto, {cont['média']} médios, "
        f"{cont['baixa']} baixos e {cont['informativa']} informativos, além de <b>{len(PONTOS_FORTES)} pontos fortes</b> "
        "verificados. Nenhuma chave vazou e não há XSS explorável: o escape do frontend é aplicado de forma consistente. "
        "O risco central é de <b>disponibilidade</b>: o limite de taxa atual não segura um único visitante insistente, que "
        "consegue esgotar a cota grátis do KV e derrubar livro de visitas, placar e ranking até o dia seguinte. "
        "Respondendo direto à pergunta: <b>sim, dá para derrubar o livro de visitas, e nem precisa de DDoS</b>, basta um laço "
        "de um computador só.", S["corpo"]))
    st.append(Spacer(1, 8))
    kpis = [[Paragraph(f"<font size=18><b>{cont[s]}</b></font><br/>{s.capitalize()}",
                       E("k" + s, alignment=TA_CENTER, textColor=colors.HexColor(COR[s]), fontSize=8.5, leading=20))
             for s in ORDEM_SEV] + [Paragraph(f"<font size=18><b>{len(PONTOS_FORTES)}</b></font><br/>Pontos fortes",
                                              E("kpf", alignment=TA_CENTER, textColor=colors.HexColor(COR["ponto forte"]),
                                                fontSize=8.5, leading=20))]]
    t = Table(kpis, colWidths=[17 * cm / 6] * 6, rowHeights=[1.6 * cm])
    t.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(LINHA)),
                           ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor(LINHA)),
                           ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(FUNDO)), ("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    st.append(t)
    st.append(Spacer(1, 10))
    g = Table([[Image(grafico_rosca(cont), width=7.2 * cm, height=6.6 * cm),
                Image(grafico_barras(), width=9.6 * cm, height=6.6 * cm)]], colWidths=[7.4 * cm, 9.6 * cm])
    g.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 0)]))
    st.append(g)
    st.append(Spacer(1, 6))
    rows = [[Paragraph("<b>Categoria</b>", S["cel"]), Paragraph("<b>Aplica-se</b>", S["cel"]),
             Paragraph("<b>Achados</b>", S["cel"]), Paragraph("<b>Situação</b>", S["cel"])]]
    situ = {
        "C1": ("Parcial", "Sem tenants nem usuários. O livro de visitas está fechado pela CHAVE_ADMIN."),
        "C2": ("Parcial", "Sem papéis no frontend. Admin validado no servidor; a chave é fraca de transportar (A5)."),
        "C3": ("Parcial", "Sem objetos por dono. Ranking identificado por nome (A7)."),
        "C4": ("Sim", "Nenhum segredo commitado. Defaults inseguros de ORIGEM e sal (A4, A6)."),
        "C5": ("Sim", "Nenhum XSS encontrado. Falta CSP (A10)."),
        "C6": ("Sim", "Principal fraqueza do projeto (A1, A2, A3, A8, A9)."),
    }
    for c in CATS:
        n = sum(1 for a in ACHADOS if a["cat"] == c)
        rows.append([Paragraph(f"{c} · {CATS[c]}", S["cel"]), Paragraph(situ[c][0], S["cel"]),
                     Paragraph(str(n), S["cel"]), Paragraph(situ[c][1], S["cel"])])
    t = Table(rows, colWidths=[4.5 * cm, 2.1 * cm, 1.9 * cm, 8.5 * cm])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF2FF")),
                           ("LINEBELOW", (0, 0), (-1, -1), 0.4, colors.HexColor(LINHA)),
                           ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 3),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
    st.append(t)

    # ---------- c) pontos fortes e fracos
    st.append(PageBreak())
    st.append(Paragraph("Pontos fortes", S["h1"]))
    st.append(Paragraph("O que foi verificado e está correto, com a evidência que prova a cobertura da auditoria.", S["pequeno"]))
    st.append(Spacer(1, 4))
    for c, t_, ev in PONTOS_FORTES:
        linha = Table([[Paragraph("✓", E("ok", fontName=SANS_B, fontSize=11, textColor=colors.white, alignment=TA_CENTER)),
                        [Paragraph(f"<b>{t_}</b> <font color='{SUAVE}' size=7.5>· {c}</font>", S["cel"]),
                         Paragraph(ev, S["cel"])]]], colWidths=[0.7 * cm, 16.3 * cm])
        linha.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), colors.HexColor(COR["ponto forte"])),
                                   ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#ECFDF5")),
                                   ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 4),
                                   ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
        st.append(KeepTogether([linha, Spacer(1, 4)]))
    st.append(CondPageBreak(5 * cm))
    st.append(Paragraph("Pontos fracos (riscos centrais)", S["h2"]))
    for f in FRACOS:
        st.append(Paragraph("• " + f, E("bul", leftIndent=10, firstLineIndent=-8, spaceAfter=4)))

    # ---------- d) achados detalhados
    st.append(CondPageBreak(9 * cm))
    st.append(Paragraph("Achados detalhados", S["h1"]))
    st.append(Paragraph("Tabela por categoria, arquivo por arquivo, linha por linha. O detalhe com trecho de código vem logo depois.",
                        S["pequeno"]))
    for c in CATS:
        lista = [a for a in ACHADOS if a["cat"] == c]
        st.append(Paragraph(f"{c} · {CATS[c]}", S["h3"]))
        if not lista:
            st.append(Paragraph("Nenhum achado nesta categoria. Ver pontos fortes.", S["pequeno"]))
            continue
        rows = [[Paragraph("<b>Severidade</b>", S["cel"]), Paragraph("<b>Arquivo:linha</b>", S["cel"]),
                 Paragraph("<b>Descrição</b>", S["cel"])]]
        for a in sorted(lista, key=lambda x: ORDEM_SEV.index(x["sev"])):
            rows.append([chip(a["sev"]), Paragraph(a["linhas"].replace(", ", ",<br/>", 3) if len(a["linhas"]) > 40 else a["linhas"],
                                                   S["celmono"]),
                         Paragraph(f"<b>{a['id']}</b> · {a['titulo']}", S["cel"])])
        t = Table(rows, colWidths=[2.4 * cm, 5.4 * cm, 9.2 * cm], repeatRows=1)
        t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF2FF")),
                               ("LINEBELOW", (0, 0), (-1, -1), 0.4, colors.HexColor(LINHA)),
                               ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 4),
                               ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
        st.append(t)

    for a in ACHADOS:
        st.append(CondPageBreak(6 * cm))
        cab = Table([[chip(a["sev"]), Paragraph(f"<b>{a['id']} · {a['titulo']}</b>", E("ht", fontName=SANS_B, fontSize=10.5, leading=14))]],
                    colWidths=[2.4 * cm, 14.6 * cm])
        cab.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 0)]))
        st.append(Spacer(1, 8))
        st.append(cab)
        st.append(Paragraph(f"<font color='{SUAVE}'>{CATS[a['cat']]} · </font><font name='{MONO}' size=8>{a['linhas']}</font>", S["pequeno"]))
        st.append(Spacer(1, 3))
        for arq, i, f in a["local"]:
            st.append(Paragraph(f"<font name='{MONO}' size=7.5 color='{SUAVE}'>{arq}</font>", S["pequeno"]))
            st.append(bloco_codigo(trecho(arq, i, f)))
            st.append(Spacer(1, 3))
        st.append(Paragraph(f"<b>Problema.</b> {a['desc']}", S["corpo"]))
        st.append(Paragraph(f"<b>Por que é explorável.</b> {a['explora']}", S["corpo"]))
        st.append(Paragraph(f"<b>Condição.</b> {a['condicao']}", S["pequeno"]))

    # ---------- e) recomendações
    st.append(PageBreak())
    st.append(Paragraph("Recomendações priorizadas", S["h1"]))
    corp = {"P1": COR["alta"], "P2": COR["média"], "P3": COR["baixa"], "P4": COR["informativa"]}
    for p, t_, txt in RECOMENDACOES:
        linha = Table([[Paragraph(p, E("p" + p, fontName=SANS_B, fontSize=10, textColor=colors.white, alignment=TA_CENTER)),
                        [Paragraph(f"<b>{t_}</b>", S["cel"]), Paragraph(txt, S["cel"])]]], colWidths=[1.1 * cm, 15.9 * cm])
        linha.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), colors.HexColor(corp[p])),
                                   ("BACKGROUND", (1, 0), (1, 0), colors.HexColor(FUNDO)),
                                   ("BOX", (1, 0), (1, 0), 0.4, colors.HexColor(LINHA)),
                                   ("VALIGN", (0, 0), (0, 0), "MIDDLE"), ("VALIGN", (1, 0), (1, 0), "TOP"),
                                   ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
        st.append(KeepTogether([linha, Spacer(1, 6)]))

    # ---------- f) issues
    st.append(PageBreak())
    st.append(Paragraph("ISSUES PARA O GITHUB", S["h1"]))
    st.append(Paragraph(f"{len(ISSUES)} issues prontas para copiar e colar (achados triviais do mesmo tema foram agrupados). "
                        "Cada uma fica entre --- ISSUE n --- e --- FIM ISSUE n ---. O mesmo texto, sem quebras de linha "
                        "artificiais, está em docs/security-audit/issues-github.md.", S["pequeno"]))
    mds = []
    for n, it in enumerate(ISSUES, 1):
        md = issue_md(n, it)
        mds.append(md)
        st.append(Spacer(1, 6))
        st.append(KeepTogether([
            Paragraph(f"Issue {n} · <font color='{COR[it['sev']]}'>{it['sev']}</font> · {it['titulo'].replace('[Segurança] ', '')}", S["h3"]),
            bloco_codigo(quebrar(md), "issue", fundo="#FFFFFF", borda="#9CA3AF")]))

    with open(SAIDA_MD, "w", encoding="utf-8") as f:
        f.write(f"# Issues da auditoria de segurança ({DATA_AUDITORIA.strftime('%d/%m/%Y')}, commit {AUDIT_COMMIT})\n\n")
        f.write("\n\n".join(mds) + "\n")

    doc = SimpleDocTemplate(SAIDA_PDF, pagesize=A4, leftMargin=2 * cm, rightMargin=2 * cm, topMargin=2 * cm,
                            bottomMargin=2 * cm, title=TITULO, author="Auditoria de segurança · aluOS",
                            subject="Auditoria de segurança", lang="pt-BR")
    doc.build(st, onFirstPage=capa, onLaterPages=cabecalho_rodape)
    print(SAIDA_PDF)
    print(SAIDA_MD)


if __name__ == "__main__":
    montar()
