var path = require('path')
var extract = require('pdf-text-extract')
const express = require('express');
const client = require('../infra/elastic');
const app = express();
var walk = require('walkdir');
require('events').EventEmitter.defaultMaxListeners = 15; // ou qualquer número adequado ao seu caso

// respond with "hello world" when a GET request is made to the homepage
const upload = require('../upload');
app.post('/upload', upload.single('file'), (req, res) => {
  // Handle the uploaded file
  res.json({ message: 'File uploaded successfully!' });
});



app.listen(3000, () => { console.log("app listen on port 3000") })

app.get("/search", async (req, res) => {
  const { term, dataInicial, dataFinal, tipoEdicao, pagina, quantidade } = req.query;

  response = await client.search({
    index: 'e-index-pdf3',
    q: term,
    highlight: {
      fields: {
        "page": {
          "pre_tags": ["<b>"],
          "post_tags": ["</b>"]
        }
      }
    }, _source_excludes: ["page"]
  })
  res.send(response)
})

const indice = 'e-index-pdf3';

walk('../edicoes/executivo', async function (path, stat) {


  if (path.includes(".pdf")) {
    const filename = getFilenameFromPath(path);
    console.log(path)
    const getEditionType = getEditionTypeFromFilename(filename)
    console.log(getEditionType)
    // const getEditionDate = getEditionDateFromFilename(filename)

    
    extract(path.toString(), { splitPages: true }, (err, pages) => {
      const regexPattern = /[-\n$]|(^ +| +$|( )+)/g;
      if (pages === undefined) return;

      pages.forEach(page => {
        const sanitizedPage = page.replace(regexPattern, " ");
        client.index({
          index: indice,
          body: { page: sanitizedPage },
        })
      })
    })
  } else {
    return;
  }
});

function getFilenameFromPath(path) {
  return path.split("/")[8]
}

function getEditionTypeFromFilename(filename) {
  const siglaEdicao = filename.substring(0, 2);
  switch (siglaEdicao) {
    case "EX":
      return "Executivo";
    case "TE":
      return "Terceiros";
    case "JU":
      return "Judiciário";
    case "SX":
      return "Suplemento Executivo";
    case "ST":
      return "Suplemento Terceiros";
    case "SJ":
      return "Suplemento Judiciário";
    case "DE":
      return "Extraordinário Executivo";
    case "EE":
      return "Extraordinário Terceiros";
    case "ET":
      return "Extra Terceiros";
    case "EC":
      return "Extra Executivo";
    default:
      null
  }
}
function getDateFromFilename(filename) {
  console.log(new Date(filename.substring(2,8)))
}
getDateFromFilename("TE20201212.pdf");




