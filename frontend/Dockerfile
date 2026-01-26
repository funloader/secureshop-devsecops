FROM nginx:alpine
# Copy our UI to the default Nginx path
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
