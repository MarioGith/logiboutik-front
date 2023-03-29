import { jsPDF } from "jspdf";

const generatePDF = (
  company_name,
  company_adress,
  company_phone,
  company_website
) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF("p", "cm", "a4");
  const pageWidth = doc.internal.pageSize.width;

  var img = new Image();

  img.src = "/boutikdac.png";

  //Header;
  doc.addImage(img, "png", 1.5, 0.5, 4.72, 4);
  doc.setFontSize(20);
  const widthTitle = doc.getTextWidth(company_name);
  doc.text(company_name, pageWidth - widthTitle - 1.5, 1.6);
  doc.setFontSize(12);
  const widthAddress = doc.getTextWidth(company_adress);
  doc.text(company_adress, pageWidth - widthAddress - 1.5, 2.5);
  const widthTel = doc.getTextWidth(company_phone);
  doc.text(company_phone, pageWidth - widthTel - 1.5, 3);
  const widthSite = doc.getTextWidth(company_website);
  doc.text(company_website, pageWidth - widthSite - 1.5, 3.5);

  // Divider
  doc.setLineWidth(0.05);
  doc.line(1.5, 5.5, pageWidth - 1.5, 5.5);

  return doc;
};

export default generatePDF;
