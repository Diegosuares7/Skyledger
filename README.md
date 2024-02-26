# Ejecucion Dockerfile.
El Dockerfile crea el contenedor que sera ejecutado por la Lambda. La manera de generar el contenedor y ejecutarlo es la siguiente:

* Creamos la Imagen de Docker.
docker build --platform linux/amd64 -t docker-image:test .

* Ejecutamos el contenedor.
docker run --platform linux/amd64 -p 9000:8080 docker-image:test

* Con el siguiente comando de curl ejecutamos el codigo.
curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'

# De esta manera nos aseguramos de que la lambda funcione correctamente.