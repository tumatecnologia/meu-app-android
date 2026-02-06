import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const processPaymentImage = async (file) => {
  let imageSource = file;

  // 1. Tratamento de PDF
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;
    imageSource = canvas.toDataURL('image/jpeg', 0.85);
  } 
  // 3. Ajuste de Qualidade para Mobile (Android/iPhone)
  else {
    imageSource = await optimizeImage(file);
  }

  const worker = await createWorker('por');
  const { data: { text } } = await worker.recognize(imageSource);
  await worker.terminate();
  return text;
};

async function optimizeImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSide = 1600;
        if (width > maxSide || height > maxSide) {
          if (width > height) {
            height *= maxSide / width;
            width = maxSide;
          } else {
            width *= maxSide / height;
            height = maxSide;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
