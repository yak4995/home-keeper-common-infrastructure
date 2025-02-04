import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

@Injectable()
export class DtoClassTransformationPipe implements PipeTransform {
  transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }
    return plainToInstance(metatype, value);
  }
}
