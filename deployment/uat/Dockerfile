# Use the official NGINX image from Docker Hub
FROM 891377194963.dkr.ecr.ap-south-1.amazonaws.com/nginx:latest

# Set proxy configurations for apt and system-level operations 
ENV http_proxy=http://10.23.26.233:8080 
ENV https_proxy=http://10.23.26.233:8080 
ENV no_proxy=169.254.169.254,.amazonaws.com

# Create non-root user and group
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy your frontend code to the default NGINX public directory
COPY msales-mumbai-frontend /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Change permissions to appuser
RUN chown -R appuser:appgroup /usr/share/nginx/html /etc/nginx/conf.d /var/run/ /var/cache/nginx

# Expose port 3000
EXPOSE 3000

# Change NGINX to listen on port 3000
RUN sed -i 's/listen       80;/listen       3000;/' /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER appuser



