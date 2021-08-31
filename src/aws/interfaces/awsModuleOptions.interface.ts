export interface IAwsOptions {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface IAwsModuleAsyncOptions {
  inject?: any[];
  imports?: any[];
  useFactory: (...args: any[]) => Promise<IAwsOptions>;
}
