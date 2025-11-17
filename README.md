# Sistema de Gestão de Estoque e Caixa - Frontend (Angular)

Este repositório contém o código-fonte do **Frontend** para o Sistema de Gestão de Estoque e Caixa. A aplicação é construída em **Angular 17** e utiliza a biblioteca de componentes **PrimeNG**.

Este projeto consome a API RESTful construída em Spring Boot. Para o funcionamento completo, o [servidor backend](https://github.com/TheoSilvaSa/gestao-estoque-api-backend) deve estar em execução.

## 🎯 Objetivo do Projeto

Desenvolver um sistema web para controle de estoque, registro de vendas (caixa) e gestão de usuários, aplicando conceitos modernos de frontend como:
* Arquitetura Cliente-Servidor.
* Componentes "Standalone" do Angular.
* **Formulários Reativos** (Reactive Forms) para validação.
* **Rotas Protegidas (Guards)** para controle de acesso por perfil.

## 🛠️ Tecnologias Utilizadas

* **Angular 17**
* **PrimeNG 17** (para componentes de UI)
* **PrimeIcons** (para iconografia)
* **TypeScript**
* **RxJS** (para programação reativa)

## 🚀 Como Executar o Projeto

### Pré-requisitos

1.  **Node.js** (versão 18.13.0 ou superior).
2.  **Angular CLI** (versão 17 ou superior).
3.  O **servidor Backend** (`gestao-estoque-api-backend`) deve estar em execução no `http://localhost:8080`.

### Passos

1.  **Clonar o Repositório:**
    ```bash
    git clone [https://github.com/gustavorezende21/gestao-estoque-api-frontend.git](https://github.com/gustavorezende21/gestao-estoque-api-frontend.git)
    cd gestao-estoque-api-frontend
    ```

2.  **Instalar as Dependências:**
    ```bash
    npm install
    ```

3.  **Executar o Servidor de Desenvolvimento:**
    ```bash
    ng serve --open
    ```
    O comando acima inicia o servidor (script `start`) e abre o navegador automaticamente em `http://localhost:4200/`.

## ✨ Funcionalidades Implementadas

O frontend implementa todas as funcionalidades solicitadas no documento do projeto:

* **Autenticação (Módulo 2.1):**
    * Tela de login com e-mail e senha.
    * Uso de formulário reativo para validação.
    * Gerenciamento de sessão via `localStorage` (Token, Nome, Perfil).

* **Layout Principal e Guards (Módulo 2.1 / N-F):**
    * Layout principal (`LayoutComponent`) que exibe o nome do usuário e o botão "Sair".
    * Menu lateral (`p-sidebar`) com navegação dinâmica baseada no perfil do usuário (ADMIN ou OPERADOR).
    * `authGuard` para proteger o layout principal (só entra logado).
    * `roleGuard` para proteger rotas específicas de Admin e Operador.
    * Tela de "Dashboard" como página inicial pós-login.

* **Manter Usuários (Módulo 2.2 - Admin):**
    * CRUD completo (Listar, Cadastrar, Editar, Excluir).
    * Uso de `p-table` para listagem e `p-dialog` (modal) para formulários.
    * Uso de `p-confirmDialog` para exclusão.

* **Gestão de Estoque (Módulo 2.3 - Admin):**
    * **CRUD de Produtos:** CRUD completo (Listar, Cadastrar, Editar, Excluir).
    * **Movimentações:** Tela para registrar Entradas e Ajustes.
    * **Histórico:** Tabela com o histórico de todas as movimentações (Entradas, Ajustes e Saídas de Venda).

* **Caixa / Vendas (Módulo 2.4 - Operador):**
    * Interface de Ponto de Venda (PDV).
    * `p-autoComplete` para buscar produtos da API (com visualização de estoque).
    * Validação de estoque no frontend antes de adicionar ao carrinho.
    * Cálculo de subtotal e total em tempo real.
    * Formulário de pagamento para inserir o valor recebido e finalizar a venda.

* **Relatórios (Módulo 2.5 - Ambos):**
    * Formulário com filtros por Data, Valor e ID do Usuário.
    * Exibição de somatórios (Total de Vendas e Total de Itens Vendidos).
    * Tabela com a lista de vendas filtradas.
