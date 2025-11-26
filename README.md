# 🎮 GameLog | React Edition

> **Disciplina:** Programação Web  
> **Versão:** 2.0 (Migração para SPA)  
> **Status:** 🚀 Front-end Funcional & Interativo

---

## 📄 Sobre o Projeto

O **GameLog** evoluiu. O que antes era apenas uma maquete estática, agora é uma **Single Page Application (SPA)** moderna, desenvolvida com **React** e **TypeScript**.

O objetivo desta fase foi transformar a interface estática em um sistema dinâmico, componentizado e escalável. O projeto simula um "hub" onde jogadores podem catalogar os seus jogos, visualizar detalhes técnicos e acessar ferramentas administrativas, tudo isso com navegação instantânea (*client-side routing*) e um design responsivo.

---

## ✨ Funcionalidades Principais

### 1. Navegação SPA (Single Page Application)
Diferente da versão anterior, a navegação entre páginas é instantânea, sem recarregamento do navegador, proporcionando uma experiência de utilizador fluida (*App-like*) graças ao **React Router**.

### 2. Catálogo e Detalhes de Jogos
* **Vitrine Interativa:** Visualização de jogos em destaque (Hades, Bloons TD 6, Elden Ring) com cards responsivos.
* **Páginas Internas:** Rotas dedicadas para cada jogo, exibindo sinopse, ficha técnica e trailers integrados.

### 3. Painel Administrativo e Autenticação
* **Login Simulado:** Interface de login com validação visual e redirecionamento.
* **Dashboard Admin:** Painel exclusivo para gestão de utilizadores, contendo tabelas estilizadas e botões de ação (CRUD Visual).

### 4. Sandbox Académico (Área Protegida)
Uma área exclusiva para demonstração de atividades práticas da disciplina, protegida por um componente **Password Gate** (simulação de rota privada).
* **Atividade 3:** Manipulação de listas e imagens dinâmicas.
* **Atividade 4:** Integração de multimédia (Áudio e Vídeo externos).
* **Atividade 5:** Documentação interativa da Paleta de Cores "Neon Noturno".

---

## 🎨 Design System: "Neon Noturno"

O projeto adota uma identidade visual própria, construída sobre o **Bootstrap 5**, mas com pesada personalização via CSS.

* **Tema Escuro (Dark Mode):** Fundo em azul profundo (`#0D1117`) para conforto visual.
* **Acentos Cyberpunk:** Uso da cor Magenta (`#E839C2`) para botões e links, criando alto contraste.
* **Responsividade:** Layout adaptável para Mobile, Tablet e Desktop.

---

## 🛠 Tecnologias e Ferramentas

O projeto foi reconstruído do zero utilizando a stack moderna do React:

* **React 19:** Biblioteca principal para construção da interface baseada em componentes.
* **Vite:** Ferramenta de build de última geração para desenvolvimento rápido e HMR (*Hot Module Replacement*).
* **TypeScript:** Tipagem estática para maior segurança e manutenção do código.
* **React Router Dom (v7):** Gestão de rotas e navegação interna.
* **Bootstrap 5:** Framework base para o sistema de grid e componentes responsivos.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação em ambiente de desenvolvimento:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Inicie o servidor local:**
    ```bash
    npm run dev
    ```

3.  **Aceda no navegador:**
    O terminal exibirá o link local (geralmente `http://localhost:5173/`).

---

### 🧩 Destaques de Código (Conceitos Aplicados)

* **Componentização:** Reutilização de elementos como `Navbar`, `Footer` e `PasswordGate`.
* **Hooks:** Uso de `useState` para gestão de estado (ex: controlo de senha no Sandbox).
* **Rotas Protegidas:** Implementação de lógica condicional para restringir acesso a determinadas áreas.
* **Clean Code:** Separação clara entre lógica, estrutura e estilo.

---

<p align="center">
  Desenvolvido por <strong>[Seu Nome]</strong>
</p>
