const fs = require('fs');
const {PDFDocument, PDFTextField} = require('pdf-lib').PDFDocument;

async function splitPdf(pathToPdf) {

    const docmentAsBytes = await fs.promises.readFile(pathToPdf);

    // Load your PDFDocument
    const pdfDoc = await PDFDocument.load(docmentAsBytes)

    const numberOfPages = pdfDoc.getPages().length;

    for (let i = 0; i < numberOfPages; i++) {

        // Create a new "sub" document
        const subDocument = await PDFDocument.create();
        // copy the page at current index
        const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
        subDocument.addPage(copiedPage);
        const pdfBytes = await subDocument.save()
        await writePdfBytesToFile(`file-${i + 1}.pdf`, pdfBytes);

    }
}

async function getPdfPages(pathToPdf) {

  const docmentAsBytes = await fs.promises.readFile(pathToPdf);

  // Load your PDFDocument
  const pdfDoc = await PDFDocument.load(docmentAsBytes)

  const numberOfPages = pdfDoc.getPages().length;

  for (let i = 0; i < numberOfPages; i++) {

    console.log(pdfDoc.getPage(i).doc.getPage(i))


  }
}


function writePdfBytesToFile(fileName, pdfBytes) {
    return fs.promises.writeFile(fileName, pdfBytes);
}

(async () => {
  // await splitPdf("../algoritimo.pdf");
  await getPdfPages("../algoritimo.pdf");
})();