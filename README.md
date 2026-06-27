# Sistema de Ouvidoria – Universidade Católica
 
## 📌 Sobre o Projeto
 
O Sistema de Ouvidoria é uma aplicação web desenvolvida para centralizar o recebimento, acompanhamento e gerenciamento de manifestações realizadas pela comunidade acadêmica da Universidade Católica.
 
A plataforma permite que alunos, professores, colaboradores e demais usuários registrem solicitações, sugestões, reclamações, elogios ou denúncias de forma organizada e segura, garantindo maior transparência e eficiência no processo de atendimento.
 
---
 
## 🎯 Objetivos
 
- Facilitar o envio de manifestações pela comunidade acadêmica.
- Centralizar o gerenciamento dos atendimentos.
- Garantir rastreabilidade e acompanhamento das solicitações.
- Proporcionar maior transparência entre usuários e setores responsáveis.
- Aplicar boas práticas de desenvolvimento seguro e proteção de dados.
 
---
 
## 🛠 Tecnologias Utilizadas
 
### Front-end
- React.js
- TypeScript
- Material UI
 
### Back-end
- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- LINQ
 
### Banco de Dados
- PostgreSQL
 
### Infraestrutura e Deploy
- Railway (API)
- Supabase (Banco de Dados)
- Vercel (Front-end)
 
---
 
## 🏗 Arquitetura
 
```text
Frontend (React)
       │
       ▼
Backend (.NET API)
       │
       ▼
PostgreSQL
```
 
---
 
## 👤 Perfis de Usuário
 
### Usuário Comum ou Solicitante
 
Responsável por registrar manifestações e acompanhar suas próprias solicitações.
 
**Permissões:**
- Criar manifestações.
- Consultar solicitações enviadas.
- Visualizar respostas recebidas.
- Atualizar informações permitidas da solicitação.
- Acompanhar o andamento do atendimento.
 
### Operador, Atendente ou Analista
 
Responsável pelo tratamento operacional das manifestações.
 
**Permissões:**
- Visualizar registros sob sua responsabilidade.
- Responder manifestações.
- Alterar status dos atendimentos.
- Encaminhar solicitações.
- Executar ações intermediárias no fluxo de atendimento.
 
### Administrador, Gestor ou Coordenador
 
Responsável pela gestão completa da plataforma.
 
**Permissões:**
- Gerenciar usuários.
- Gerenciar permissões e perfis.
- Gerenciar categorias de manifestações.
- Gerenciar relatórios.
- Visualizar logs do sistema.
- Executar ações administrativas restritas.
- Configurar parâmetros do sistema.
 
---
 
## 🔐 Funcionalidades de Segurança
 
- Autenticação de usuários.
- Controle de acesso baseado em perfis (RBAC).
- Criptografia de senhas.
- Proteção contra SQL Injection utilizando Entity Framework Core.
- Validação de dados no cliente e servidor.
- Comunicação segura via HTTPS.
- Registro de logs para auditoria.
- Controle de permissões para acesso aos recursos.
- Rastreabilidade das ações realizadas pelos usuários.
 
---
 
## 📋 Categorias de Manifestação
 
- Reclamação
- Sugestão
- Elogio
- Denúncia
- Solicitação
- Outros
 
---
 
## ⚙️ Funcionalidades do Sistema
 
### Gestão de Manifestações
 
- Cadastro de manifestações.
- Consulta por protocolo.
- Alteração de status.
- Histórico de movimentações.
- Registro de respostas.
 
### Gestão Administrativa
 
- Cadastro de usuários.
- Controle de perfis e permissões.
- Gerenciamento de categorias.
- Auditoria e logs.
- Relatórios gerenciais.
 
---

---

## Entidades Principais 

O sistema de Ouvidoria Institucional foi estruturado com entidades responsáveis por representar os principais elementos do negócio e garantir a organização das informações armazenadas.

### Usuário

Representa qualquer pessoa que utiliza o sistema, podendo atuar como solicitante, operador ou administrador.

**Principais atributos:**
- Id
- Nome
- E-mail
- Senha
- Perfil
- Data de Cadastro
- Status

### Manifestação

Representa uma solicitação, reclamação, sugestão, elogio ou denúncia registrada por um usuário.

**Principais atributos:**
- Id
- Número de Protocolo
- Título
- Descrição
- Data de Criação
- Status
- Usuário Responsável
- Categoria

### Categoria

Responsável por classificar as manifestações registradas no sistema.

**Principais atributos:**
- Id
- Nome
- Descrição

**Categorias disponíveis:**
- Reclamação
- Sugestão
- Elogio
- Denúncia
- Solicitação
- Outros

### Resposta

Armazena as respostas fornecidas pelos operadores ou administradores às manifestações cadastradas.

**Principais atributos:**
- Id
- Manifestação
- Usuário Responsável
- Mensagem
- Data da Resposta

### Histórico de Movimentação

Registra todas as alterações realizadas em uma manifestação durante o fluxo de atendimento, permitindo rastreabilidade completa das ações executadas.

**Principais atributos:**
- Id
- Manifestação
- Status Anterior
- Novo Status
- Data da Alteração
- Usuário Responsável

### Log de Auditoria

Responsável pelo armazenamento dos registros de atividades executadas pelos usuários no sistema, contribuindo para a segurança e conformidade da plataforma.

**Principais atributos:**
- Id
- Usuário
- Ação Executada
- Data e Hora
- Endereço IP
- Comentarios

## Relacionamentos

- Um usuário pode criar várias manifestações.
- Cada manifestação pertence a uma única categoria.
- Uma manifestação pode possuir várias respostas.
- Uma manifestação pode possuir diversos registros de histórico de movimentação.
- Um usuário pode gerar diversos registros de auditoria durante a utilização do sistema.

