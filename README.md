# Documentação da Resolução do Desafio Técnico - Desenvolvedor Pleno NestJS

## 1. Visão Geral

Este projeto implementa uma API RESTful em NestJS que recebe transações, armazena em memória e fornece estatísticas das transações dos últimos 60 segundos, conforme o desafio técnico proposto.

A solução foi construída visando clareza, escalabilidade e qualidade do código, seguindo os princípios da Clean Architecture e boas práticas de desenvolvimento backend.

---

## 2. Estrutura do Projeto e Clean Architecture

O projeto está dividido nas seguintes camadas:

- **Controllers:** Lidam com requisições HTTP e enviam respostas. Exemplo: `TransactionsController` e `StatisticsController`.
- **Use Cases:** Contêm a lógica de negócio pura, independente de frameworks ou tecnologias. Exemplo: `CreateTransactionUseCase`, `GetStatisticsUseCase`.
- **Entities:** Definições dos modelos de domínio, representando as transações.
- **Repositories:** Interfaces e implementações que abstraem o armazenamento em memória (`InMemoryTransactionsRepository`).
- **Interfaces/DTOs:** Objetos para validação e definição clara dos contratos de dados (por exemplo, DTOs para criação de transação).

Essa separação garante fácil manutenção, testabilidade e flexibilidade para futuras alterações (ex: trocar armazenamento por banco real).

---

## 3. Principais Tecnologias e Ferramentas

- **NestJS:** Framework principal para construção da API, permitindo injeção de dependência e modularidade.
- **TypeScript:** Para tipagem estática e segurança no código.
- **Pino:** Logs estruturados e performáticos, configurados para exibição colorida no console.
- **Helmet:** Middleware para melhorar segurança HTTP.
- **Rate Limiting:** Implementado com `@nestjs/throttler` para evitar abuso da API.
- **Jest:** Para testes unitários e de integração, garantindo qualidade e robustez.
- **Swagger:** Documentação interativa da API acessível via `/docs`.
- **Docker:** Para containerização e facilidade de deploy.

---

## 4. Lógica do Rate Limiting

- Usamos `ThrottlerModule` configurado globalmente com limite de 5 requisições por 60 segundos.
- O `ThrottlerGuard` é aplicado globalmente via `APP_GUARD`, garantindo que todas rotas respeitem o limite.
- Em endpoints críticos, o decorator `@Throttle()` permite configuração específica se necessário.
- Isso protege a API contra requisições excessivas, garantindo estabilidade.

---

## 5. Tratamento de Dados e Validação

- Validação rigorosa via `class-validator` nos DTOs para garantir:
  - `amount` deve ser número positivo ou zero.
  - `timestamp` deve estar no passado ou presente, nunca futuro.
- Respostas HTTP apropriadas para erros:
  - `400 Bad Request` para JSON inválido.
  - `422 Unprocessable Entity` para dados que violam regras de negócio.

---

## 6. Armazenamento em Memória

- As transações são armazenadas em um repositório em memória (`InMemoryTransactionsRepository`).
- As operações de adicionar, listar e apagar são sincronizadas para evitar problemas de concorrência.
- As estatísticas são calculadas filtrando apenas transações dos últimos 60 segundos, garantindo dados atualizados.

---

## 7. Testes Automatizados

- Cobertura abrangente com testes unitários para Use Cases.

---

## 8. Segurança

- Além do rate limiting, o uso do Helmet configura cabeçalhos HTTP para prevenir ataques comuns (XSS, CSRF, etc).
- CORS habilitado para permitir requisições seguras controladas.
- Dados sempre validados antes de processamento.

---

## 9. Logs Estruturados

- Logs configurados com Pino para facilitar análise e monitoramento.
- Todos os logs seguem formato JSON estruturado.
- Logs de erro, aviso, info e debug disponíveis conforme nível configurado.

---

## 10. Containerização

- Dockerfile otimizado para build leve e rápido.
- docker-compose.yml para execução simples em ambiente local ou CI/CD.

---

## 11. Endpoints Principais

| Método | Endpoint        | Descrição                            |
| ------ | --------------- | ------------------------------------ |
| POST   | `/transactions` | Cria nova transação                  |
| DELETE | `/transactions` | Remove todas as transações           |
| GET    | `/transactions` | Retorna todas as transações          |
| GET    | `/statistics`   | Retorna estatísticas dos últimos 60s |
| GET    | `/health`       | Retorna status da aplicação          |

---

## 12. Conclusão

Esta solução prioriza clareza, modularidade, segurança e qualidade do código.  
Foi implementada para atender rigorosamente os requisitos do desafio, utilizando padrões modernos e boas práticas.

---

## Autor

[Atrhur Rocha](https://github.com/arthurrocha-dev)
