# GitHub Folder Concatenator

Este proyecto es una herramienta para procesar archivos y subcarpetas en un repositorio de GitHub. Permite generar un archivo de texto que contiene tanto la estructura del proyecto como el contenido de los archivos en una carpeta especificada.

## Características

- Obtiene la estructura de carpetas y subcarpetas desde un repositorio de GitHub.
- Descarga y concatena el contenido de los archivos en una carpeta específica, incluyendo subcarpetas.
- Genera un archivo de salida (`output.txt`) con la estructura del proyecto y el contenido de los archivos.

## Requisitos previos

1. Tener Node.js instalado en tu sistema.
2. Crear un token de acceso personal en GitHub con permisos de lectura en los repositorios necesarios.
3. Crear un archivo `.env` en el directorio raíz del proyecto, con el siguiente contenido:

GITHUB_TOKEN=tu_token_personal

## Uso
1. Configura el repositorio y la carpeta a procesar en el archivo concatenador_folders.js

  const repoUrl = 'usuario/repositorio'; // Cambia por el repositorio deseado
  const folderPath = 'ruta/de/la/carpeta'; // Cambia por la ruta de la carpeta dentro del repositorio

2. Ejecuta el Script
   node concatenador_folders.js

3. Revisa el archivo output.txt generado en el directorio raíz para ver la estructura del proyecto y el contenido de los archivos.
