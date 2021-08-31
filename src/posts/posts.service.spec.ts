import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import User from '../users/entities/user.entity';
import { UpdatePostDto } from './dto/updatePost.dto';

describe('PostsService', () => {
  let service: PostsService;
  const apiService = {
    getAllPosts() {
      return [] as unknown;
    },

    getPostById(id: number) {
      return [] as unknown;
    },

    replacePost(id: number, post: UpdatePostDto) {
      return true;
    },

    createPost(post: CreatePostDto, user: User) {
      return true;
    },

    deletePost(id: number) {
      return true;
    },
  };
  const postId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    })
      .overrideProvider(PostsService)
      .useValue(apiService)
      .compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should call getPostById with expected param', () => {
    const getPostByIdMock = jest.spyOn(service, 'getPostById');
    service.getPostById(postId);
    expect(getPostByIdMock).toBeCalledWith(postId);
  });

  it('should call replacePost with expected params', () => {
    const replaceBody = new UpdatePostDto();
    const replacePostMock = jest.spyOn(service, 'replacePost');
    service.replacePost(postId, replaceBody);
    expect(replacePostMock).toBeCalledWith(postId, replaceBody);
  });

  it('should call createPost with expected params', () => {
    const createBody = new CreatePostDto();
    const user = new User();
    const createPostMock = jest.spyOn(service, 'createPost');
    service.createPost(createBody, user);
    expect(createPostMock).toBeCalledWith(createBody, user);
  });

  it('should call deletePost with expected params', () => {
    const deletePostMock = jest.spyOn(service, 'deletePost');
    service.deletePost(postId);
    expect(deletePostMock).toBeCalledWith(postId);
  });
});
