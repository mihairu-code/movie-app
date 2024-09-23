import React, { useState, useEffect, useCallback } from 'react'
import { Spin, Alert, Input, Layout, Pagination } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'

import MovieList from '../MovieList/MovieList'
import './App.less'

const { Header, Content } = Layout

const App = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [query, setQuery] = useState('')
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  // Функция получения фильмов с серверной пагинацией
  const fetchMovies = async (searchQuery, page = 1) => {
    if (!navigator.onLine) {
      setIsOffline(true)
      return
    }

    setLoading(true)
    setError(null)
    setIsOffline(false)

    try {
      const apiUrl = searchQuery
        ? `https://api.themoviedb.org/3/search/movie?api_key=e08d20aa35868692ffd33dd582333223&query=${searchQuery}&page=${page}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=e08d20aa35868692ffd33dd582333223&page=${page}`

      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error('Ошибка при загрузке фильмов')
      }

      const data = await response.json()
      setMovies(data.results)
      setTotalPages(data.total_pages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Дебаунс для поиска
  const debouncedFetchMovies = useCallback(
    debounce((searchQuery, page) => fetchMovies(searchQuery, page), 500),
    []
  )

  // Эффект для получения популярных фильмов при загрузке страницы
  useEffect(() => {
    fetchMovies(query, currentPage) // Запрос на фильмы по текущему поисковому запросу и странице
  }, [query, currentPage])

  // Функция для обработки изменения страницы пагинации
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Функция обработки изменения запроса через input
  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    setCurrentPage(1) // Сбрасываем страницу при новом поиске
    debouncedFetchMovies(value, 1) // Выполняем запрос с дебаунсом
  }

  return (
    <Layout className="app">
      <Header>
        <Input.Search placeholder="Search for a movie..." enterButton="Search" size="large" onChange={handleSearch} />
      </Header>

      <Content className="content">
        {isOffline ? (
          <Alert message="You are offline" type="warning" showIcon />
        ) : loading ? (
          <Spin
            className={'spin'}
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 48,
                }}
                spin
              />
            }
          />
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : movies.length ? (
          <>
            <MovieList movies={movies} />
            <Pagination
              current={currentPage}
              total={totalPages * 10}
              onChange={handlePageChange}
              pageSize={20}
              showSizeChanger={false}
            />
          </>
        ) : (
          <Alert message="No movies found" type="info" showIcon />
        )}
      </Content>
    </Layout>
  )
}

export default App
