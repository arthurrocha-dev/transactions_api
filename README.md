# Transactions API - Release 1.0.0

## 1. Visão Geral

Este projeto implementa uma API RESTful em NestJS que recebe transações, armazena em memória e fornece estatísticas das transações dos últimos 60 segundos, conforme o desafio técnico proposto.

A solução foi construída visando clareza, escalabilidade e qualidade do código, seguindo os princípios da Clean Architecture e boas práticas de desenvolvimento backend.

---

## 2. Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (para rodar com container)
- [Docker Compose](https://docs.docker.com/compose/) (opcional, para facilitar execução com múltiplos containers)

### Passos para rodar localmente

#### 1. Clone o repositório:

```bash
   git https://github.com/arthurrocha-dev/transactions_api.git
   cd transactions_api
```

#### 2. Instalação de dependências:

Configure as variáveis de ambiente

#### 3. Configure as variáveis de ambiente:

Copie o arquivo .env.example e cole na raiz do projeto renomendo-o para .env, ajustando os dados das variâveis para o ambiente local.

```bash
  cp .env.example .env
```

#### 4. A API estará disponível em:

`http://localhost:3000`

ou e alguma outra porta que tenha sido configurada no .env

---

### Rodando pelo Docker

#### 1. Iniciar container docker:

Dentro da raiz do projeto execute o seguinte comando no terminal

```bash
  docker compose up -d
```

ou

```bash
  docker-compose up -d
```

#### 2. A API estará disponível em:

`http://localhost:3000`

ou e alguma outra porta que tenha sido configurada no .env

## 3. Documentação (Swagger)

Apos a inicialização do projeto, a documentação pode ser acessada em:

(http://localhost:3000/docs)

---

## 4. Estrutura do Projeto e Clean Architecture

O projeto está dividido nas seguintes camadas:

- **Controllers:** Lidam com requisições HTTP e enviam respostas. Exemplo: `TransactionsController` e `StatisticsController`.
- **Use Cases:** Contêm a lógica de negócio pura, independente de frameworks ou tecnologias. Exemplo: `CreateTransactionUseCase`, `GetStatisticsUseCase`.
- **Entities:** Definições dos modelos de domínio, representando as transações.
- **Repositories:** Interfaces e implementações que abstraem o armazenamento em memória (`InMemoryTransactionsRepository`).
- **Interfaces/DTOs:** Objetos para validação e definição clara dos contratos de dados (por exemplo, DTOs para criação de transação).

Essa separação garante fácil manutenção, testabilidade e flexibilidade para futuras alterações (ex: trocar armazenamento por banco real).

---

## 5. Principais Tecnologias e Ferramentas

- **NestJS:** Framework principal para construção da API, permitindo injeção de dependência e modularidade.
- **TypeScript:** Para tipagem estática e segurança no código.
- **Pino:** Logs estruturados e performáticos, configurados para exibição colorida no console.
- **Helmet:** Middleware para melhorar segurança HTTP.
- **Rate Limiting:** Implementado com `@nestjs/throttler` para evitar abuso da API.
- **Jest:** Para testes unitários e de integração, garantindo qualidade e robustez.
- **Swagger:** Documentação interativa da API acessível via `/docs`.
- **Docker:** Para containerização e facilidade de deploy.

---

## 6. Lógica do Rate Limiting

- Usamos `ThrottlerModule` configurado globalmente com limite de 5 requisições por 60 segundos.
- O `ThrottlerGuard` é aplicado globalmente via `APP_GUARD`, garantindo que todas rotas respeitem o limite.
- Em endpoints críticos, o decorator `@Throttle()` permite configuração específica se necessário.
- Isso protege a API contra requisições excessivas, garantindo estabilidade.

---

## 7. Tratamento de Dados e Validação

- Validação rigorosa via `class-validator` nos DTOs para garantir:
  - `amount` deve ser número positivo ou zero.
  - `timestamp` deve estar no passado ou presente, nunca futuro.
- Respostas HTTP apropriadas para erros:
  - `400 Bad Request` para JSON inválido.
  - `422 Unprocessable Entity` para dados que violam regras de negócio.

---

## 8. Armazenamento em Memória

- As transações são armazenadas em um repositório em memória (`InMemoryTransactionsRepository`).
- As operações de adicionar, listar e apagar são sincronizadas para evitar problemas de concorrência.
- As estatísticas são calculadas filtrando apenas transações dos últimos 60 segundos, garantindo dados atualizados.

---

## 9. Testes Automatizados

- Cobertura abrangente com testes unitários para Use Cases.

---

## 10. Segurança

- Além do rate limiting, o uso do Helmet configura cabeçalhos HTTP para prevenir ataques comuns (XSS, CSRF, etc).
- CORS habilitado para permitir requisições seguras controladas.
- Dados sempre validados antes de processamento.

---

## 11. Logs Estruturados

- Logs configurados com Pino para facilitar análise e monitoramento.
- Todos os logs seguem formato JSON estruturado.
- Logs de erro, aviso, info e debug disponíveis conforme nível configurado.

---

## 12. Containerização

- Dockerfile otimizado para build leve e rápido.
- docker-compose.yml para execução simples em ambiente local ou CI/CD.

---

## 13. Healthcheck e Monitoramento da Aplicação

#### Endpoint `/health`

- Endpoint simples que retorna HTTP 200 e um JSON com { status: 'ok', timestamp: '...' } quando a aplicação está saudável.
- Pode ser estendido para verificar dependências críticas (ex: banco de dados, caches).
- O NestJS inclui log de cada requisição a /health, facilitando auditoria e monitoramento.

#### O que acontece em caso de falha?

- Se o endpoint /health não responder ou retornar erro (código HTTP diferente de 2xx), o Docker marca o container como unhealthy.
- Após o número de tentativas configuradas (retries), o container é considerado indisponível.
- Para recuperação automática, foi configurado uma política de reinício do Docker Compose

## 14. Endpoints Principais

| Método | Endpoint        | Descrição                            |
| ------ | --------------- | ------------------------------------ |
| POST   | `/transactions` | Cria nova transação                  |
| DELETE | `/transactions` | Remove todas as transações           |
| GET    | `/transactions` | Retorna todas as transações          |
| GET    | `/statistics`   | Retorna estatísticas dos últimos 60s |
| GET    | `/health`       | Retorna status da aplicação          |

---

## 15. Integração Contínua (CI)

Este projeto conta com integração contínua automatizada usando GitHub Actions, garantindo qualidade e consistência a cada alteração enviada para o repositório.

#### Pipeline CI

A cada push ou pull request nas branches main, master ou develop, a seguinte pipeline é executada:

1. Checkout do código
2. Instalação de dependências com Yarn
3. Execução dos testes automatizados com Jest
4. Build da aplicação (compilação TypeScript)

#### Arquivo de configuração

A pipeline está definido em:
`.github/workflows/ci.yml`

---

## 16. Conclusão

Esta solução prioriza clareza, modularidade, segurança e qualidade do código.  
Foi implementada para atender rigorosamente os requisitos do desafio, utilizando padrões modernos e boas práticas.

---

## Autor

**Arthur Rocha**

- [E-mail](mailto:contato.arthurrochadev@gmail.com)
- [Portfólio](https://arthurrocha.dev)
- [GitHub](https://github.com/arthurrocha-dev)
- [LinkedIn](https://www.linkedin.com/in/arthurrocha-dev)
