import React, { useState, useEffect } from 'react'
import { Spin, Alert, Input, Layout } from 'antd'

import MovieList from '../MovieList/MovieList'
import './App.less'

const { Header, Content } = Layout

const App = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [query, setQuery] = useState('') // Для хранения поискового запроса

  // Функция получения популярных фильмов
  const fetchPopularMovies = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/movie/popular?api_key=e08d20aa35868692ffd33dd582333223'
      )
      if (!response.ok) {
        throw new Error('Ошибка при загрузке популярных фильмов')
      }
      const data = await response.json()
      setMovies(data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Функция получения фильмов по запросу
  const fetchMovies = async (query) => {
    if (!navigator.onLine) {
      setIsOffline(true)
      return
    }

    setLoading(true)
    setError(null)
    setIsOffline(false)

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=e08d20aa35868692ffd33dd582333223&query=${query}`
      )
      if (!response.ok) {
        throw new Error('Ошибка при загрузке фильмов')
      }
      const data = await response.json()
      setMovies(data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Эффект для загрузки популярных фильмов при монтировании компонента
  useEffect(() => {
    fetchPopularMovies()

    window.addEventListener('online', () => setIsOffline(false))
    window.addEventListener('offline', () => setIsOffline(true))

    return () => {
      window.removeEventListener('online', () => setIsOffline(false))
      window.removeEventListener('offline', () => setIsOffline(true))
    }
  }, [])

  // Эффект для динамического поиска при изменении запроса
  useEffect(() => {
    if (query === '') {
      fetchPopularMovies() // Показываем популярные фильмы, если запрос пустой
    } else {
      const delayDebounceFn = setTimeout(() => {
        fetchMovies(query) // Выполняем поиск по запросу с задержкой
      }, 500) // Задержка 500 мс для оптимизации запросов

      return () => clearTimeout(delayDebounceFn) // Очищаем таймер при каждом изменении
    }
  }, [query])

  // Функция обработки изменения запроса через input
  const handleSearch = (e) => {
    setQuery(e.target.value)
  }

  return (
    <Layout className="app">
      <Header>
        <Input
          placeholder="Search for a movie..."
          size="large"
          value={query}
          onChange={handleSearch}
          allowClear // Добавляет возможность очистки поля
        />
      </Header>

      <Content className="content">
        {isOffline ? (
          <Alert message="You are offline" type="warning" showIcon />
        ) : loading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : movies.length ? (
          <MovieList movies={movies} />
        ) : (
          <Alert message="No movies found" type="info" showIcon />
        )}
      </Content>
    </Layout>
  )
}

export default App
