import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  IAwsModuleAsyncOptions,
  IAwsOptions,
} from './interfaces/awsModuleOptions.interface';
import { AWS_MODULE_OPTIONS } from './constants';

@Global()
@Module({})
export class AwsModule {
  public static forRootAsync(options: IAwsModuleAsyncOptions): DynamicModule {
    return {
      module: AwsModule,
      imports: options.imports,
      providers: [this.createProviders(options)],
      exports: [AWS_MODULE_OPTIONS],
    };
  }

  public static forFeature(...services: unknown[]): DynamicModule {
    const providers = services.map((service: any) => ({
      provide: `AWS_SERVICE_${service.serviceIdentifier}`,
      useFactory: (options: IAwsOptions) =>
        new service({
          credentials: {
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
          },
          region: options.region,
        }),
      inject: [AWS_MODULE_OPTIONS],
    }));
    return {
      module: AwsModule,
      providers,
      exports: providers,
    };
  }

  private static createProviders(options: IAwsModuleAsyncOptions): Provider {
    return {
      provide: AWS_MODULE_OPTIONS,
      inject: options.inject || [],
      useFactory: options.useFactory,
    };
  }
}
