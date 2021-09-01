import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FilesRepository } from './files.repository';
import { getAwsServiceToken } from '../aws/utils/aws.utils';
import { ConfigService } from '@nestjs/config';
import { Stream } from 'stream';

describe('FilesService', () => {
  const fileId = 1;
  const publicFile = {
    id: 1,
    key: 'fileKey',
    url: 's3url',
  };
  const publicFileUploadResult = {
    Location: publicFile.url,
    Key: publicFile.key,
  };
  const privateFile = {
    ...publicFile,
    owner: { id: 1 },
  };
  const s3Mock = {
    upload: jest.fn(),
    deleteObject: jest.fn(),
    getObject: jest.fn(),
    getSignedUrlPromise: jest.fn(),
    promise: jest.fn(),
    createReadStream: jest.fn(),
  };
  const mockedConfigService = {
    get(key: string) {
      switch (key) {
        case 'JWT_EXPIRATION_TIME':
          return '3600';
        case 'AWS_PRIVATE_BUCKET_NAME':
          return 'private_bucket';
      }
    },
  };
  const filesRepositoryMock = {
    createPublicFile: () => jest.fn(),
    getPublicFile: () => jest.fn(),
    deletePublicFile: jest.fn(),
    getPrivateFile: () => jest.fn(),
    createPrivateFile: () => jest.fn(),
    deletePrivateFile: jest.fn(),
  };
  let filesService: FilesService;
  let s3Service: typeof s3Mock;
  let filesRepository: FilesRepository;

  afterEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: FilesRepository, useValue: filesRepositoryMock },
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: getAwsServiceToken('s3'), useValue: s3Mock },
      ],
    }).compile();

    filesService = module.get<FilesService>(FilesService);
    s3Service = module.get<typeof s3Mock>(getAwsServiceToken('s3'));
    filesRepository = module.get<FilesRepository>(FilesRepository);
  });

  describe('uploadPublicFile', () => {
    it('should upload public file on S3', async () => {
      const uploadSpy = jest.spyOn(s3Service, 'upload').mockReturnThis();
      const promiseSpy = jest
        .spyOn(s3Service, 'promise')
        .mockReturnValue(Promise.resolve(publicFileUploadResult));
      const createPublicFileSpy = jest
        .spyOn(filesRepository, 'createPublicFile')
        .mockReturnValue(Promise.resolve(publicFile));
      const file = await filesService.uploadPublicFile(
        Buffer.alloc(10),
        publicFile.key,
      );
      expect(uploadSpy).toBeCalled();
      expect(promiseSpy).toBeCalled();
      expect(createPublicFileSpy).toBeCalledWith(file.url, file.key);
      expect(file).toBe(publicFile);
    });
  });

  describe('deletePublicFile', () => {
    it('should throw error if file does not exists', async () => {
      jest
        .spyOn(filesRepository, 'getPublicFile')
        .mockReturnValue(Promise.resolve(null));
      expect(() => filesService.deletePublicFile(fileId)).rejects.toThrow();
    });
    it('should delete file if exists', async () => {
      jest
        .spyOn(filesRepository, 'getPublicFile')
        .mockReturnValue(Promise.resolve(publicFile));
      expect(() => filesService.deletePublicFile(fileId)).rejects.not.toThrow();
    });
  });

  describe('getPrivateFile', () => {
    it('should throw error if file does not exists', async () => {
      jest
        .spyOn(filesRepository, 'getPrivateFile')
        .mockReturnValue(Promise.resolve(null));
      expect(() => filesService.getPrivateFile(fileId)).rejects.toThrow();
    });

    it('should return stream', async () => {
      jest
        .spyOn(filesRepository, 'getPrivateFile')
        .mockReturnValue(Promise.resolve(privateFile as any));
      const getObjectSpy = jest.spyOn(s3Service, 'getObject').mockReturnThis();
      jest
        .spyOn(s3Service, 'createReadStream')
        .mockReturnValue(Promise.resolve(new Stream()));
      const file = await filesService.getPrivateFile(fileId);
      expect(getObjectSpy).toBeCalledWith({
        Bucket: 'private_bucket',
        Key: privateFile.key,
      });
      expect(file).toEqual({
        stream: new Stream(),
        info: privateFile,
      });
    });
  });

  describe('generatePresignedUrl', () => {
    it('should generate presigned url', async () => {
      const url = await filesService.generatePresignedUrl(privateFile.key);
      const getSignedUrlPromiseSpy = jest
        .spyOn(s3Service, 'getSignedUrlPromise')
        .mockReturnValue(Promise.resolve(privateFile.url));
      expect(getSignedUrlPromiseSpy).toBeCalledWith('getObject', {
        Bucket: 'private_bucket',
        Key: privateFile.key,
      });
    });
  });
});
