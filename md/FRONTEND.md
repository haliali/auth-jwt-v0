# 🔐 Frontend - Auth JWT

Frontend moderno e responsivo para o sistema de autenticação com JWT.

## 📁 Estrutura

```
public/
├── index.html       # Página principal com formulários
├── style.css        # Estilos modernos e responsivos
└── script.js        # Lógica de requisições ao backend
```

## ✨ Funcionalidades

### 1️⃣ **Login**
- Autenticação via email e senha
- Armazenamento seguro do token JWT no localStorage
- Validação de formulário no frontend
- Mensagens de erro/sucesso personalizadas

### 2️⃣ **Registrar**
- Criação de nova conta
- Validação de email
- Validação de força de senha (mínimo 6 caracteres)
- Confirmação de senha
- Verificação de email já cadastrado

### 3️⃣ **Meu Perfil**
- Visualização de dados do usuário logado
- Exibição de nome, email, ID e data de cadastro
- Acesso com token JWT
- Logout direto do perfil

## 🔄 Fluxo da Aplicação

```
┌─────────────────────────────────────────────────┐
│         Frontend (index.html)                    │
│  ┌────────────────────────────────────────────┐ │
│  │  Login | Registrar | Meu Perfil            │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
              ↓↑
        (script.js)
        Requisições HTTP
              ↓↑
┌─────────────────────────────────────────────────┐
│         Backend (Express)                        │
│  ┌────────────────────────────────────────────┐ │
│  │ POST /auth/register                        │ │
│  │ POST /auth/user (login)                    │ │
│  │ GET /user/:id (perfil)                     │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
              ↓↑
┌─────────────────────────────────────────────────┐
│         MongoDB                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ User (name, email, password)               │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## 🔐 Autenticação com JWT

O token JWT é armazenado no **localStorage** com a chave `authToken`.

### Fluxo:
1. Usuário faz login com email e senha
2. Backend retorna um token JWT
3. Frontend armazena o token no localStorage
4. Para acessar rotas protegidas, o token é enviado no header:
   ```
   Authorization: Bearer <token>
   ```

## 📱 Elementos do Formulário

### Login
- **Email**: Validação de formato
- **Senha**: Campo obrigatório

### Registrar
- **Nome**: Campo obrigatório
- **Email**: Validação de formato
- **Senha**: Mínimo 6 caracteres
- **Confirmar Senha**: Deve ser igual à senha

### Perfil
- Exibe dados do usuário logado
- Botão para fazer logout

## 🎨 Design

- **Paleta de cores**: Gradiente roxo (#667eea → #764ba2)
- **Tipografia**: System fonts para melhor performance
- **Responsividade**: Funciona em desktop, tablet e mobile
- **Animações**: Transições suaves e feedback visual

## 🛠️ Configuração

### URL da API
Configurada em `script.js`:
```javascript
const API_URL = 'http://localhost:3000';
```

### Chaves do localStorage
- `authToken`: Token JWT do usuário
- `userId`: ID ou email do usuário

## 💾 Armazenamento de Dados

### localStorage
- Token JWT (autenticação)
- ID do usuário (identificação)

### sessionStorage (opcional)
- Dados temporários da sessão

## 🚀 Como Usar

1. **Iniciar o servidor**:
   ```bash
   npm start
   ```

2. **Acessar a aplicação**:
   ```
   http://localhost:3000
   ```

3. **Criar uma conta**:
   - Clique em "Registrar"
   - Preencha os dados
   - Clique em "Registrar"

4. **Fazer login**:
   - Clique em "Login"
   - Digite email e senha
   - Clique em "Entrar"

5. **Ver perfil**:
   - Clique em "Meu Perfil"
   - Veja seus dados

6. **Logout**:
   - Clique em "Sair" ou no botão de logout do perfil

## ⚠️ Tratamento de Erros

- Validação no frontend antes de enviar requisição
- Mensagens de erro do backend exibidas ao usuário
- Timeout de 5 segundos para requisições
- Tratamento de erros de conexão

## 🔒 Segurança

- ✅ Token JWT armazenado (não é ideal, preferir httpOnly cookies em produção)
- ✅ Validação de email
- ✅ Validação de senha (mínimo 6 caracteres)
- ✅ Proteção contra XSS com `escapeHtml()`
- ✅ CORS configurado no backend

## 📊 Teste as Funcionalidades

### Teste 1: Criar Conta
1. Vá para "Registrar"
2. Preencha: Nome, Email, Senha, Confirmar Senha
3. Clique em "Registrar"
4. Deve aparecer mensagem de sucesso

### Teste 2: Login
1. Vá para "Login"
2. Digite o email e senha criados
3. Clique em "Entrar"
4. Deve aparecer a seção "Bem-vindo" com seus dados

### Teste 3: Ver Perfil
1. Já logado, clique em "Meu Perfil"
2. Deve exibir seus dados completos

### Teste 4: Logout
1. Clique no botão "Sair"
2. Confirme
3. Deve voltar para a tela de login

## 🐛 Troubleshooting

### "Erro ao conectar com o servidor"
- Verifique se o backend está rodando: `npm start`
- Verifique se a URL da API está correta em `script.js`

### "Token inválido"
- Limpe o localStorage: `localStorage.clear()`
- Faça login novamente

### CORS Error
- Verifique se `cors` está instalado: `npm list cors`
- Verifique se o middleware está configurado no `app.js`

### Email já cadastrado
- Use um email diferente
- Ou limpe o banco de dados

## 📝 Notas

- Este é um projeto educacional
- Em produção, use tokens httpOnly cookies
- Implemente rate limiting
- Use HTTPS em produção
- Valide dados no backend também

---

**Desenvolvido com ❤️ usando Express.js, MongoDB e vanilla JavaScript**
