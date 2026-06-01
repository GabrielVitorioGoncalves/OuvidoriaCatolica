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
