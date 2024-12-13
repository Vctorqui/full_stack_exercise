import { Category } from '@/src/types/types'
import { fetchApi } from './base'
import { API_ENDPOINTS } from '@/src/lib/const'

export async function getApiCategories() {
  return fetchApi<Category[]>(API_ENDPOINTS.CATEGORIES)
}

export async function getApiCategoryById(id: string) {
  return fetchApi<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`)
}

export async function createCategory(category: Omit<Category, 'id'>) {
  return fetchApi<Category>(API_ENDPOINTS.CATEGORIES, {
    method: 'POST',
    body: JSON.stringify(category),
  })
}

export async function deleteApiCategory(id: string) {
  return fetchApi<void>(`${API_ENDPOINTS.CATEGORIES}/${id}`, {
    method: 'DELETE',
  })
}
