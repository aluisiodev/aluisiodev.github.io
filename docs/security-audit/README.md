# Auditoria de segurança

- `relatorio-auditoria-seguranca.pdf`: relatório (A4, 20 páginas), auditoria estática do commit `ff63291` (main, 17/11/2026).
- `issues-github.md`: as 8 issues do fim do relatório, prontas para colar no GitHub.
- `gerar_relatorio.py`: gera os dois arquivos acima.

## Regerar

```bash
python3 -m venv .venv-audit
.venv-audit/bin/pip install reportlab matplotlib
.venv-audit/bin/python docs/security-audit/gerar_relatorio.py
```

Os trechos de código são lidos do commit auditado pelo git, então o relatório continua fiel ao código auditado mesmo depois das correções.
