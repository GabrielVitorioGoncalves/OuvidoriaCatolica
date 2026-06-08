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

## 🎓 Projeto Acadêmico
 
Projeto desenvolvido para a disciplina de Segurança da Informação da Universidade Católica.
 
O objetivo é aplicar conceitos de desenvolvimento seguro, autenticação, controle de acesso, proteção de dados e boas práticas de engenharia de software na construção de uma plataforma de ouvidoria institucional.
 
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
