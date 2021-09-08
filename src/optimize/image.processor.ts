import * as AdmZip from 'adm-zip';
import { buffer } from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import { Job, DoneCallback } from 'bull';

async function imageProcessor(job: Job, doneCallback: DoneCallback) {
  const files: Express.Multer.File[] = job.data.files;

  const optimizationPromises: Array<Promise<Buffer>> = files.map(file => {
    const fileBuffer = Buffer.from(file.buffer);
    return buffer(fileBuffer, {
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
  });

  const optimizedImages = await Promise.all(optimizationPromises);

  const zip = new AdmZip();

  optimizedImages.forEach((image, index) => {
    const fileData = files[index];
    zip.addFile(fileData.originalname, image);
  });

  doneCallback(null, zip.toBuffer());
}

export default imageProcessor;
