require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Configuración de la API
const githubToken = process.env.GITHUB_TOKEN;
const repoUrl = 'Mai1203/Project_Bienes_Raices'; // Cambia por el repositorio deseado
const apiBaseUrl = `https://api.github.com/repos/${repoUrl}/contents`;

// Función para obtener la estructura del repositorio
async function fetchRepoStructure(path = '', indent = '') {
  try {
    const response = await axios.get(`${apiBaseUrl}/${path}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    const items = response.data;
    let structure = '';

    for (const item of items) {
      if (item.type === 'file') {
        structure += `${indent}├── ${item.name}\n`;
      } else if (item.type === 'dir') {
        structure += `${indent}├── ${item.name}/\n`;
        // Llama recursivamente para explorar subcarpetas
        structure += await fetchRepoStructure(`${path}/${item.name}`, indent + '│   ');
      }
    }

    return structure;
  } catch (error) {
    console.error('Error al obtener la estructura del repositorio:', error.message);
    return '';
  }
}

// Función para obtener el contenido de los archivos
async function fetchFileContent(path) {
  try {
    const response = await axios.get(`${apiBaseUrl}/${path}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    console.error(`Error al obtener el contenido de ${path}:`, error.message);
    return '';
  }
}

// Función principal
async function generateConcatenatedFile() {
  try {
    // Obtén la estructura del repositorio en formato de árbol
    const structure = await fetchRepoStructure('');
    fs.writeFileSync('output.txt', `Estructura del proyecto:\n\ninventario_proyecto/\n${structure}\n\n`);

    // Procesa cada archivo en la estructura
    const structureLines = structure.split('\n');
    for (const line of structureLines) {
      if (line.trim().startsWith('├──') && !line.endsWith('/')) {
        const filePath = line.replace(/├── /, '').trim();
        const fileContent = await fetchFileContent(filePath);

        // Agrega el contenido del archivo al archivo de salida
        fs.appendFileSync('output.txt', `\n---\nArchivo: ${filePath}\n---\n`);
        fs.appendFileSync('output.txt', fileContent + '\n');
      }
    }

    console.log('Archivo "output.txt" generado correctamente.');
  } catch (error) {
    console.error('Error al generar el archivo concatenado:', error.message);
  }
}

// Ejecuta la función principal
generateConcatenatedFile();
