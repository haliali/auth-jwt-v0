# 📋 Exemplos de Requisições - API

Guia completo para testar a API usando curl ou Postman.

## 🌐 Base URL
```
http://localhost:3000
```

## 📝 Endpoints

### 1️⃣ GET / - Rota Pública

**Descrição**: Retorna mensagem de boas-vindas

**Método**: `GET`

**URL**: `/`

**Headers**: Nenhum necessário

**Resposta (200)**:
```json
{
  "msg": "Bem-vindo a nossa API"
}
```

**Teste com curl**:
```bash
curl http://localhost:3000/
```

---

### 2️⃣ POST /auth/register - Registrar Usuário

**Descrição**: Cria uma nova conta de usuário

**Método**: `POST`

**URL**: `/auth/register`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "confirmpassword": "senha123"
}
```

**Resposta (201)**:
```json
{
  "msg": "Usuário criado com sucesso!"
}
```

**Erros**:
- `422`: Validação falhou (nome, email, senha obrigatórios, senhas não coincidem)
- `500`: Erro ao criar usuário

**Teste com curl**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "confirmpassword": "senha123"
  }'
```

**Teste com curl (Windows PowerShell)**:
```powershell
$body = @{
    name = "João Silva"
    email = "joao@example.com"
    password = "senha123"
    confirmpassword = "senha123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

### 3️⃣ POST /auth/user - Login (Autenticação)

**Descrição**: Autentica o usuário e retorna um token JWT

**Método**: `POST`

**URL**: `/auth/user`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (200)**:
```json
{
  "msg": "Autenticação realizada com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjYzNDU5OTJhM2I4YzAwZjM3NThhNyIsImlhdCI6MTcyNzMzOTQwMn0.abcdef123456..."
}
```

**Erros**:
- `404`: Usuário não encontrado
- `422`: Senha inválida, email ou senha obrigatória
- `500`: Erro interno

**Teste com curl**:
```bash
curl -X POST http://localhost:3000/auth/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

---

### 4️⃣ GET /user/:id - Obter Perfil do Usuário

**Descrição**: Retorna dados do usuário autenticado (requer token)

**Método**: `GET`

**URL**: `/user/{userId}`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Parâmetros**:
- `:id` (URL) - ID do usuário (MongoDB ObjectId)

**Resposta (200)**:
```json
{
  "user": {
    "_id": "66b634599a3b8c00f375a8a7",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-08-10T14:30:25.123Z",
    "updatedAt": "2024-08-10T14:30:25.123Z"
  }
}
```

**Erros**:
- `401`: Token não fornecido
- `400`: Token inválido
- `404`: Usuário não encontrado
- `500`: Erro ao buscar usuário

**Teste com curl** (use o token retornado do login):
```bash
curl -X GET http://localhost:3000/user/66b634599a3b8c00f375a8a7 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔄 Fluxo Completo (Exemplo)

### Passo 1: Registrar Usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@example.com",
    "password": "senha456",
    "confirmpassword": "senha456"
  }'
```

Resposta:
```json
{
  "msg": "Usuário criado com sucesso!"
}
```

### Passo 2: Fazer Login
```bash
curl -X POST http://localhost:3000/auth/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "senha456"
  }'
```

Resposta:
```json
{
  "msg": "Autenticação realizada com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjYzNDU5OTJhM2I4YzAwZjM3NThhNyIsImlhdCI6MTcyNzMzOTQwMn0.xxx"
}
```

**⚠️ Guarde o token!**

### Passo 3: Usar o Token para Acessar o Perfil
```bash
curl -X GET http://localhost:3000/user/66b634599a3b8c00f375a8a7 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjYzNDU5OTJhM2I4YzAwZjM3NThhNyIsImlhdCI6MTcyNzMzOTQwMn0.xxx"
```

Resposta:
```json
{
  "user": {
    "_id": "66b634599a3b8c00f375a8a7",
    "name": "Maria Santos",
    "email": "maria@example.com",
    "createdAt": "2024-08-10T14:30:25.123Z",
    "updatedAt": "2024-08-10T14:30:25.123Z"
  }
}
```

---

## 🧪 Testes com Validações

### Registrar com Email Inválido
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "email-invalido",
    "password": "senha123",
    "confirmpassword": "senha123"
  }'
```

Resposta: `422 - Email inválido!`

### Registrar com Senhas Diferentes
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "password": "senha123",
    "confirmpassword": "diferente"
  }'
```

Resposta: `422 - As senhas não conferem!`

### Login com Senha Errada
```bash
curl -X POST http://localhost:3000/auth/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "senhaErrada"
  }'
```

Resposta: `422 - Senha inválida!`

### Acessar Perfil sem Token
```bash
curl -X GET http://localhost:3000/user/66b634599a3b8c00f375a8a7
```

Resposta: `401 - Acesso negado!`

### Acessar Perfil com Token Inválido
```bash
curl -X GET http://localhost:3000/user/66b634599a3b8c00f375a8a7 \
  -H "Authorization: Bearer tokenInvalido"
```

Resposta: `400 - Token inválido!`

---

## 📮 Teste com Postman

### Importar Collection

1. **Abra o Postman**
2. **Clique em "Import"**
3. **Cole o JSON abaixo** (ou crie manualmente)

```json
{
  "info": {
    "name": "Auth JWT API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Registrar",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"João Silva\",\n  \"email\": \"joao@example.com\",\n  \"password\": \"senha123\",\n  \"confirmpassword\": \"senha123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/auth/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"joao@example.com\",\n  \"password\": \"senha123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/auth/user",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "user"]
        }
      }
    },
    {
      "name": "Perfil",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {token}"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/user/{userId}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["user", "{userId}"]
        }
      }
    }
  ]
}
```

---

## 🔐 JWT Token

O token é um **JWT (JSON Web Token)** com a estrutura:
```
header.payload.signature
```

**Exemplo decodificado**:
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "id": "66b634599a3b8c00f375a8a7",
  "iat": 1727339402
}

Signature:
HMACSHA256(header.payload, SECRET)
```

**Para decodificar**, acesse: https://jwt.io

---

## 💡 Dicas

- Sempre incluir `Authorization: Bearer {token}` nas requisições autenticadas
- O token expira quando você faz logout
- Limpe o localStorage para "resetar" a autenticação
- Use `Content-Type: application/json` em todas as requisições POST

---

**Desenvolvido com ❤️ usando Express.js, MongoDB e JWT**
