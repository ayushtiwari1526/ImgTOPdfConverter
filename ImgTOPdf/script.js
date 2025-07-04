// jsPDF instance (UMD build)
const { jsPDF } = window.jspdf;

const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");

let selectedFiles = [];

fileInput.addEventListener("change", handleFiles);
convertBtn.addEventListener("click", convertToPDF);

function handleFiles(event) {
  selectedFiles = Array.from(event.target.files);

  preview.innerHTML = ""; // Clear previous previews

  selectedFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

async function convertToPDF() {
  if (selectedFiles.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  const pdf = new jsPDF();

  for (let i = 0; i < selectedFiles.length; i++) {
    const imgData = await readFileAsDataURL(selectedFiles[i]);

    await new Promise(resolve => {
      const img = new Image();
      img.src = imgData;

      img.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        let imgWidth = pageWidth;
        let imgHeight = (img.height * imgWidth) / img.width;

        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
          imgWidth = (img.width * imgHeight) / img.height;
        }

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        if (i !== 0) pdf.addPage();
        pdf.addImage(img, "PNG", x, y, imgWidth, imgHeight);
        resolve();
      };
    });
  }

  pdf.save("images.pdf");
}

function readFileAsDataURL(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}
