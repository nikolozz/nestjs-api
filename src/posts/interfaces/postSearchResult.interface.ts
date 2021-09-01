import { PostSearchBody } from './postSearchBody.interface';

export interface PostsSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}
