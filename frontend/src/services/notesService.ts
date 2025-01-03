import { fetchApi } from './base'
import { API_ENDPOINTS } from '@/src/lib/const'
import { Note } from '@/src/types/types'

// GET
export async function getApiNotes() {
  return fetchApi<Note[]>(API_ENDPOINTS.NOTES)
}

export async function getNoteById(id: string) {
  return fetchApi<Note>(`${API_ENDPOINTS.NOTES}/${id}`)
}

// POST
export async function createNote(note: Omit<Note, 'id'>) {
  return fetchApi<Note>(API_ENDPOINTS.NOTES, {
    method: 'POST',
    body: JSON.stringify(note),
  })
}

// PUT
export async function updateNote(id: string, note: Partial<Note>) {
  return fetchApi<Note>(`${API_ENDPOINTS.NOTES}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(note),
  })
}

// DELETE
export async function deleteNote(id: string) {
  return fetchApi<void>(`${API_ENDPOINTS.NOTES}/${id}`, {
    method: 'DELETE',
  })
}
