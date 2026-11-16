// "C# de bolso": traduz um pedaço simples de C# para JavaScript e roda no navegador.
// Cobre o básico (Console, variáveis, if/for/while/foreach, métodos estáticos, listas,
// interpolação de strings). Não é um compilador de verdade: é um tradutor esperto.
(function (G) {
  const TIPOS = "int|long|short|byte|uint|ulong|double|float|decimal|string|bool|char|object|dynamic|var";
  const TIPO = `(?:(?:${TIPOS})\\??|[A-Z]\\w*(?:<[^<>()]*(?:<[^<>()]*>)?[^<>()]*>)?)(?:\\[\\s*,*\\s*\\])*\\??`;

  function traduzirExpr(s) {
    return s
      .replace(/\bConsole\.WriteLine\s*\(/g, "__print(true, ")
      .replace(/\bConsole\.Write\s*\(/g, "__print(false, ")
      .replace(/__print\((true|false), \)/g, "__print($1)")
      .replace(/\bConsole\.ReadLine\s*\(\s*\)/g, "__readLine()")
      .replace(/\bConsole\.(Clear|Beep)\s*\(\s*\)/g, "void 0")
      .replace(/\bnew\s+(?:List|HashSet|Queue|Stack|LinkedList)<[^()]*?>\s*\(\s*\)\s*\{([^{}]*)\}/g, "[$1]")
      .replace(/\bnew\s+(?:List|HashSet|Queue|Stack|LinkedList)<[^()]*?>\s*\([^()]*\)/g, "[]")
      .replace(/\bnew\s+(?:List|HashSet)<[^()]*?>\s*\{([^{}]*)\}/g, "[$1]")
      .replace(/\bnew\s+Dictionary<[^()]*?>\s*\(\s*\)/g, "new __Dict()")
      .replace(/\bnew\s+(?:\w+)?\[\s*\]\s*\{([^{}]*)\}/g, "[$1]")
      .replace(/\bnew\s+(?:int|long|double|float|decimal|short|byte)\[\s*([^\]]+)\]/g, "new Array($1).fill(0)")
      .replace(/\bnew\s+bool\[\s*([^\]]+)\]/g, "new Array($1).fill(false)")
      .replace(/\bnew\s+\w+\[\s*([^\]]+)\]/g, "new Array($1).fill(null)")
      .replace(/\bstring\.Join\s*\(/g, "__join(")
      .replace(/\bstring\.IsNullOrEmpty\s*\(/g, "__vazio(")
      .replace(/\bstring\.IsNullOrWhiteSpace\s*\(/g, "__vazio(")
      .replace(/\b(?:int|long|short)\.Parse\s*\(/g, "__int(")
      .replace(/\b(?:double|float|decimal)\.Parse\s*\(/g, "parseFloat(")
      .replace(/\bConvert\.ToInt(?:32|64|16)\s*\(/g, "__int(")
      .replace(/\bConvert\.ToDouble\s*\(/g, "parseFloat(")
      .replace(/\bConvert\.ToString\s*\(/g, "__str(")
      .replace(/\b(?:int|long)\.MaxValue\b/g, "2147483647").replace(/\b(?:int|long)\.MinValue\b/g, "-2147483648")
      .replace(/\bMath\.PI\b/g, "Math.PI").replace(/\bMath\.E\b/g, "Math.E")
      .replace(/\bMath\.(\w)(\w*)\s*\(/g, (m, a, b) => `Math.${a.toLowerCase()}${b}(`)
      .replace(/\bMath\.truncate\(/g, "Math.trunc(").replace(/\bMath\.ceiling\(/g, "Math.ceil(")
      .replace(/\.(Length|Count)\b(?!\s*\()/g, ".length")
      .replace(/\.Count\s*\(\s*\)/g, ".length")
      .replace(/\.Add\s*\(/g, ".push(")
      .replace(/\.AddRange\s*\(/g, ".push(...")
      .replace(/\.ToUpper(?:Invariant)?\s*\(\s*\)/g, ".toUpperCase()")
      .replace(/\.ToLower(?:Invariant)?\s*\(\s*\)/g, ".toLowerCase()")
      .replace(/\.Trim\s*\(\s*\)/g, ".trim()")
      .replace(/\.ToString\s*\(\s*\)/g, ".__str()")
      .replace(/\.ToString\s*\(\s*"([^"]*)"\s*\)/g, '.__fmt("$1")')
      .replace(/\.Contains\s*\(/g, ".includes(")
      .replace(/\.ContainsKey\s*\(/g, ".has(")
      .replace(/\.StartsWith\s*\(/g, ".startsWith(").replace(/\.EndsWith\s*\(/g, ".endsWith(")
      .replace(/\.IndexOf\s*\(/g, ".indexOf(").replace(/\.Replace\s*\(/g, ".replaceAll(")
      .replace(/\.Substring\s*\(/g, ".__sub(").replace(/\.Split\s*\(/g, ".split(")
      .replace(/\.Remove\s*\(/g, ".__remove(").replace(/\.RemoveAt\s*\(/g, ".__removeAt(")
      .replace(/\.Insert\s*\(/g, ".__insert(").replace(/\.Clear\s*\(\s*\)/g, ".__clear()")
      .replace(/\.Reverse\s*\(\s*\)/g, ".__reverse()").replace(/\.Sort\s*\(\s*\)/g, ".__sort()")
      .replace(/\.(Sum|Max|Min|Average|First|Last|Any|All|Where|Select|OrderBy|OrderByDescending|ToList|ToArray|Distinct)\s*\(/g, ".__$1(")
      .replace(/\bArray\.Sort\s*\(\s*(\w+)\s*\)/g, "$1.__sort()")
      .replace(/\bArray\.Reverse\s*\(\s*(\w+)\s*\)/g, "$1.__reverse()")
      .replace(/\bnew\s+Random\s*\(\s*\)/g, "new __Random()")
      .replace(/\bcatch\s*\(\s*\w+\s+(\w+)\s*\)/g, "catch ($1)").replace(/\bcatch\s*\(\s*[A-Z]\w*\s*\)/g, "catch (__e)")
      .replace(/\.Message\b/g, ".message").replace(/\.StackTrace\b/g, ".stack")
      .replace(/\bthrow new \w*Exception\s*\(/g, "throw new Error(")
      .replace(/\bnull\b/g, "null")
      .replace(/(\d+(?:\.\d+)?)[mMfFdD]\b/g, "$1")
      .replace(/(\w+)\s+is\s+null/g, "$1 == null");
  }

  function traduzir(fonte) {
    // 1) guarda strings, chars e comentários para não mexer neles
    const guard = [];
    const tok = (v) => `\u0001${guard.push(v) - 1}\u0001`;
    let s = fonte.replace(/\r/g, "");
    s = s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    s = s.replace(/\$@"((?:[^"]|"")*)"|@\$"((?:[^"]|"")*)"|\$"((?:[^"\\]|\\.)*)"|@"((?:[^"]|"")*)"|"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g,
      (m, vi1, vi2, interp, verb, normal, ch) => {
        if (interp != null || vi1 != null || vi2 != null) {
          const corpo = interp != null ? interp : (vi1 != null ? vi1 : vi2).replace(/""/g, '"');
          // {expr[,alinhamento][:formato]}  ->  ${__fmtv(expr, "formato")}
          let out = "", i = 0;
          while (i < corpo.length) {
            const c = corpo[i];
            if (c === "{" && corpo[i + 1] === "{") { out += "{"; i += 2; continue; }
            if (c === "}" && corpo[i + 1] === "}") { out += "}"; i += 2; continue; }
            if (c === "{") {
              let prof = 1, j = i + 1;
              while (j < corpo.length && prof) { if (corpo[j] === "{") prof++; else if (corpo[j] === "}") prof--; j++; }
              let dentro = corpo.slice(i + 1, j - 1), fmt = "";
              const mf = dentro.match(/^(.*?)(?:,\s*-?\d+)?(?::([^:]+))?$/);
              if (mf && !/\?.*:/.test(dentro)) { dentro = mf[1]; fmt = mf[2] || ""; }
              out += "${__fmtv(" + traduzirExpr(dentro) + ', "' + fmt + '")}';
              i = j; continue;
            }
            if (c === "`") { out += "\\`"; i++; continue; }
            if (c === "$" && corpo[i + 1] === "{") { out += "\\$"; i++; continue; }
            out += c; i++;
          }
          return tok("`" + out + "`");
        }
        if (verb != null) return tok(JSON.stringify(verb.replace(/""/g, '"')));
        if (normal != null) return tok('"' + normal + '"');
        return tok("'" + ch + "'");
      });

    // 2) tira using, namespace e a casca das classes estáticas
    s = s.replace(/^\s*using\s+[\w.]+\s*;/gm, "").replace(/^\s*namespace\s+[\w.]+\s*;/gm, "");
    let abreRemovidas = 0;
    s = s.replace(/^\s*namespace\s+[\w.]+\s*\{/gm, () => { abreRemovidas++; return ""; });
    s = s.replace(/^\s*(?:(?:public|internal|static|sealed|partial)\s+)*class\s+\w+[^{\n]*\{/gm, () => { abreRemovidas++; return ""; });
    s = s.replace(/^\s*(?:(?:public|internal|static|sealed|partial)\s+)*class\s+\w+[^{\n]*\n\s*\{/gm, () => { abreRemovidas++; return ""; });
    for (let k = 0; k < abreRemovidas; k++) { const i = s.lastIndexOf("}"); if (i >= 0) s = s.slice(0, i) + s.slice(i + 1); }

    // 3) métodos -> function
    const mods = "(?:(?:public|private|protected|internal|static|async|override|virtual)\\s+)*";
    s = s.replace(new RegExp(`^(\\s*)${mods}(?:void|${TIPO})\\s+([A-Za-z_]\\w*)\\s*\\(([^()]*)\\)\\s*(?=\\{|\\n\\s*\\{|=>)`, "gm"), (m, ind, nome, params) => {
      if (/^(if|for|while|switch|foreach|catch|using|lock|return|new)$/.test(nome)) return m;
      const ps = params.split(",").map((p) => p.trim()).filter(Boolean).map((p) => {
        const [decl, def] = p.split("=");
        const nomeP = decl.trim().replace(/^(?:params|ref|out|in)\s+/, "").split(/\s+/).pop();
        return def != null ? `${nomeP} = ${def.trim()}` : nomeP;
      });
      return `${ind}function ${nome}(${ps.join(", ")}) `;
    });
    s = s.replace(/^(\s*function [^\n]*\)\s*)=>\s*([^;\n]+);/gm, "$1{ return $2; }");

    // 4) declarações de variáveis -> let
    s = s.replace(/^(\s*)(?:(?:public|private|protected|internal|static|readonly)\s+)+/gm, "$1");
    s = s.replace(new RegExp(`${TIPO}\\[\\]\\s+([A-Za-z_]\\w*)\\s*=\\s*\\{([^{}]*)\\}`, "g"), "let $1 = [$2]");
    s = s.replace(new RegExp(`(^|[;({]\\s*|\\n\\s*)const\\s+${TIPO}\\s+(?=[A-Za-z_]\\w*\\s*=)`, "g"), "$1const ");
    s = s.replace(new RegExp(`(^|[;(]\\s*|\\n\\s*|\\{\\s*)${TIPO}\\s+(?=[A-Za-z_]\\w*\\s*(?:=[^=]|;|,))`, "g"), (m, pre) => pre + "let ");
    s = s.replace(new RegExp(`\\bforeach\\s*\\(\\s*${TIPO}\\s+(\\w+)\\s+in\\s+`, "g"), "for (const $1 of ");
    s = s.replace(/\bforeach\s*\(\s*\(([^)]*)\)\s+in\s+/g, "for (const [$1] of ");
    // casts simples: (int)x -> __int(x)
    s = s.replace(/\(\s*(?:int|long|short)\s*\)\s*(\w+(?:\.\w+)*(?:\([^()]*\))?)/g, "Math.trunc($1)");
    s = s.replace(/\(\s*(?:double|float|decimal)\s*\)\s*/g, "");

    s = traduzirExpr(s);
    s = s.replace(/\u0001(\d+)\u0001/g, (m, i) => guard[+i]).replace(/\u0001(\d+)\u0001/g, (m, i) => guard[+i]);
    const temMain = /\bfunction Main\s*\(/.test(s);
    return s + (temMain ? "\nMain([]);" : "");
  }

  // ---------- "runtime" que o código traduzido usa ----------
  const PRELUDIO = `
const __str = (v) => v === true ? "True" : v === false ? "False" : v == null ? "" : Array.isArray(v) ? "System.Collections.Generic.List" : String(v);
const __fmtv = (v, f) => {
  if (!f || typeof v !== "number") return __str(v);
  const m = f.match(/^([FNCPDE])(\\d*)$/i); if (!m) return __str(v);
  const n = m[2] === "" ? 2 : +m[2], t = m[1].toUpperCase();
  if (t === "F") return v.toFixed(n).replace(".", ",");
  if (t === "N") return v.toLocaleString("pt-BR", { minimumFractionDigits: n, maximumFractionDigits: n });
  if (t === "C") return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if (t === "P") return (v * 100).toFixed(n).replace(".", ",") + "%";
  if (t === "D") return String(Math.trunc(v)).padStart(+m[2] || 0, "0");
  return String(v);
};
const __print = (nl, ...a) => __out((a.length ? __str(a[0]) : "") + (nl ? "\\n" : ""));
const __join = (sep, xs, ...resto) => (Array.isArray(xs) ? xs : [xs, ...resto]).map(__str).join(sep);
const __vazio = (s) => s == null || String(s).trim() === "";
const __int = (s) => { const n = parseInt(s, 10); if (isNaN(n)) throw new Error("FormatException: a entrada não está no formato correto."); return n; };
class __Random { Next(a, b) { if (b === undefined) { b = a; a = 0; } if (b === undefined) return Math.floor(Math.random() * 2147483647); return a + Math.floor(Math.random() * (b - a)); } NextDouble() { return Math.random(); } }
function __Dict() {
  const m = new Map();
  const api = {
    has: (k) => m.has(k), push: (k, v) => { if (m.has(k)) throw new Error("ArgumentException: a chave já existe."); m.set(k, v); }, __remove: (k) => m.delete(k), __clear: () => m.clear(),
    get length() { return m.size; }, get Keys() { return [...m.keys()]; }, get Values() { return [...m.values()]; },
    [Symbol.iterator]: function* () { for (const [k, v] of m) yield { Key: k, Value: v }; },
  };
  return new Proxy(api, {
    get: (t, p) => { if (p in t) return t[p]; if (!m.has(p)) throw new Error("KeyNotFoundException: a chave '" + String(p) + "' não existe."); return m.get(p); },
    set: (t, p, v) => { m.set(p, v); return true; },
  });
}
Object.defineProperty(Object.prototype, "__str", { value() { return __str(this.valueOf()); }, configurable: true });
Object.defineProperty(Number.prototype, "__fmt", { value(f) { return __fmtv(+this, f); }, configurable: true });
const AP = Array.prototype, SP = String.prototype;
Object.assign(AP, {
  __remove(x) { const i = this.indexOf(x); if (i >= 0) this.splice(i, 1); return i >= 0; }, __removeAt(i) { this.splice(i, 1); },
  __insert(i, x) { this.splice(i, 0, x); }, __clear() { this.length = 0; }, __reverse() { return this.reverse(); }, __sort() { return this.sort((a, b) => a < b ? -1 : a > b ? 1 : 0); },
  __Sum(f) { return this.reduce((s, x) => s + (f ? f(x) : x), 0); }, __Max(f) { return Math.max(...this.map((x) => f ? f(x) : x)); }, __Min(f) { return Math.min(...this.map((x) => f ? f(x) : x)); },
  __Average(f) { return this.__Sum(f) / this.length; }, __First(f) { return f ? this.find(f) : this[0]; }, __Last(f) { const a = f ? this.filter(f) : this; return a[a.length - 1]; },
  __Any(f) { return f ? this.some(f) : this.length > 0; }, __All(f) { return this.every(f); }, __Where(f) { return this.filter(f); }, __Select(f) { return this.map(f); },
  __OrderBy(f) { return [...this].sort((a, b) => (f(a) > f(b)) - (f(a) < f(b))); }, __OrderByDescending(f) { return [...this].sort((a, b) => (f(a) < f(b)) - (f(a) > f(b))); },
  __ToList() { return [...this]; }, __ToArray() { return [...this]; }, __Distinct() { return [...new Set(this)]; },
});
Object.assign(SP, { __sub(i, n) { return n === undefined ? this.slice(i) : this.substr(i, n); }, __remove(i, n) { return this.slice(0, i) + (n === undefined ? "" : this.slice(i + n)); }, __reverse() { return [...this].reverse(); } });
for (const k of Object.keys(AP).filter((k) => k.startsWith("__"))) Object.defineProperty(AP, k, { enumerable: false });
for (const k of ["__sub", "__remove", "__reverse"]) Object.defineProperty(SP, k, { enumerable: false });
`;

  G.CSharpBolso = { traduzir, PRELUDIO };
})(typeof self !== "undefined" ? self : window);
