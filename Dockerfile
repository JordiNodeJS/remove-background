FROM caddy:2.8-alpine

COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443 2019

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]