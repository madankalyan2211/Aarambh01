const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

// For Node.js environment, we need to set up a fake DOM
if (typeof window === 'undefined') {
  global.window = {
    PDFJS: {}
  };
  global.navigator = {
    userAgent: 'Node'
  };
  global.PDFJS = {};
}

// Load PDF
const pdfPath = './server/uploads/test-submission.pdf';

pdfjsLib.getDocument(pdfPath).promise.then(function(pdf) {
  console.log('PDF loaded successfully');
  console.log('Number of pages:', pdf.numPages);
  
  // Get first page
  pdf.getPage(1).then(function(page) {
    console.log('First page loaded successfully');
    console.log('Page size:', page.view);
  });
}).catch(function(error) {
  console.error('Error loading PDF:', error);
});