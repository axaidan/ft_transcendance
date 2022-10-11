import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()

export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    
      toStream(file.buffer).pipe(upload);
    });
  }

  async getTag(pbId: string) {


	console.log(pbId);
	var test = v2.image(pbId, );
	
	console.log(test)
	return test;
	let tag = v2.image(pbId, {
		transformation: [
			{ width: 250, height: 250, gravity: 'faces', crop: 'thumb' },
			{ radius: 'max' },
		  ],
	})
	console.log(tag);
	return tag;
  }
  
}