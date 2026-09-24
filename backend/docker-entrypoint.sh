#!/bin/sh
set -e

# Se .env não existir, copia do .env.example
if [ ! -f ".env" ]; then
    echo "[Horizon] Arquivo .env não encontrado. Copiando de .env.example..."
    cp .env.example .env
fi

# Instala dependências do Composer se o diretório vendor não existir
if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then
    echo "[Horizon] Instalando dependências do Composer..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Gera a chave de aplicação (APP_KEY) se ainda não estiver definida
if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    echo "[Horizon] Gerando APP_KEY do Laravel..."
    php artisan key:generate --force || true
fi

# Aguarda a disponibilidade do banco de dados MySQL
echo "[Horizon] Verificando conexão com o banco de dados MySQL..."
max_tentativas=30
tentativa=1

while [ $tentativa -le $max_tentativas ]; do
    if php -r "try { new PDO('mysql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); exit(0); } catch (\Exception \$e) { exit(1); }"; then
        echo "[Horizon] Banco de dados MySQL conectado com sucesso!"
        break
    fi
    echo "[Horizon] Aguardando MySQL (tentativa $tentativa de $max_tentativas)..."
    tentativa=$((tentativa + 1))
    sleep 2
done

# Executa as migrações e seeders
echo "[Horizon] Executando migrações do banco de dados..."
php artisan migrate --force

echo "[Horizon] Populando dados iniciais com Seeder..."
php artisan db:seed --force || true

# Inicia o servidor HTTP do Laravel
echo "[Horizon] Iniciando servidor Laravel na porta 8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
