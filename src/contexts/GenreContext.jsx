import React, { createContext, useState, useEffect } from 'react'

import { getGenres } from '../api/tmdb' // Импортируем функцию для получения жанров

export const GenreContext = createContext()

export const GenreProvider = ({ children }) => {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    // Получаем список жанров при старте приложения
    const fetchGenres = async () => {
      try {
        const response = await getGenres()
        setGenres(response.genres) // Сохраняем список жанров в состояние
      } catch (error) {
        console.error('Ошибка при загрузке жанров:', error)
      }
    }

    fetchGenres()
  }, [])

  return <GenreContext.Provider value={genres}>{children}</GenreContext.Provider>
}
