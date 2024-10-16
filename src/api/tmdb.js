const API_KEY = '477f8f7b3e3580c29df694c734019337' // Ваш API ключ
const BASE_URL = 'https://api.themoviedb.org/3'
export const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NzdmOGY3YjNlMzU4MGMyOWRmNjk0YzczNDAxOTMzNyIsIm5iZiI6MTcyOTA5NzkzOC4yNzU0NzksInN1YiI6IjY2YzljMzY0ZGNhZDc5M2I0MzNjZmE2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wn1z2v7NIYxGPbGFF7i0NKg3lZmEY7ZVlRg5jjfgv7o' // Ваш Access Token

// Получение списка жанров
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

// Создание новой гостевой сессии
export const createGuestSession = async () => {
  const guestSessionId = localStorage.getItem('guestSessionId') // Проверяем, есть ли уже сессия

  if (guestSessionId) {
    return guestSessionId // Если сессия уже есть, возвращаем её
  }

  try {
    const response = await fetch(`${BASE_URL}/authentication/guest_session/new`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error('Не удалось создать гостевую сессию')
    }

    const data = await response.json()
    localStorage.setItem('guestSessionId', data.guest_session_id) // Сохраняем guest_session_id в localStorage
    return data.guest_session_id // Возвращаем guest_session_id
  } catch (error) {
    console.error('Ошибка при создании гостевой сессии:', error)
    throw error
  }
}

// Удаление текущей гостевой сессии
export const logoutGuestSession = () => {
  localStorage.removeItem('guestSessionId') // Удаляем guest_session_id из localStorage
  console.log('Гостевая сессия удалена')
}

// Проверка наличия гостевой сессии
export const hasGuestSession = () => {
  return !!localStorage.getItem('guestSessionId') // Проверяем наличие сессии
}

// Получение оценённых фильмов по guest_session_id
export const getRatedMovies = async (guestSessionId) => {
  const url = `${BASE_URL}/guest_session/${guestSessionId}/rated/movies?language=en-US&sort_by=created_at.asc&page=1`
  console.log('Запрос на получение оценённых фильмов:', url)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} - Не удалось получить оценённые фильмы`)
    }

    const data = await response.json()
    return data // Возвращаем данные с оценёнными фильмами
  } catch (error) {
    console.error('Ошибка при получении оценённых фильмов:', error.message)
    throw error // Пробрасываем ошибку для обработки на уровне приложения
  }
}
