# Acervo — Site pessoal de arquivos

Site estático para GitHub Pages. Permite publicar PDFs, imagens, documentos e outros arquivos com preview interativo.

## Configuração inicial

### 1. Crie o repositório no GitHub

- Acesse github.com → **New repository**
- Nome: `seuusuario.github.io` (substitua pelo seu username)  
  *(ou qualquer nome — o site ficará em `seuusuario.github.io/nome-do-repo`)*
- Deixe **Public**
- Clique em **Create repository**

### 2. Suba os arquivos

Faça upload de todos os arquivos deste projeto para a raiz do repositório:
- `index.html`
- `posts.json`
- `admin/index.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `assets/js/admin.js`
- `uploads/` (pasta vazia por enquanto)

### 3. Ative o GitHub Pages

- No repositório: **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: `main` / `(root)`
- Clique **Save**

Após ~1 minuto, seu site estará em `https://seuusuario.github.io`.

---

## Como publicar arquivos

1. Acesse `https://seuusuario.github.io/admin/` (ou `/admin/index.html`)
2. Selecione o arquivo e preencha o título
3. Clique em **Preparar publicação**
4. Baixe o `posts.json` gerado
5. No GitHub:
   - Suba o arquivo original para a pasta `uploads/` com o nome exibido
   - Substitua o `posts.json` na raiz
6. Pronto! O site exibe a publicação.

---

## Estrutura de arquivos

```
/
├── index.html          ← Feed público
├── posts.json          ← Lista de publicações (gerenciado pelo admin)
├── admin/
│   └── index.html      ← Painel de gerenciamento
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── main.js     ← Lógica do feed público
│       └── admin.js    ← Lógica do painel admin
└── uploads/            ← Seus arquivos ficam aqui
    └── (seus arquivos)
```
