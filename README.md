# Projeto Integrador — Grupo 06

Projeto desenvolvido para o curso de Análise e Desenvolvimento de Sistemas do Centro Universitário Senac.

## Integrantes

- Henrique Meireles Bravim
- Bruno de Souza Scramignon Costa
- Davi Freitas de Moura Bina
- Sabrina Aparecida Alves

## Sobre o projeto

O projeto consiste em uma Prova de Conceito de um sistema acadêmico voltado para a jornada do aluno.

A proposta é permitir que o aluno consulte em um único lugar algumas informações importantes da vida acadêmica.

## Funcionalidades

Atualmente o sistema possui:

- login por e-mail ou CPF;
- validação de senha;
- dashboard do aluno;
- consulta de notas;
- histórico escolar;
- consulta de faltas;
- cálculo de presença;
- consulta de horários;
- avisos acadêmicos;
- tema claro e escuro;
- logout.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- JSON
- LocalStorage
- Git e GitHub

Nesta versão da PoC, o arquivo `dados.json` é utilizado como uma base de dados simulada.

## Estrutura do projeto

```text
CSS/
HTML/
JS/
dados.json
README.md
```

A tela inicial do sistema está em:

```text
HTML/index.html
```

O painel do aluno está em:

```text
HTML/dashboard.html
```

## Como executar o projeto

O projeto precisa ser executado através de um servidor local, porque o JavaScript utiliza `fetch()` para carregar os dados do arquivo `dados.json`.

Por isso, não recomendamos abrir o `index.html` diretamente pelo explorador de arquivos.

### Opção 1 — VS Code com Live Server

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**, caso ainda não tenha.
3. Abra o arquivo:

```text
HTML/index.html
```

4. Clique com o botão direito e escolha:

```text
Open with Live Server
```

O navegador deverá abrir em um endereço parecido com:

```text
http://127.0.0.1:5500/HTML/index.html
```

### Opção 2 — Servidor com Python

Também é possível executar o projeto pelo terminal.

Abra o terminal na pasta raiz do projeto e execute:

```bash
py -m http.server 5500
```

Caso esse comando não funcione, tente:

```bash
python -m http.server 5500
```

Depois acesse no navegador:

```text
http://localhost:5500/HTML/index.html
```

Para encerrar o servidor:

```text
Ctrl + C
```

## Scripts

Os arquivos JavaScript não precisam ser executados manualmente.

Ao abrir a aplicação pelo servidor local, os scripts são carregados automaticamente pelas páginas HTML.

Não é necessário utilizar comandos como:

```bash
node JS/script.js
```

## Usuários de teste

### Carlos

```text
E-mail: carlos.amador@gestaoacademica.com.br
CPF: 123.456.789-00
Senha: 123456
```

### Ana

```text
E-mail: ana.maria@gestaoacademica.com.br
CPF: 987.654.321-11
Senha: 654321
```

### Mariana

Usuária criada para testar diferentes situações de notas e faltas.

```text
E-mail: teste.cenarios@gestaoacademica.com.br
CPF: 529.982.247-25
Senha: 123456
```

## Teste básico da aplicação

Para testar o sistema:

1. inicie o servidor local;
2. acesse a tela de login;
3. entre com um dos usuários de teste;
4. confira os dados do aluno;
5. teste notas, histórico, faltas, horários e avisos;
6. teste o tema claro e escuro;
7. faça logout.

## Observação

A autenticação desta versão é apenas uma simulação para a Prova de Conceito.

As informações dos alunos e as senhas estão armazenadas em `dados.json`, portanto essa implementação não deve ser utilizada em produção.

Em uma versão futura, a ideia é utilizar backend e banco de dados para realizar a autenticação e armazenar os dados de forma adequada.
