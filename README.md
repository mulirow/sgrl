# 📅 Sistema de Gerenciamento de Reservas (SGR)

O **SGR** é uma solução web moderna para otimizar o agendamento de espaços e equipamentos em instituições de ensino, como laboratórios e ateliês universitários. O sistema substitui processos manuais e informais por uma plataforma centralizada, transparente e eficiente, resolvendo problemas como conflitos de horário e falta de visibilidade sobre a disponibilidade dos recursos.

## 📖 Índice

🔹 [🚀 Tecnologias](#tecnologias)

🔹 [📋 Pré-requisitos](#pré-requisitos)

🔹 [💾 Instalação](#instalação)

🔹 [⚡ Como Usar](#como-usar)

🔹 [🏛️ Decisões Arquiteturais](#decisões-arquiteturais)

🔹 [📚 Suporte](#suporte)

🔹 [📌 Status do Projeto](#status-do-projeto)

🔹 [🤝 Como Contribuir](#como-contribuir)

## 🚀 Tecnologias

O projeto foi desenvolvido com as seguintes tecnologias:

| 🛠️ Tecnologia       | Descrição                                      |
| :------------------ | :----------------------------------------------- |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | Linguagem principal, garantindo segurança de tipos em todo o projeto. |
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)     | Framework React para a interface, com foco em Server Components para performance. |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) | Framework CSS utility-first para uma estilização rápida e responsiva. |
| ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white) | Coleção de componentes de UI reutilizáveis, acessíveis e customizáveis. |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)       | Banco de dados NoSQL para o armazenamento dos dados da aplicação. |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)       | ORM moderno para interagir de forma segura e intuitiva com o banco de dados. |
| ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextauth&logoColor=white)       | Solução completa de autenticação integrada ao ecossistema Next.js. |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)         | Plataforma para deployment e hospedagem contínua da aplicação. |

---

## 📋 Pré-requisitos

Antes de começar, é necessário ter o seguinte instalado em seu ambiente:

*   **Node.js:** (Versão LTS mais recente recomendada) - [https://nodejs.org/](https://nodejs.org/)
*   **npm:** (Incluído com Node.js) - Verifique a versão com `npm -v`
*   **Git:** (Para clonar o repositório) - [https://git-scm.com/](https://git-scm.com/)

---

## 💾 Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**

    *   Na raiz do projeto, crie um arquivo `.env.local`.
    *   Preencha as variáveis de ambiente necessárias no arquivo `.env.local`:

        ```env
        # Banco de Dados (MongoDB via Prisma)
        DATABASE_URL="sua_string_de_conexao_mongodb"

        # Autenticação (NextAuth.js com Google Provider)
        # Para gerar um AUTH_SECRET, execute no terminal: openssl rand -base64 32
        GOOGLE_CLIENT_ID="seu_google_client_id"
        GOOGLE_CLIENT_SECRET="seu_google_client_secret"

        # Em produção, altere NEXTAUTH_URL para a URL da aplicação
        NEXTAUTH_URL=http://localhost:3000
        NEXTAUTH_SECRET="seu_nextauth_secret"
        ```

4.  **Aplique o schema ao banco de dados:**

    Este comando sincroniza o schema do Prisma com seu banco de dados MongoDB.

    ```bash
    npx prisma db push
    ```

---

## ⚡ Como Usar

1.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

2.  **Acesse a aplicação:**

    Abra seu navegador e acesse `http://localhost:3000`.

---

## 🏛️ Decisões Arquiteturais

O projeto segue uma **Arquitetura de 3 Camadas** em uma aplicação monolítica com Next.js, otimizada para deployment em plataformas Serverless como a Vercel.

*   **Camada de Apresentação:** Construída com componentes React (Server Components por padrão, Client Components para interatividade), estilizados com Tailwind CSS e shadcn/ui.
*   **Camada de Lógica de Negócio:** Implementada com **Server Actions** para mutações de dados (criar, atualizar, deletar) e **API Routes** para buscas complexas ou chamadas que necessitam de um endpoint HTTP explícito.
*   **Camada de Dados:** Gerenciada pelo **Prisma ORM**, que abstrai a comunicação com o banco de dados **MongoDB**.

Essa abordagem maximiza a performance ao renderizar o máximo possível no servidor, mantendo a reatividade onde é necessária e simplificando o fluxo de dados entre cliente e servidor.

---

## 📚 Suporte

Se encontrar qualquer problema ou tiver alguma dúvida, por favor, sinta-se à vontade para:

*   Abrir uma **Issue** no repositório do GitHub.
*   Entrar em contato por e-mail: `mbn2@cin.ufpe.br`

---

## 📌 Status do Projeto

#### Status Atual: 🚀 Em Desenvolvimento

O projeto está sendo ativamente desenvolvido. Novas funcionalidades e melhorias são adicionadas continuamente.

---

## 🤝 Como Contribuir

Para contribuir com o projeto, siga os seguintes passos:

1.  **Faça um Fork** do repositório.
2.  **Crie uma nova branch:** `git checkout -b dev/sua-nova-funcionalidade`
3.  **Faça commit das suas mudanças:** `git commit -m 'feat: adiciona uma nova funcionalidade incrível'`
4.  **Faça push para a branch:** `git push origin dev/sua-nova-funcionalidade`
5.  **Abra um Pull Request:** Envie um pull request detalhando as mudanças propostas.

**Diretrizes:**
*   Siga as convenções de código e estilo do projeto.
*   Escreva mensagens de commit claras e semânticas (ex: Conventional Commits).
*   Documente o código quando necessário.
*   Certifique-se de que suas mudanças não quebrem funcionalidades existentes.