Essas entidades compõem a base estrutural da aplicação, permitindo o gerenciamento eficiente das manifestações, o controle de acesso baseado em perfis e a rastreabilidade das operações realizadas na plataforma.

-----

## Ativos do sistema

**Dados:**

- Dados pessoais de usuários
- Credenciais de Usuários
- Dados acadêmicos de usuários
- Credenciais de administradores
- Manifestações registradas
- Respostas de ouvidorias registradas
- Histórico de atendimento
- Logs de auditoria
- Logs de acesso
- Sessão dos usuários
- Configuração do sistema

**Software:**

- Aplicação fron-end
- Componentes da interface via MaterialUI
- API
- Token JWT
- Chave da API
- Secrets
- Variáveis de ambiente
- Perfis/permissões de acesso
- Biblioteca e dependências de terceiros
- Código fonte
- Repositório

**Banco:**

- Banco de dados
- Tabelas do banco
- Backup do banco

**Infraestrutura:**

- Hospedagem da API via Railway
- Hospedagem do banco via Supabase
- Hospedagem do front via Vercel

-----

# 🚀 Instruções de Execução

Este documento descreve o processo para executar o **Sistema de Ouvidoria** em ambiente de desenvolvimento local.

O projeto é composto por:

- **Back-end:** .NET 10 (ASP.NET Core + Entity Framework Core)
- **Front-end:** React.js + Vite
- **Banco de Dados:** PostgreSQL (local ou Supabase)

---

# 1. Pré-requisitos

Antes de iniciar, certifique-se de possuir os seguintes softwares instalados:

- Git
- Node.js **18** ou superior
- npm (ou Yarn)
- .NET SDK **10**
- PostgreSQL local **ou** uma conta no Supabase

---

# 2. Clonando o Repositório

Abra o terminal e execute:

```bash
git clone https://github.com/GabrielVitorioGoncalves/OuvidoriaCatolica.git
cd OuvidoriaCatolica
```

---

# 3. Configuração do Banco de Dados

O projeto utiliza PostgreSQL.

Você pode utilizar:

- PostgreSQL instalado localmente;
- Banco hospedado no Supabase.

## Utilizando o Supabase

1. Acesse o painel do Supabase.
2. Entre em **Database**.
3. Copie a **Connection String**.

Ela deve possuir um formato semelhante a:

```text
Host=SEU_HOST;
Port=5432;
Database=postgres;
Username=postgres;
Password=SUA_SENHA;
SSL Mode=Require;
Trust Server Certificate=true;
```

---

# 4. Configuração do Back-end (.NET 10)

A API utiliza o Entity Framework Core para gerenciamento do banco de dados.

## 4.1 Acesse a pasta da API

```bash
cd src/Backend
```

---

## 4.2 Restaure as dependências

```bash
dotnet restore
```

---

## 4.3 Configure a Connection String

Edite o arquivo:

```
appsettings.Development.json
```

Altere o conteúdo para:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "SUA_CONNECTION_STRING"
  }
}
```

---

## 4.4 Execute as migrações

Esse comando criará automaticamente todas as tabelas no banco.

```bash
dotnet ef database update
```

---

## 4.5 Execute a API

```bash
dotnet run
```

Ao iniciar, será exibido um endereço semelhante a:

```
http://localhost:5000
```

ou

```
https://localhost:7000
```

Anote a porta utilizada, pois ela será necessária no Front-end.

---

# 5. Configuração do Front-end (React + Vite)

Abra um **novo terminal**.

---

## 5.1 Acesse a pasta do Front-end

```bash
cd src/Frontend
```

---

## 5.2 Instale as dependências

```bash
npm install
```

---

## 5.3 Configure o arquivo `.env`

Crie um arquivo chamado:

```
.env
```

Na raiz do Front-end.

Adicione:

```env
VITE_API_URL=http://localhost:5000/api
```

> **Importante:** Ajuste a porta conforme a utilizada pela API (`dotnet run`).

---

## 5.4 Execute o Front-end

```bash
npm run dev
```

O Vite iniciará o servidor de desenvolvimento e exibirá um endereço semelhante a:

```
http://localhost:5173
```

Abra esse endereço no navegador.

---

# Estrutura do Projeto

```
OuvidoriaCatolica
│
├── src
│   ├── Backend
│   │   ├── Controllers
│   │   ├── Models
│   │   ├── Services
│   │   ├── Data
│   │   └── Program.cs
│   │
│   └── Frontend
│       ├── src
│       ├── public
│       ├── package.json
│       └── vite.config.ts
│
└── README.md
```

---

# Fluxo de Execução

1. Clone o repositório.
2. Configure a Connection String do PostgreSQL.
3. Execute as migrações do Entity Framework.
4. Inicie a API (`dotnet run`).
5. Configure a variável `VITE_API_URL`.
6. Execute o Front-end (`npm run dev`).
7. Acesse a aplicação pelo navegador.

---

# Observações

- O Back-end deve estar em execução antes de iniciar o Front-end.
- Caso utilize outra porta para a API, atualize a variável `VITE_API_URL`.
- Sempre que novas migrações forem adicionadas ao projeto, execute novamente:

```bash
dotnet ef database update
```

para manter o banco sincronizado com o modelo da aplicação.

---
 
## 👨‍💻 Equipe
 
Desenvolvido por:
 
- Gabriel Vitório Gonçalves
- Guilherme Halter Nunes
- João Vitor Bagatoli
- Lucas Leal
- Wedley Silva Schmoeller
 
---
 
## 📄 Licença
 
Projeto desenvolvido exclusivamente para fins acadêmicos e educacionais.
