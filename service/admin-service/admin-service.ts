import { Article, Articles, Category, Categorys, UserProfile } from '@/types/types-and-interface';
import axios from 'axios';

function authHeaders() {
  const token = document.cookie.split('; ').find((value) => value.startsWith('token='))?.slice('token='.length);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAllArticles(title: string, page = 1, limit = 10, category?: string): Promise<Articles> {
  try {
    const response = await axios.get('/api/articles', { params: { page, limit, category, title } });
    return response.data;
  } catch {
    throw new Error('Failed when try to getAllArticles');
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await axios.get('/api/auth/profile', { headers: authHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(`Failed get user profile with error: ${error}`);
  }
}

export async function getAllCategory(page: number, limit: number, search?: string): Promise<Categorys> {
  try {
    const response = await axios.get('/api/categories', { params: { page, limit, search } });
    return response.data;
  } catch (error) {
    throw new Error(`Error when get all category: ${error}`);
  }
}

export async function createCategory(name: string): Promise<Category> {
  try {
    const response = await axios.post('/api/categories', { name }, { headers: authHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(`Error when create category: ${error}`);
  }
}

export async function editCategory(id: string, name: string): Promise<Category> {
  try {
    const response = await axios.put(`/api/categories/${id}`, { name }, { headers: authHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(`Error when edit category: ${error}`);
  }
}

export async function deleteCategory(id: string): Promise<Category> {
  try {
    const response = await axios.delete(`/api/categories/${id}`, { headers: authHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(`Error when delete category: ${error}`);
  }
}

export async function uploadArticleImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('/api/articles/upload', formData, { headers: authHeaders() });
    return response.data.imageUrl;
  } catch (error) {
    throw new Error(`Error when upload article image: ${error}`);
  }
}

export async function createArticle(title: string, content: string, categoryId: string, imageUrl?: string): Promise<Article> {
  try {
    const response = await axios.post('/api/articles', { title, categoryId, content, imageUrl }, { headers: authHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(`Error from server when create article: ${error}`);
  }
}

export async function editArticle(title: string, content: string, categoryId: string, id: string, imageUrl?: string): Promise<Article> {
  try {
    const response = await axios.put(`/api/articles/${id}`, { title, categoryId, content, imageUrl }, { headers: authHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(`Error from server when edit article: ${error}`);
  }
}

export async function deleteArticle(id: string): Promise<Article> {
  try {
    const response = await axios.delete(`/api/articles/${id}`, { headers: authHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(`Error when delete article: ${error}`);
  }
}

export async function getArticleById(id: string): Promise<Article> {
  try {
    const response = await axios.get('/api/articles', { params: { articleId: id } });
    return response.data;
  } catch {
    throw new Error('Failed when try to get article');
  }
}
