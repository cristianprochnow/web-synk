import { API_ENDPOINT } from './config';

export type TemplateOption = {
  template_id: number
  template_name: string
};

export type FetchTemplateListResponse = {
  resource: {
    ok: boolean
    error: string
  }
  templates: TemplateOption[]
};

export async function fetchBasicTemplates(): Promise<FetchTemplateListResponse> {
  const response = await fetch(API_ENDPOINT + '/templates/basic');

  return await response.json() as FetchTemplateListResponse;
}

export function hasBasicTemplates(data: FetchTemplateListResponse): boolean {
  return data.templates && data.templates.length > 0;
}