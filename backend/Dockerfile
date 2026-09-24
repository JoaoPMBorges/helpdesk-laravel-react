# Backend Laravel (PHP 8.3)
FROM php:8.3-cli

# Instala dependências do sistema operacional
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instala o Composer a partir da imagem oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho
WORKDIR /var/www/html

# Copia os arquivos do projeto
COPY . .

# Concede permissão de execução para o script de inicialização
RUN chmod +x /var/www/html/docker-entrypoint.sh || true

# Expõe a porta do servidor embutido do Laravel
EXPOSE 8000

# Executa o entrypoint de inicialização automática
ENTRYPOINT ["/var/www/html/docker-entrypoint.sh"]
