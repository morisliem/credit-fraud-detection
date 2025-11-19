export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`)
    if (!res.ok) {
        throw new Error(`[GET] ${path} failed with ${res.status}`)
    }
    return res.json()
}

export async function apiUpload<T>(
    path: string,
    file: File,
    fieldName = 'file'
): Promise<T> {
    const formData = new FormData()
    formData.append(fieldName, file)

    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) {
        throw new Error(`[POST] ${path} failed with ${res.status}`)
    }
    return res.json()
}