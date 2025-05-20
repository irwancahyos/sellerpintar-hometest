// ******** Imports ********
import { Articles, Category, UserProfile } from '@/types/types-and-interface';
import axios from 'axios';

/**
 * This query to get all articles with params page and limit
 * @param page - the page start with 1
 * @param limit - the limit is 10 per page
 * @returns array of object
 */
export async function getAllArticles(title: string, page = 1, limit = 10, category?:string): Promise<Articles> {
  try {
    const respon = await axios.get("https://test-fe.mysellerpintar.com/api/articles", {
      params: {
        page,
        limit,
        category,
        title
      }
    });

    return respon.data;
  } catch(err) {
    throw new Error("Failed when try to getAllArticles");
  }
}

/**
 * Get the current user's profile from the API.
 *
 * @returns {Promise<any>} User profile data.
 * @throws {Error} If the request fails.
 */
export async function getUserProfile(): Promise<UserProfile> {

  // ******** Get token from local storage ********
  const token = document?.cookie?.split(';').filter(el => el.trim().startsWith('token')).join('').replace('token=','').trim();

  try {
    const respon = await axios.get('https://test-fe.mysellerpintar.com/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return respon.data;
  } catch(e) {
    throw new Error(`Failed get user profile with error: ${e}`)
  }
}

/**
 * Get all category with send page and limit
 */
export async function  getAllCategory(page:number, limit:number, search?: string,) {
  try {
    const respon = await axios.get('https://test-fe.mysellerpintar.com/api/categories', {
      params: {
        page,
        limit,
        search
      }
    })

    return respon.data;
  } catch(e) {
    throw new Error(`Error when get all category: ${e}`)
  }
}

/**
 * Upload image API send image from user upload
 * @return - string {imageUrl: "https//blablabla"}
 */
export async function uploadImage(imageFile: File): Promise<string> {

  // ******** Get token from local storage ********
  const token = document?.cookie?.split(';').filter(el => el.trim().startsWith('token')).join('').replace('token=','').trim();

  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const respon = await axios.post('https://test-fe.mysellerpintar.com/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }
    })

    return respon?.data?.imageUrl
  } catch(e) {
    throw new Error(`Error when upload image: ${e}`);
  }
}

/**
 * Api to create category with send name and get respon with new category data
 */
export async function createCategory(name: string): Promise<Category> {

  // ******** Get token from local storage ********
  const token = document?.cookie?.split(';').filter(el => el.trim().startsWith('token')).join('').replace('token=','').trim();
  
  try {
    const respon = await axios.post(
      'https://test-fe.mysellerpintar.com/api/categories',
      {
        name,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return respon?.data;
  } catch (e) {
    throw new Error(`Error when upload image: ${e}`);
  }
}

/**
 * Api to create category with send name and get respon with new category data
 */
export async function editCategory(id: string, name: string): Promise<Category> {

  // ******** Get token from local storage ********
  const token = document?.cookie?.split(';').filter(el => el.trim().startsWith('token')).join('').replace('token=','').trim();
  
  try {
    const respon = await axios.put(
      `https://test-fe.mysellerpintar.com/api/categories/${id}`,
      {
        name
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return respon?.data;
  } catch (e) {
    throw new Error(`Error when upload image: ${e}`);
  }
}


/**
 * Api to create category with send name and get respon with new category data
 */
export async function deleteCategory(id: string): Promise<Category> {

  // ******** Get token from local storage ********
  const token = document?.cookie?.split(';').filter(el => el.trim().startsWith('token')).join('').replace('token=','').trim();
  
  try {
    const respon = await axios.delete(`https://test-fe.mysellerpintar.com/api/categories/${id}`, {
      
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return respon?.data;
  } catch (e) {
    throw new Error(`Error when upload image: ${e}`);
  }
}

// ******** API Articles ********

/**
 * Api to create Article with send title , content, id user and id of category
 */
export async function createArticle(title: string, content: string, categoryId: string): Promise<Category> {

  // ******** Get token from local storage ********
  const token = document?.cookie?.split(';').filter(el => el.trim().startsWith('token')).join('').replace('token=','').trim();
  
  try {
    const respon = await axios.post(`https://test-fe.mysellerpintar.com/api/articles`, {
      title,
      categoryId,
      content
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return respon?.data;
  } catch (e) {
    throw new Error(`Error from server when create article: ${e}`);
  }
}

/**
 * Api to edit Article with send title , content, id user and id of category
 */
export async function editArticle(title: string, content: string, categoryId: string, id:string): Promise<Category> {

  // ******** Get token from local storage ********
  const token = document?.cookie?.split(';').filter(el => el.trim().startsWith('token')).join('').replace('token=','').trim();
  
  try {
    const respon = await axios.put(`https://test-fe.mysellerpintar.com/api/articles/${id}`, {
      title,
      categoryId,
      content
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,

      }
    });

    return respon?.data;
  } catch (e) {
    throw new Error(`Error from server when create article: ${e}`);
  }
}

/**
 * Api to create category with send name and get respon with new category data
 */
export async function deleteArticle(id: string): Promise<Category> {

  // ******** Get token from local storage ********
  const token = document?.cookie?.split(';').filter(el => el.trim().startsWith('token')).join('').replace('token=','').trim();
  
  try {
    const respon = await axios.delete(`https://test-fe.mysellerpintar.com/api/articles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return respon?.data;
  } catch (e) {
    throw new Error(`Error when upload image: ${e}`);
  }
}

// ******** API User ********

/**
 * Api to get one article
 */
export async function getArticleById(id: string) {
  try {
    const respon = await axios.get(`https://test-fe.mysellerpintar.com/api/articles/?articleId=${id}`);

    return respon.data;
  } catch(err) {
    throw new Error("Failed when try to getAllArticles");
  }
}