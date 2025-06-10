import { jsPDF } from 'jspdf';

export const handleGeneratePDF = (wishes) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set font to support Cyrillic characters
  doc.addFont('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf', 'DejaVuSans', 'normal');
  doc.setFont('DejaVuSans');
  
  // Set initial position
  let y = 20;
  
  // Add title
  doc.setFontSize(16);
  doc.text('Поздравления', 105, y, { align: 'center' });
  
  // Add wishes
  doc.setFontSize(12);
  wishes.forEach((wish, index) => {
    // Add some spacing between wishes
    y += 20;
    
    // If we're near the bottom of the page, add a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    // Add the wish with number
    const wishText = `${index + 1}. ${wish}`;
    const splitText = doc.splitTextToSize(wishText, 180);
    doc.text(splitText, 15, y);
    
    // Increase y position based on the number of lines in split text
    y += (splitText.length - 1) * 7;
  });

  const timestamp = new Date().toISOString().split('T')[0];
  
  // Save the PDF
  doc.save(`Поздравления_${timestamp}.pdf`);
};