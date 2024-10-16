# BrainMinder - Backend for Frontend

## Estrutura de Pastas do Projeto

- **classes**: Contém a definição de entidades (classes), que representam os objetos principais utilizados na aplicação.
- **controllers**: Responsável por gerenciar os endpoints da aplicação. Aqui são definidas as funções que lidam com as requisições HTTP, chamando as implementações e retornando as respostas adequadas.
- **implementations**: Contém as implementações de cada endpoint, além de toda a lógica de negócio associada.
- **models**: Inclui os schemas do banco de dados (MongoDB) definidos com Mongoose.
- **plugins**: Configurações adicionais e plugins utilizados no MongoDB, como funcionalidades de encriptação e extensões do Mongoose.
- **routes**: Onde as rotas da API são definidas. Essas rotas conectam os endpoints aos controllers adequados.
- **services**: Serviços auxiliares, como autenticação, envio de emails, e outras funcionalidades isoladas da lógica principal da aplicação.
- **validators**: Contém as validações de dados das requisições, garantindo que os inputs dos usuários estejam corretos antes de serem processados.
- **commons**: Interfaces, corpos de requisições e validadores que são compartilhados entre o backend e o frontend. Esta pasta centraliza todos os recursos reutilizáveis para evitar duplicidade de código.

## Tecnologias Utilizadas

- **axios**: ^1.4.0 - Cliente HTTP para fazer requisições externas.
- **bcrypt**: ^5.1.1 - Biblioteca de hash para criptografia de senhas.
- **bcryptjs**: ^2.4.3 - Alternativa ao bcrypt, usada para criptografia de senhas.
- **body-parser**: ^1.20.0 - Middleware para lidar com o corpo de requisições HTTP.
- **celebrate**: ^15.0.3 - Validação de entradas da API com base no Joi.
- **cors**: ^2.8.5 - Middleware para permitir requisições de diferentes origens (Cross-Origin Resource Sharing).
- **dot-object**: ^2.1.4 - Ferramenta para manipular objetos JSON, útil para transformar e mapear dados.
- **express**: ^4.17.3 - Framework web para construir APIs rápidas e robustas em Node.js.
- **jsonwebtoken**: ^9.0.2 - Para geração e validação de tokens JWT (JSON Web Tokens).
- **moment**: ^2.30.1 - Biblioteca para manipulação e formatação de datas.
- **mongoose**: ^6.2.9 - ORM para modelagem de dados e integração com MongoDB.
- **node-schedule**: ^2.1.1 - Agendamento de tarefas no Node.js (ex: execução de tarefas periódicas).
- **nodemailer**: ^6.8.0 - Biblioteca para envio de emails.
- **zod**: ^3.22.4 - Biblioteca para validação de dados com segurança tipada.
- **mongodb-client-encryption**: ^6.1.0 - Ferramenta para criptografia de dados no MongoDB.
