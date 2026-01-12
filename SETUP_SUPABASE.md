# Guia de Configuração do Supabase

Siga estes passos para configurar seu banco de dados e autenticação para o Sugar Free.

## 1. Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e faça login.
2. Clique em **"New Project"**.
3. Escolha sua organização, nomeie o projeto (ex: `Sugar Free`), defina uma senha forte para o banco e escolha a região mais próxima (ex: São Paulo).
4. Clique em **"Create new project"**.

## 2. Configurar Variáveis de Ambiente
1. Verifique se o arquivo `.env.local` existe na raiz do projeto (`sugar-free/`). Se não, crie-o.
2. No painel do Supabase, vá em **Project Settings** (ícone de engrenagem) -> **API**.
3. Copie o **Project URL** e cole no `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
   ```
4. Copie a **API Key** (tags `anon` `public`) e cole no `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

## 3. Criar Banco de Dados (Tabelas)
1. No menu lateral do Supabase, clique em **SQL Editor**.
2. Cole o conteúdo abaixo (é o mesmo arquivo `schema.sql` que já existe no projeto):

```sql
-- Habilita a geração de UUIDs
create extension if not exists "uuid-ossp";

-- Tabela de logs diários
create table daily_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  success boolean not null,
  note text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id, date)
);

-- Index para performance
create index idx_daily_logs_user_date on daily_logs(user_id, date desc);

-- Segurança (RLS)
alter table daily_logs enable row level security;

-- Políticas de acesso (apenas dono vê/edita seus dados)
create policy "Users can view own logs" on daily_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own logs" on daily_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can update own logs" on daily_logs
  for update using (auth.uid() = user_id);

create policy "Users can delete own logs" on daily_logs
  for delete using (auth.uid() = user_id);

-- Opcional: Preferências do usuário
create table user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reminder_time time,
  timezone text default 'America/Sao_Paulo',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table user_preferences enable row level security;

create policy "Users can manage own preferences" on user_preferences
  for all using (auth.uid() = user_id);
```

3. Clique em **Run** (botão verde no canto inferior direito).

## 4. Testar
1. Reinicie seu servidor local se estiver rodando:
   ```bash
   npm run dev
   ```
2. Abra `http://localhost:3000`.
3. Tente criar uma conta em `/signup`.
   - **Nota**: Por padrão, o Supabase exige confirmação de email.
   - Para testar rápido (desenvolvimento), você pode desativar "Confirm email" em **Authentication -> Providers -> Email** no painel do Supabase.

Pronto! Seu projeto está conectado.
