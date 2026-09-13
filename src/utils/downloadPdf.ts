import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function downloadMarksheetPDF(elementId: string, fileName: string = 'BIEK_Marks_Sheet.pdf'): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  // Clone element to a temporary clean container with 0 scale, exact A4 pixel dimensions
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Strip transform/scale and shadows from the clone
  clone.style.transform = 'none';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.outline = 'none';
  clone.style.margin = '0';
  clone.style.position = 'absolute';
  clone.style.left = '-99999px';
  clone.style.top = '0';
  clone.style.width = '794px'; // 210mm at 96 DPI
  clone.style.minHeight = '1123px'; // 297mm at 96 DPI
  clone.style.backgroundColor = '#ffffff';

  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2.5, // Crisp high resolution output
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Initialize 1-page A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Add exactly 1 page
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(fileName);
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    return false;
  } finally {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}
