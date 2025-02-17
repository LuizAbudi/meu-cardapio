# Meu Cardápio

Meu Cardápio é uma aplicação web para gerenciar e exibir cardápios de restaurantes de forma dinâmica e amigável. Utiliza Next.js para renderização eficiente e MongoDB como banco de dados, eliminando a necessidade de um backend tradicional.

## Funcionalidades

- Visualização de itens do cardápio com descrições e preços.
- Categorias de itens para facilitar a navegação.
- Interface responsiva para dispositivos móveis e desktops.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização no lado do servidor e geração de sites estáticos.
- **MongoDB**: Banco de dados NoSQL orientado a documentos.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e consistente.

## Por que Next.js e MongoDB sem Backend?

- **Renderização no Lado do Servidor (SSR) com Next.js**: Proporciona carregamento mais rápido. O conteúdo é pré-renderizado e enviado ao cliente, melhorando a experiência do usuário.
- **Integração Direta com MongoDB**: Permite operações de banco de dados sem a necessidade de uma camada de API separada, simplificando a arquitetura da aplicação.
- **Simplificação da Arquitetura**: Elimina a camada de backend tradicional, resultando em uma aplicação mais leve e eficiente.

## Autenticação
- **Autenticação com o MongoDB**: É utilizado as credenciais do MongoDB para autenticação.
- **Painel de Administração**: Acessar a rota `/admin` para adicionar, editar e remover itens do cardápio.

## Pré-requisitos

- Node.js versão 14 ou superior.
- Gerenciador de pacotes npm, yarn ou pnpm.
- Uma instância do MongoDB acessível (local ou MongoDB Atlas).

## Como Executar o Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/LuizAbudi/meu-cardapio.git
   cd meu-cardapio
   ```

2. **Instale as dependências:**

   ```bash
   # Usando npm
   npm install

   # Ou usando yarn
   yarn install

   # Ou usando pnpm
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env.local` na raiz do projeto com a seguinte variável:

   ```env
   MONGODB_URI=sua_string_de_conexao_mongodb
   ```

   Substitua `sua_string_de_conexao_mongodb` pela string de conexão do seu MongoDB.

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   # Usando npm
   npm run dev

   # Ou usando yarn
   yarn dev

   # Ou usando pnpm
   pnpm dev
   ```

5. **Abra o navegador e acesse:**

   ```
   http://localhost:3000
   ```

   A aplicação será recarregada automaticamente conforme você fizer alterações no código.
