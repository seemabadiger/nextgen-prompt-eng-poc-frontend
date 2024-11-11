import html2pdf from "html2pdf.js";

const preloadImage = (images) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Enable cross-origin if needed
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png'); // Convert to base64
          resolve({url: images, data: dataUrl}); // Resolve with base64 string
        };
        img.onerror = () => reject('Error loading image: ' + images);
        img.src = images; // Trigger image loading
      });
}; 

const generatePdf = async (mockups) => {
    if (mockups.length) {
        const images = await Promise.all(mockups.flatMap(mockup => mockup.images.map(i => preloadImage(i))));
        
        const htmlString = mockups.map((mockup, index) => {
        const addPageBreakClass = index > 0 ? 'class="addPageBreak"' : '';
        const string = `
        <!-- Header Section -->
        <div ${addPageBreakClass} style="color: #6c63ff; font-weight: bold; font-size: 1.5em;">
            ${mockup?.domainname} 
            <span style="font-size: 1em; color: #333; font-weight: normal;">| ${mockup?.subdomainname}</span>
        </div>
        
        <!-- Title and Tags in Same Line -->
        <div style="display: flex; align-items: center; margin-top: 10px;">
            <h1 style="font-weight: bold; font-size: 1.8em; color: #333; margin: 0 10 0 0;">${mockup.title}</h1>
            <div style="display: flex; gap: 10px;">
             ${mockup.tags.map(tag => `<div style="background-color: #f0f0f0; color: #666; padding: 5px 10px; border-radius: 5px; font-size: 0.9em;">${tag}</div>`).join('')}
            </div>
        </div>
        
        <!-- Description Paragraph -->
        <p style="margin-top: 10px; color: #666; line-height: 1.6;">
             ${mockup.description}
        </p>
        
        <!-- Image Section (full-width with padding) -->
        <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr; gap: 20px;">
         ${
            mockup.images.map(image => {
                return `<img src="${images.find(i =>i.url === image).data}" alt="mockup image" style="width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">`
            }).join('')
        }
        </div>
        `
        return string
        }).join('');

        const pdfOptions = {
            margin: 0.2,
            filename: "download.pdf",
            image: { type: "png", quality: 0.98 },
            html2canvas: { scale: 2},
            jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
            pagebreak:    { 
                before: '.addPageBreak',
                avoid: ['img'], // Avoid breaking images across pages
              }
        };

        const element = document.createElement("div");
        element.innerHTML = htmlString;
        html2pdf().set(pdfOptions).from(element).save();
    }
};

export default generatePdf;