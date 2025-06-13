import { jsPDF } from 'jspdf';

export const handleGeneratePDF = (wishes) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set font to support Cyrillic characters
  doc.addFont('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf', 'DejaVuSans', 'normal');
  doc.setFont('DejaVuSans');
  
  // Set initial position
  let y = 20;
  
  // Add decorative header
  doc.setFillColor(41, 128, 185); // Blue color
  doc.rect(0, 0, 210, 30, 'F');
  
  // Add title with white color
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Поздравления', 105, 20, { align: 'center' });
  
  // Reset text color to black
  doc.setTextColor(0, 0, 0);
  
  // Add wishes
  doc.setFontSize(12);
  wishes.forEach((wish, index) => {
    // Add some spacing between wishes
    y += 20;
    
    // If we're near the bottom of the page, add a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
      
      // Add decorative header to new page
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Поздравления', 105, 20, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      y = 40;
    }
    
    // Add decorative divider
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(15, y - 5, 195, y - 5);
    
    // Add wish number with decorative circle
    doc.setFillColor(41, 128, 185);
    doc.circle(25, y, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text((index + 1).toString(), 25, y + 3, { align: 'center' });
    
    // Reset text color to black for wish text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    // Add the wish text with proper indentation
    const wishText = wish;
    const splitText = doc.splitTextToSize(wishText, 150);
    doc.text(splitText, 40, y);
    
    // Increase y position based on the number of lines in split text
    y += (splitText.length * 7) + 10;
  });

  const timestamp = new Date().toISOString().split('T')[0];
  
  // Add decorative footer
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 280, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(`Сгенерировано: ${timestamp}`, 105, 290, { align: 'center' });
  
  // Save the PDF
  doc.save(`Поздравления_${timestamp}.pdf`);
};