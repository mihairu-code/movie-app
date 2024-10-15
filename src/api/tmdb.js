const API_KEY = 'e08d20aa35868692ffd33dd582333223' // Твой ключ
const BASE_URL = 'https://api.themoviedb.org/3'

export const getGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
    if (!response.ok) {
      throw new Error('Не удалось получить список жанров')
    }
    return await response.json() // Возвращаем JSON с жанрами
  } catch (error) {
    console.error('Ошибка при запросе жанров:', error)
    throw error
  }
}
