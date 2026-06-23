# 📁 Compartilhe Arquivos

Site estático hospedado no GitHub Pages para compartilhar arquivos, fotos e vídeos com outras pessoas.

## Como usar

### Visitantes
Acesse `https://kauasantosaluno-tech.github.io` e veja os arquivos disponíveis para download.

### Admin
1. Abra o site e clique em **Modo admin**
2. Preencha a configuração:
   - Usuário e repositório do GitHub
   - Branch (geralmente `main`)
   - Pasta de uploads (padrão: `uploads`)
   - Personal Access Token com permissão `repo`
3. Clique em **Salvar configuração**
4. Arraste arquivos para a área de upload e clique em **Enviar todos**

## Configuração inicial

1. Clone ou faça fork deste repositório
2. Crie a pasta `uploads/` com um arquivo `.gitkeep` dentro
3. Ative o GitHub Pages nas configurações do repositório (branch `main`, pasta `/root`)
4. Gere um [Personal Access Token](https://github.com/settings/tokens) com permissão `repo`

## Tecnologias

- HTML, CSS e JavaScript puro
- GitHub REST API para upload e exclusão de arquivos
- GitHub Pages para hospedagem gratuita

## Segurança

O token de acesso é armazenado apenas no `localStorage` do seu navegador e nunca é enviado para o repositório.
