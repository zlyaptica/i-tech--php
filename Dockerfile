FROM php:8.1-apache

WORKDIR /var/www/html

COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
COPY index.php .
COPY style.css .
COPY main.js .

EXPOSE 80