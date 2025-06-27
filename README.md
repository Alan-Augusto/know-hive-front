# 🐝 KnowHive

> *"Nenhum de nós é tão inteligente quanto todos nós juntos."*

Uma plataforma colaborativa moderna para criação, organização e compartilhamento de conhecimento através de questões e coleções interativas.

![Angular](https://img.shields.io/badge/Angular-19.1.0-DD0031?style=flat&logo=angular&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-19.0.7-007ACC?style=flat&logo=primeng&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=flat&logo=typescript&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5.0-FF6384?style=flat&logo=chart.js&logoColor=white)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [API](#-api)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

O **KnowHive** é uma aplicação web desenvolvida em Angular que permite aos usuários criar, organizar e compartilhar conhecimento de forma colaborativa. A plataforma funciona como uma "colmeia de conhecimento" onde usuários podem:

- Criar questões interativas com múltiplas alternativas
- Organizar questões em coleções temáticas
- Compartilhar conteúdo com outros usuários
- Acompanhar estatísticas de desempenho
- Buscar publicamente por conteúdo relevante

## ✨ Funcionalidades

### 🔐 Autenticação e Perfil
- Sistema completo de login e registro
- Gerenciamento de perfil de usuário
- Controle de acesso baseado em permissões

### 📝 Gestão de Questões
- **Criação**: Desenvolva questões com múltiplas alternativas
- **Edição**: Modifique questões existentes
- **Compartilhamento**: Conceda acesso a outros usuários com diferentes níveis de permissão
- **Sistema de Likes**: Favorite questões interessantes
- **Tags**: Organize questões por categorias
- **Estatísticas**: Acompanhe o desempenho das suas questões

### 📚 Coleções
- **Organização**: Agrupe questões relacionadas em coleções
- **Compartilhamento Colaborativo**: Permita que outros usuários visualizem, editem ou administrem suas coleções
- **Geração de Testes**: Crie testes automatizados a partir das coleções
- **Controle de Acesso**: Defina permissões específicas para cada usuário

### 🔍 Busca Pública
- Explore questões e coleções públicas
- Sistema de filtros avançados
- Visualização de conteúdo compartilhado pela comunidade

### 📊 Dashboard e Estatísticas
- **Visão Geral**: Dashboard principal com métricas importantes
- **Estatísticas Detalhadas**: 
  - Questões criadas e respondidas
  - Precisão de respostas
  - Coleções com acesso
  - Items compartilhados
  - Tags mais utilizadas
- **Gráficos Interativos**: Visualizações com Chart.js

### 🤝 Compartilhamento Avançado
- **Níveis de Permissão**:
  - **Visualização**: Apenas ver o conteúdo
  - **Edição**: Modificar questões e coleções
  - **Administração**: Controle total, incluindo compartilhamento
- **Gestão de Usuários**: Adicione/remova usuários e altere permissões

## 🛠 Tecnologias Utilizadas

### Frontend
- **[Angular 19.1.0](https://angular.io/)** - Framework principal
- **[PrimeNG 19.0.7](https://primeng.org/)** - Biblioteca de componentes UI
- **[PrimeFlex 4.0.0](https://primeflex.org/)** - Sistema de layout CSS
- **[Chart.js 4.5.0](https://www.chartjs.org/)** - Gráficos e visualizações
- **[SCSS](https://sass-lang.com/)** - Pré-processador CSS

### Ferramentas de Desenvolvimento
- **TypeScript 5.7.2** - Linguagem de programação
- **Angular CLI** - Ferramentas de linha de comando
- **Jasmine & Karma** - Testes unitários

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.x ou superior)
- **npm** (versão 9.x ou superior)
- **Angular CLI** (versão 19.x ou superior)

```bash
# Verificar versões instaladas
node --version
npm --version
ng version
```

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/alan-augusto/know-hive-front.git
cd know-hive-front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente**
   
   Edite os arquivos de ambiente conforme necessário:
   - `src/environments/environment.ts` - Desenvolvimento
   - `src/environments/environment.prod.ts` - Produção
   - `src/environments/environment.qas.ts` - Testes

4. **Execute a aplicação**
```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`

## 💻 Como Usar

### Primeiros Passos

1. **Acesse a aplicação** em `http://localhost:4200`
2. **Registre-se** criando uma nova conta
3. **Faça login** com suas credenciais
4. **Explore o dashboard** para ver uma visão geral

### Criando Questões

1. Navigate para **Questões** no menu lateral
2. Clique em **"Nova Questão"**
3. Preencha o título, enunciado e alternativas
4. Adicione tags para categorização
5. Defina se a questão será pública ou privada
6. Salve e comece a compartilhar!

### Organizando em Coleções

1. Vá para **Coleções** no menu
2. Crie uma **"Nova Coleção"**
3. Adicione questões relacionadas
4. Configure permissões de acesso
5. Compartilhe com outros usuários

### Compartilhamento

1. Selecione a questão ou coleção desejada
2. Clique no ícone de **compartilhamento**
3. Digite o email do usuário
4. Escolha o nível de permissão
5. Confirme o compartilhamento

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── auth-base/       # Base para autenticação
│   │   ├── base/           # Componentes base
│   │   ├── button-*/       # Componentes de botões
│   │   ├── dynamic-data-view/ # Visualização dinâmica de dados
│   │   ├── menu/           # Menu de navegação
│   │   └── ...
│   ├── features/           # Módulos funcionais
│   │   ├── authentication/ # Sistema de auth
│   │   ├── collections/    # Gestão de coleções
│   │   ├── home-v1/       # Dashboard principal
│   │   ├── questions/     # Gestão de questões
│   │   ├── public-search/ # Busca pública
│   │   ├── statistics/    # Estatísticas
│   │   └── ...
│   ├── services/          # Serviços da aplicação
│   │   ├── auth/          # Autenticação
│   │   ├── collections/   # API de coleções
│   │   ├── questions/     # API de questões
│   │   ├── users/         # Gestão de usuários
│   │   └── ...
│   ├── entity/           # Interfaces TypeScript
│   └── environments/     # Configurações de ambiente
├── assets/              # Recursos estáticos
└── ...
```

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o servidor de desenvolvimento
npm run watch          # Build com watch mode

# Build
npm run build          # Build para desenvolvimento
npm run build:prod     # Build para produção

# Testes
npm test              # Executa testes unitários
npm run test:watch    # Testes em modo watch

# Servidor
npm run serve:prod    # Serve a versão de produção
```

## 🌐 API

A aplicação se conecta com uma API backend. Configure a URL da API nos arquivos de ambiente:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000' // URL da API local
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://know-hive-api-v2.onrender.com' // URL da API de produção
};
```

### Principais Endpoints

- **Autenticação**: `/auth/login`, `/auth/register`
- **Questões**: `/questions/*`
- **Coleções**: `/collections/*`
- **Usuários**: `/users/*`
- **Estatísticas**: `/users/:id/statistics`

## 🎨 Temas e Personalização

O projeto utiliza PrimeNG com suporte a temas customizáveis. Os temas são configurados em:

- `src/app/mypreset.ts` - Configurações personalizadas
- `src/styles.scss` - Estilos globais

## 🤝 Contribuição

Contribuições são muito bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Diretrizes de Contribuição

- Siga os padrões de código existentes
- Escreva testes para novas funcionalidades
- Documente mudanças significativas
- Use commits semânticos

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE). Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Alan Augusto** - *Desenvolvimento inicial* - [@alan-augusto](https://github.com/alan-augusto)

## 🙏 Agradecimentos

- Equipe do Angular por um framework incrível
- PrimeNG pela excelente biblioteca de componentes
- Comunidade open source por todas as contribuições

---

<div align="center">
  <strong>🐝 Construído com ❤️ para compartilhar conhecimento</strong>
</div>
