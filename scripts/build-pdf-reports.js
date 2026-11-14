const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure marked is available
let marked;
try {
  marked = require('marked');
} catch (e) {
  // Try loading from npx cache or require via global / local
  try {
    const markedPath = execSync('npm root -g').toString().trim();
    marked = require(path.join(markedPath, 'marked'));
  } catch (err) {
    // If not found, use minimal embedded markdown converter or child_process
  }
}

const finalReportDir = path.resolve('c:/Users/HP/Downloads/dev_proj/final-report');
const edgeExe = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const baseCss = `
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
  }
  @page :left {
    @bottom-right { content: counter(page); }
  }
  @page :right {
    @bottom-right { content: counter(page); }
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #24292f;
    margin: 0;
    padding: 0;
  }
  h1, h2, h3, h4, h5, h6 {
    color: #0f172a;
    font-weight: 700;
    margin-top: 1.4em;
    margin-bottom: 0.5em;
    line-height: 1.25;
  }
  h1 {
    font-size: 19pt;
    border-bottom: 2px solid #0284c7;
    padding-bottom: 6px;
    margin-top: 1.8em;
  }
  h2 {
    font-size: 14pt;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 4px;
    margin-top: 1.4em;
  }
  h3 {
    font-size: 12pt;
    margin-top: 1.2em;
  }
  h4 {
    font-size: 11pt;
    margin-top: 1em;
  }
  p {
    margin-top: 0;
    margin-bottom: 0.8em;
    text-align: justify;
  }
  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 1.5em 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2em 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 7px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #f1f5f9;
    font-weight: 600;
    color: #0f172a;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  code {
    font-family: "Consolas", "Courier New", monospace;
    font-size: 9.5pt;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
  pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 12px 14px;
    border-radius: 6px;
    overflow-x: auto;
    font-family: "Consolas", "Courier New", monospace;
    font-size: 9pt;
    line-height: 1.45;
    margin: 1.2em 0;
    page-break-inside: avoid;
    border: 1px solid #1e293b;
  }
  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    border: none;
    font-size: inherit;
  }
  blockquote {
    border-left: 4px solid #0284c7;
    margin: 1em 0;
    padding: 6px 16px;
    background-color: #f0f9ff;
    color: #0369a1;
  }
  img {
    max-width: 95%;
    height: auto;
    display: block;
    margin: 1em auto 0.5em auto;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    page-break-inside: avoid;
  }
  .page-break {
    page-break-before: always;
  }
  .title-page {
    text-align: center;
    page-break-after: always;
    padding-top: 15mm;
  }
  .certificate-page {
    page-break-after: always;
    padding: 10mm 5mm;
  }
  ul, ol {
    margin-top: 0;
    margin-bottom: 0.8em;
    padding-left: 24px;
  }
  li {
    margin-bottom: 0.35em;
  }
`;

function convertMarkdownToHtml(mdContent, title) {
  // Use marked CLI if marked module is not directly available
  let bodyHtml = '';
  const tmpMd = path.join(finalReportDir, '_tmp_render.md');
  const tmpHtml = path.join(finalReportDir, '_tmp_render.html');
  fs.writeFileSync(tmpMd, mdContent, 'utf-8');

  try {
    execSync(`npx --yes marked -i "${tmpMd}" -o "${tmpHtml}" --gfm --breaks`);
    bodyHtml = fs.readFileSync(tmpHtml, 'utf-8');
  } catch (err) {
    console.error('Error running marked:', err);
    throw err;
  } finally {
    if (fs.existsSync(tmpMd)) fs.unlinkSync(tmpMd);
    if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
  }

  // Post-process HTML to add page breaks before major headers and style figures
  bodyHtml = bodyHtml
    .replace(/<h1>CERTIFICATE<\/h1>/gi, '<div class="page-break"></div><h1>CERTIFICATE</h1>')
    .replace(/<h1>LIST OF PROJECT BASED LEARNING COMPONENTS<\/h1>/gi, '<div class="page-break"></div><h1>LIST OF PROJECT BASED LEARNING COMPONENTS</h1>')
    .replace(/<h1>ASSESSMENT RUBRICS/gi, '<div class="page-break"></div><h1>ASSESSMENT RUBRICS')
    .replace(/<h1>MARKS AWARDED<\/h1>/gi, '<div class="page-break"></div><h1>MARKS AWARDED</h1>')
    .replace(/<h1>COMPONENT 1:/gi, '<div class="page-break"></div><h1>COMPONENT 1:')
    .replace(/<h1>COMPONENT 2:/gi, '<div class="page-break"></div><h1>COMPONENT 2:')
    .replace(/<h1>11. CONCLUSION/gi, '<div class="page-break"></div><h1>11. CONCLUSION')
    .replace(/<h1>12. REFERENCES/gi, '<div class="page-break"></div><h1>12. REFERENCES')
    .replace(/<h1>12. COMPREHENSIVE REFERENCES/gi, '<div class="page-break"></div><h1>12. COMPREHENSIVE REFERENCES');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${baseCss}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}

function generatePdf(htmlPath, pdfPath) {
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  const cmd = `"${edgeExe}" --headless --disable-gpu --no-sandbox --allow-file-access-from-files --print-to-pdf="${pdfPath}" "${fileUrl}"`;
  console.log(`Generating PDF: ${pdfPath}`);
  execSync(cmd, { stdio: 'inherit' });
  console.log(`Successfully created: ${pdfPath} (${fs.statSync(pdfPath).size} bytes)`);
}

const reports = [
  {
    name: 'Component 1 Report',
    mdFile: path.join(finalReportDir, 'component1-report.md'),
    htmlFile: path.join(finalReportDir, 'component1-report.html'),
    pdfFile: path.join(finalReportDir, 'Component1-Report.pdf')
  },
  {
    name: 'Component 2 Report',
    mdFile: path.join(finalReportDir, 'component2-report.md'),
    htmlFile: path.join(finalReportDir, 'component2-report.html'),
    pdfFile: path.join(finalReportDir, 'Component2-Report.pdf')
  },
  {
    name: 'Complete DevOps Self Learning Activity Report',
    mdFile: path.join(finalReportDir, 'devops-self-learning-report-complete.md'),
    htmlFile: path.join(finalReportDir, 'devops-self-learning-report-complete.html'),
    pdfFile: path.join(finalReportDir, 'DevOps-Self-Learning-Report-Complete.pdf')
  }
];

for (const report of reports) {
  console.log(`Processing: ${report.name}...`);
  const mdContent = fs.readFileSync(report.mdFile, 'utf-8');
  const htmlContent = convertMarkdownToHtml(mdContent, report.name);
  fs.writeFileSync(report.htmlFile, htmlContent, 'utf-8');
  generatePdf(report.htmlFile, report.pdfFile);
}

console.log('ALL REPORTS COMPILED AND RENDERED TO PDF SUCCESSFULLY!');
