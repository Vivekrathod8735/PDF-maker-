// Convert multiple images to a single PDF with proper sizing
function convertImagesToPDF() {
    const imageInput = document.getElementById('imageInput');
    const files = imageInput.files;

    if (!files.length) {
        alert("Please select at least one image!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4'); // A4 size PDF in portrait mode

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm

    let imagePromises = [];
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        const promise = new Promise((resolve) => {
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    const imgWidth = img.width;
                    const imgHeight = img.height;

                    // Calculate the aspect ratio to scale image
                    const aspectRatio = imgWidth / imgHeight;
                    let scaledWidth, scaledHeight;

                    if (aspectRatio > pageWidth / pageHeight) {
                        // Fit image by width
                        scaledWidth = pageWidth;
                        scaledHeight = scaledWidth / aspectRatio;
                    } else {
                        // Fit image by height
                        scaledHeight = pageHeight;
                        scaledWidth = scaledHeight * aspectRatio;
                    }

                    // Center the image on the page
                    const xOffset = (pageWidth - scaledWidth) / 2;
                    const yOffset = (pageHeight - scaledHeight) / 2;

                    if (index > 0) {
                        doc.addPage();
                    }

                    doc.addImage(img.src, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);
                    resolve();
                };
            };

            reader.readAsDataURL(file);
        });
        imagePromises.push(promise);
    });

    // After all images are processed, generate the PDF
    Promise.all(imagePromises).then(() => {
        const pdfOutput = doc.output('bloburl');
        const downloadLink = document.getElementById('downloadPDF');
        downloadLink.href = pdfOutput;
        downloadLink.style.display = 'inline-block';
    });
}
