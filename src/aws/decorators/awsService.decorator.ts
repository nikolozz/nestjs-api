import { Inject } from '@nestjs/common';

export const InjectAwsService = (service: any) =>
  Inject(`AWS_SERVICE_${service.serviceIdentifier}`);
