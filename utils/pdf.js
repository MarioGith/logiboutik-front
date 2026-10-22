// Building blocks shared by the stock sheet and the invoice PDFs.
// jsPDF is loaded only when a PDF is generated, to keep the pages light.

const MARGIN = 1.5; // cm

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// jsPDF cannot read CSS: take the color from the theme palette at runtime.
const accentColor = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim();

function textRight(doc, text, y) {
  const width = doc.internal.pageSize.width;
  doc.text(text, width - doc.getTextWidth(text) - MARGIN, y);
}

// A4 document with the logo and the company details at the top.
export async function createDocument(company) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF("p", "cm", "a4");
  const logo = await loadImage("/boutikdac.png");
  doc.addImage(logo, "png", MARGIN, 0.5, 4.72, 4);

  doc.setFontSize(20);
  textRight(doc, company.name || "", 1.6);
  doc.setFontSize(12);
  textRight(doc, company.adress || "", 2.5);
  textRight(doc, company.phone || "", 3);
  textRight(doc, company.website || "", 3.5);

  doc.setLineWidth(0.05);
  doc.line(MARGIN, 5.5, doc.internal.pageSize.width - MARGIN, 5.5);
  return doc;
}

// Table with the theme accent color as header background.
export async function addTable(doc, options) {
  const { autoTable } = await import("jspdf-autotable");
  autoTable(doc, {
    ...options,
    headStyles: { fillColor: accentColor(), ...options.headStyles },
  });
}

// Client block on the left, document title on the right.
export function addClientAndTitle(doc, label, client, title) {
  doc.setFontSize(12);
  doc.text(label, MARGIN, 6.3);
  doc.setFontSize(20);
  doc.text(client.name || "", MARGIN, 7.2);
  doc.setFontSize(10);
  doc.text(client.address || "", MARGIN, 7.9);
  doc.text(client.city || "", MARGIN, 8.6);

  doc.setFontSize(20);
  textRight(doc, title, 7.5);
}

// Label/value rows aligned on the right half of the page.
export function addTotals(doc, rows, y) {
  const width = doc.internal.pageSize.width;
  doc.setLineWidth(0.05);
  doc.line(width / 2, y, width - MARGIN, y);
  rows.forEach(([label, value, big], index) => {
    const rowY = y + 1 + index * 0.7;
    doc.setFontSize(big ? 15 : 10);
    doc.text(label, width / 2 + (big ? 1 : 2), rowY);
    textRight(doc, value, rowY);
  });
}

export function addPageNumbers(doc, label) {
  const pages = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.text(
      `${label} ${page} / ${pages}`,
      doc.internal.pageSize.width - 2,
      doc.internal.pageSize.height - 0.5,
    );
  }
}
