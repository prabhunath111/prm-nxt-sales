# Use the official NGINX image from Docker Hub
FROM 588738605243.dkr.ecr.ap-south-1.amazonaws.com/nginx:latest

# Set proxy configurations for apt and system-level operations 
ENV http_proxy=http://10.23.26.233:8080 
ENV https_proxy=http://10.23.26.233:8080 
ENV no_proxy=169.254.169.254,.amazonaws.com


# Copy your frontend code to the default NGINX public directory
COPY prod-msales-mumbai-frontend /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Change NGINX to listen on port 3000
RUN sed -i 's/listen       80;/listen       3000;/' /etc/nginx/conf.d/default.conf

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]

