const path = require('path');
const httpServer = require('http-server');

(async () => {
  const open = (await import('open')).default;

  // Path to the output directory specified in jsdoc.json (usually 'docs')
  const outputDir = path.resolve(__dirname, '../../docs');

  // Serve the generated documentation on localhost
  const server = httpServer.createServer({ root: outputDir });
  server.listen(5005, () => {
    console.log('Documentation is available at http://localhost:5005');
    // Open the documentation in the default browser
    open('http://localhost:5005');
  });
})();
