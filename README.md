# KnowHive Frontend

Este repositório contém a interface web da plataforma **KnowHive**, um sistema colaborativo e educacional voltado para a criação, organização e compartilhamento de questões acadêmicas. A aplicação foi desenvolvida como parte do Trabalho de Conclusão de Curso (TCC) do Bacharelado em Sistemas de Informação da UFMG, seguindo uma abordagem modular, escalável e alinhada aos princípios de Engenharia de Software Moderna.

## ✨ Visão Geral

O frontend da KnowHive é construído utilizando **Angular 16+** com **TypeScript**, e integra componentes do **PrimeNG** para oferecer uma interface responsiva, moderna e acessível. A aplicação interage com uma API RESTful (desenvolvida em Node.js) para gerenciar usuários, autenticação e dados educacionais.

## 📌 Funcionalidades Principais

As funcionalidades já implementadas no frontend incluem:

- **Autenticação de Usuários**:
  - Verificação de e-mail com redirecionamento automático para login ou cadastro.
  - Integração visual com login via Google (mockado inicialmente).

- **Login**:
  - Autenticação com e-mail e senha.
  - Armazenamento seguro do token JWT no `localStorage`.

- **Registro de Usuários**:
  - Formulário preparado para cadastro com validação de e-mails e senhas.

- **Componentes de UI Reutilizáveis**:
  - Demonstração de tema escuro e claro.
  - Estilo customizado com tema `Noir` baseado no preset `Aura` do PrimeNG.

- **Tratamento de Erros e Notificações**:
  - Serviço centralizado de notificações (`NotificationService`) com suporte a mensagens de sucesso, erro e informação.

- **Serviços Compartilhados**:
  - `UserService`, `LoggedUserService`, `UtilsService`, entre outros.

- **Roteamento com Lazy Loading**:
  - Navegação entre páginas com carregamento sob demanda (eager/lazy components).

## 🧩 Estrutura do Projeto

```text
src/
├── app/
│   ├── features/           # Componentes funcionais (login, registro, autenticação, 404)
│   ├── services/           # Serviços responsáveis por comunicação com API e lógica auxiliar
│   ├── components/         # Componentes de interface reutilizáveis
│   ├── entity/             # Interfaces e contratos de dados
│   ├── app.routes.ts       # Rotas da aplicação
│   ├── app.config.ts       # Configuração geral do Angular
│   └── mypreset.ts         # Tema customizado Noir para PrimeNG
├── assets/                 # Recursos estáticos
├── styles.scss             # Estilos globais
└── index.html              # HTML raiz
```

## 🛠️ Tecnologias Utilizadas

- **Angular 16+**
- **TypeScript**
- **PrimeNG 19**
- **PrimeFlex 4**
- **RxJS**
- **SCSS (SASS)**
- **Zone.js**

## 🧪 Testes

A aplicação inclui testes unitários com **Jasmine** e **Karma** para os componentes e serviços principais. Os testes podem ser executados com:

```bash
npm test
```

## 🚀 Execução Local

1. Clone o repositório:

```bash
git clone https://github.com/Alan-Augusto/know-hive-front.git
cd know-hive-front
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm start
```

4. Acesse a aplicação no navegador:

```
http://localhost:4200/
```

## 📦 Scripts disponíveis

| Comando       | Descrição                                     |
|---------------|-----------------------------------------------|
| `npm start`   | Inicia o servidor local (`ng serve`)          |
| `npm run build` | Compila a aplicação para produção            |
| `npm test`    | Executa os testes unitários com Karma         |
| `npm run watch` | Compila em tempo real para ambiente dev     |

## 📃 Requisitos

- Node.js >= 18
- Angular CLI >= 16
- Navegador moderno (Chrome, Firefox, Edge)

## 📐 Padrões de Código

O projeto segue uma configuração de formatação definida em `.editorconfig`, com uso de **espaços (2)**, **final de linha no padrão Unix**, e **código consistente em SCSS e TypeScript**. O código também adota as boas práticas recomendadas pelo Angular CLI e utiliza **standalone components**.

## 🔐 Segurança

- O token de autenticação é armazenado no `localStorage`.
- Todas as chamadas à API passam por serviços centralizados, preparados para interceptação e tratamento de erros.
- Pronto para futura integração com autenticação OAuth2 (ex: Google Sign-In).

## 📅 Planejamento e Etapas Relacionadas

Este frontend corresponde à **etapa prática** da disciplina *Monografia em Sistemas de Informação II*, integrando os seguintes módulos do TCC:

- **Criação de Questões e Autenticação de Usuários**
- **Organização Temática (em desenvolvimento futuro)**
- **Colaboração e Compartilhamento (etapas posteriores)**
- **Feedback e Métricas de Desempenho (a serem implementadas)**

## 👨‍💻 Autor

**Alan Augusto Martins Campos**  
Graduando em Sistemas de Informação - UFMG  
Orientador: Prof. Adriano César Machado Pereira

## 📄 Licença

Este projeto é de caráter acadêmico e sem fins lucrativos. O uso do código segue as diretrizes da UFMG para trabalhos de conclusão de curso. Licenciamento futuro pode ser definido conforme evolução do projeto.

---

> “Nenhum de nós é tão inteligente quanto todos nós juntos.” — *Ray Kroc*
