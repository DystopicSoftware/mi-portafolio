const puppeteer = require('puppeteer');
const path = require('path');

const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Load the HTML file
  const htmlPath = path.join(__dirname, 'cv_template.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  await page.setContent(html, { waitUntil: 'load' });

  // Generate PDF
  const pdfPath = path.join(__dirname, 'public', 'assets', 'cv', 'Juan_Villada_CV.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px'
    }
  });

  console.log(`PDF generated successfully at ${pdfPath}`);
  await browser.close();
})();
