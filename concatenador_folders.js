require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Configuración de la API
const githubToken = process.env.GITHUB_TOKEN;
const repoUrl = 'Mai1203/Project_Bienes_Raices'; // Cambia por el repositorio deseado
const apiBaseUrl = `https://api.github.com/repos/${repoUrl}/contents`;

/**
 * Función para obtener los elementos dentro de una carpeta específica (archivos y subcarpetas)
 * @param {string} folderPath Ruta de la carpeta dentro del repositorio
 */
async function fetchFolderContents(folderPath) {
  try {
    const response = await axios.get(`${apiBaseUrl}/${folderPath}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener los elementos de la carpeta:', error.message);
    return [];
  }
}

/**
 * Función para obtener el contenido de un archivo
 * @param {string} fileUrl URL del archivo a obtener
 */
async function fetchFileContent(fileUrl) {
  try {
    const response = await axios.get(fileUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    // Decodificar el contenido desde Base64
    return Buffer.from(response.data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.error(`Error al obtener el contenido del archivo ${fileUrl}:`, error.message);
    return '';
  }
}

/**
 * Función recursiva para procesar una carpeta y sus subcarpetas
 * @param {string} folderPath Ruta de la carpeta dentro del repositorio
 * @param {string} structure Estructura del proyecto
 */
async function processFolder(folderPath, structure = '') {
  try {
    const items = await fetchFolderContents(folderPath);

    for (const item of items) {
      if (item.type === 'file') {
        const content = await fetchFileContent(item.url);
        fs.appendFileSync('output.txt', `---\nArchivo: ${folderPath}/${item.name}\n---\n`);
        fs.appendFileSync('output.txt', content + '\n\n');
      } else if (item.type === 'dir') {
        structure += `${' '.repeat(folderPath.split('/').length)}├── ${item.name}/\n`;
        structure = await processFolder(`${folderPath}/${item.name}`, structure);
      }
    }

    return structure;
  } catch (error) {
    console.error('Error al procesar la carpeta:', error.message);
    return structure;
  }
}

/**
 * Función principal para concatenar archivos y generar la estructura del proyecto
 * @param {string} folderPath Ruta de la carpeta dentro del repositorio
 */
async function concatenateFolderFiles(folderPath) {
  try {
    // Crear/limpiar el archivo de salida
    fs.writeFileSync('output.txt', `Estructura y contenido de los archivos en la carpeta: ${folderPath}\n\n`);

    // Procesar la carpeta y generar estructura
    const structure = await processFolder(folderPath);

    // Escribir la estructura en el archivo de salida
    fs.appendFileSync('output.txt', `---\nEstructura del proyecto:\n---\n${structure}\n`);

    console.log('Archivo "output.txt" generado correctamente con los archivos y la estructura de la carpeta especificada.');
  } catch (error) {
    console.error('Error al concatenar los archivos y generar la estructura:', error.message);
  }
}

// Ejecutar el script con la ruta deseada
const folderPath = 'src/scss'; // Cambia por la ruta de la carpeta dentro del repositorio
concatenateFolderFiles(folderPath);