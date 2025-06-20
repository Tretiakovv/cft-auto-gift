import { jsPDF } from "jspdf";

export const handleGeneratePDF = (wishes) => {
    // Create a new PDF document
    const doc = new jsPDF();

    // Set font to support Cyrillic characters
    doc.addFont(
        "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf",
        "DejaVuSans",
        "normal"
    );
    doc.setFont("DejaVuSans");

    // Set initial position
    let y = 20;

    wishes.forEach((wish, index) => {
        // If we're near the bottom of the page, add a new page
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        // Add big header for each wish
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text(`Поздравление ${index + 1}`, 20, y);
        y += 12;

        // Add the wish text with smaller spacing
        doc.setFontSize(12);
        const wishText = wish;
        const splitText = doc.splitTextToSize(wishText, 170);
        doc.text(splitText, 20, y);
        y += splitText.length * 7 + 6; // smaller spacing between blocks
    });

    const timestamp = new Date().toISOString().split("T")[0];

    // Save the PDF
    doc.save(`Поздравления_${timestamp}.pdf`);
};
