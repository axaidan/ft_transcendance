import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
	cloud_name: 'dq998jfzk',
	api_key: '925464494533329',
	api_secret: 'zI5pBfQ2cNfad3zNmm0_QLAOFOs',
	})

  },
};