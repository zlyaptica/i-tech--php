FROM php:8.1-apache

WORKDIR /var/www/html

COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
COPY index.php .

EXPOSE 80