# Projeto Integrador — Grupo 06

Projeto Integrador desenvolvido para o curso de Análise e Desenvolvimento de Sistemas do Centro Universitário Senac.

## Integrantes

- Henrique Meireles Bravim
- Bruno de Souza Scramignon Costa
- Davi Freitas de Moura Bina
- Sabrina Aparecida Alves
- Integrante 5

## Objetivo

Desenvolvimento de uma Prova de Conceito de um sistema acadêmico para centralização de informações do aluno.

## Prova de Conceito

A PoC implementa a jornada do aluno, incluindo:

- autenticação por e-mail ou CPF;
- validação de senha;
- controle básico de sessão no navegador;
- painel com dados acadêmicos;
- consulta de histórico e faltas;
- logout.

## Tecnologias atuais

- HTML5;
- CSS3;
- JavaScript;
- JSON como base de dados simulada da PoC;
- `localStorage` para manter a sessão durante a demonstração.

## Como executar

O projeto usa `fetch()` para ler o arquivo `dados.json`. Por isso, não abra os arquivos HTML diretamente pelo caminho `file:///`.

### Usando o VS Code + Live Server

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**, caso ainda não tenha.
3. Abra `HTML/index.html`.
4. Clique em **Open with Live Server**.
5. A aplicação deverá abrir em um endereço semelhante a `http://127.0.0.1:5500/HTML/index.html`.

## Credenciais de demonstração

### Carlos

- E-mail: `carlos.amador@gestaoacademica.com.br`
- CPF: `123.456.789-00` ou `12345678900`
- Senha: `123456`

### Ana

- E-mail: `ana.maria@gestaoacademica.com.br`
- CPF: `987.654.321-11` ou `98765432111`
- Senha: `654321`

## Observação sobre segurança

A autenticação atual é uma simulação de frontend para a Prova de Conceito. As senhas estão armazenadas em `dados.json` e, portanto, **não representam uma implementação segura para produção**. Em uma versão posterior, a validação deverá ser realizada por um backend, com senhas armazenadas de forma segura (hash) em banco de dados.
