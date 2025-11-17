import { API_ENDPOINT, bearerHeader } from './config';

export type NewPostData = {
  post_name: string | null,
  post_content: string | null,
  template_id: number | null,
  int_profile_id: number | null
};

export type EditPostData = {
  post_id: number | null
} & NewPostData;

export type CreatePostResponse = {
  resource: {
    ok: boolean
    error: string
  }
  post: CreatePostResponseInfo
};

export type CreatePostResponseInfo = {
  post_id: number
};

export type EditPostResponse = {
  resource: {
    ok: boolean
    error: string
  }
  post: EditPostResponseInfo
};

export type EditPostResponseInfo = {
  rows_affected: number
};

export type PostItem = {
  post_id: number,
  post_name: string,
  template_name: string,
  int_profile_name: string,
  created_at: string,
  status: string,
  post_content: string,
  template_id: number,
  int_profile_id: number
}

export type FetchPostListResponse = {
  resource: {
    ok: boolean
    error: string
  }
  posts: PostItem[]
}

export type FetchPostFilters = {
  postId: number | null | undefined,
  includeContent: boolean | null | undefined
};

export async function addPost(post: NewPostData, token: string): Promise<[number, CreatePostResponse]> {
  const response = await fetch(API_ENDPOINT + '/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...bearerHeader(token)
    },
    body: JSON.stringify(post)
  });
  const content = await response.json() as CreatePostResponse;

  return [response.status, content];
}

export async function editPost(post: EditPostData, token: string): Promise<[number, EditPostResponse]> {
  const response = await fetch(API_ENDPOINT + '/post', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...bearerHeader(token)
    },
    body: JSON.stringify(post)
  });
  const content = await response.json() as EditPostResponse;

  return [response.status, content];
}

export async function listPosts(params: FetchPostFilters | null = null, token: string): Promise<[number, FetchPostListResponse]> {
  const queryParams = [];

  if (params) {
    if (params.postId) {
      const postId = params.postId.toString().trim();
      queryParams.push('post_id=' + postId);
    }
    if (params.includeContent === true) {
      queryParams.push('include_content=1');
    }
  }

  const response = await fetch(API_ENDPOINT + '/post?' + queryParams.join('&'), {
    headers: bearerHeader(token)
  });
  const content = await response.json() as FetchPostListResponse;

  return [response.status, content];
}

export function hasPosts(data: FetchPostListResponse): boolean {
  return data.posts && data.posts.length > 0;
}

export async function deletePost(postId: number, token: string): Promise<[number, EditPostResponse]> {
  const response = await fetch(API_ENDPOINT + '/post', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...bearerHeader(token)
    },
    body: JSON.stringify({ post_id: postId })
  });
  const content = await response.json() as EditPostResponse;

  return [response.status, content];
}