# cat — visualizador de arquivos

Carregue arquivos do seu computador e visualize o conteúdo deles direto no navegador. Markdown é renderizado formatado, código ganha destaque de sintaxe, e nada sai da sua máquina — tudo roda localmente.

**[➜ Abrir o visualizador](https://SEU-USUARIO.github.io/SEU-REPOSITORIO/)**

## O que ele faz

- Arrastar e soltar (ou clicar para escolher) vários arquivos de uma vez
- `.md` é renderizado como Markdown formatado, com opção de ver o texto bruto
- Código (`.js`, `.py`, `.json`, `.html`, etc.) com destaque de sintaxe
- Imagens (`.png`, `.jpg`, `.svg`, ...) exibidas inline
- Lista lateral para alternar entre os arquivos carregados
- 100% local: a leitura é feita pelo navegador, nenhum arquivo é enviado para servidor algum

## Como usar

### Online
Acesse o link do GitHub Pages acima e carregue os arquivos.

### Local
Não precisa instalar nada — é um único arquivo HTML.

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

Depois é só abrir o `index.html` no navegador (clique duplo, ou):

```bash
# Linux
xdg-open index.html

# macOS
open index.html

# Windows
start index.html
```

Se preferir servir por um servidor local (opcional):

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Ativar o GitHub Pages

1. No repositório, vá em **Settings → Pages**
2. Em **Source**, selecione a branch `main` e a pasta `/ (root)`
3. Salve — o site fica disponível em `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/` em alguns minutos

## Estrutura

```
.
├── index.html   # site completo (HTML + CSS + JS em um único arquivo)
└── README.md
```

## Tecnologias

- HTML, CSS e JavaScript puro (sem build, sem dependências de instalação)
- [marked](https://github.com/markedjs/marked) para renderização de Markdown
- [highlight.js](https://github.com/highlightjs/highlight.js) para destaque de sintaxe
