import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
//    return 'Hello World!';
      return '<a href="www.google.fr">link</a>'
  }
}
