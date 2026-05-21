#!/bin/bash
set -euo pipefail

DOMAIN="${1:?Domain argument is required}"
DEPLOY_PATH="${2:?Deploy path argument is required}"
NGINX_CONF="/etc/nginx/sites-available/admin_frontend"
CERT_EMAIL="noreply@${DOMAIN}"

echo "==> Setting up server for domain: ${DOMAIN}"
echo "==> Deploy path: ${DEPLOY_PATH}"

# Install nginx if not present
if ! command -v nginx &>/dev/null; then
  echo "==> Installing nginx..."
  apt-get update -qq
  apt-get install -y nginx
fi

# Install certbot if not present
if ! command -v certbot &>/dev/null; then
  echo "==> Installing certbot..."
  apt-get update -qq
  apt-get install -y certbot python3-certbot-nginx
fi

# Write nginx HTTP config (certbot will add HTTPS block)
echo "==> Writing nginx config..."
cat > "${NGINX_CONF}" << NGINXEOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${DEPLOY_PATH};
    index index.html;

    # SPA routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Disable access to hidden files
    location ~ /\. {
        deny all;
    }
}
NGINXEOF

# Enable site and disable default
ln -sf "${NGINX_CONF}" /etc/nginx/sites-enabled/admin_frontend
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
echo "==> Testing nginx config..."
nginx -t

# Reload nginx
systemctl reload nginx
echo "==> Nginx reloaded"

# Obtain SSL certificate (only on first run)
if [ ! -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
  echo "==> Obtaining SSL certificate for ${DOMAIN}..."
  certbot --nginx \
    -d "${DOMAIN}" \
    --non-interactive \
    --agree-tos \
    --email "${CERT_EMAIL}" \
    --redirect
  echo "==> SSL certificate obtained successfully"
else
  echo "==> SSL certificate already exists, skipping..."
fi

# Final reload to apply any certbot changes
systemctl reload nginx

echo ""
echo "==> Deployment complete! Site is available at https://${DOMAIN}"
