import React, { useState, useEffect, useCallback } from 'react'
import { Spin, Alert, Input, Layout, Pagination, Tabs } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'

import { createGuestSession, getRatedMovies, hasGuestSession, removeRating, ACCESS_TOKEN } from '../../api/tmdb.js'
import MovieList from '../MovieList/MovieList'
import './App.less'
import { GenreProvider } from '../../contexts/GenreContext.jsx'

const { Header, Content } = Layout

const App = () => {
  const [guestSessionId, setGuestSessionId] = useState(null)
  const [movies, setMovies] = useState([])
  const [ratedMovies, setRatedMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [query, setQuery] = useState('')
  const [currentTab, setCurrentTab] = useState('1')
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

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
        ? `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&page=${page}`
        : `https://api.themoviedb.org/3/movie/popular?page=${page}`

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      })

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

  const debouncedFetchMovies = useCallback(
    debounce((searchQuery, page) => fetchMovies(searchQuery, page), 500),
    []
  )

  useEffect(() => {
    const initSession = async () => {
      try {
        if (!hasGuestSession()) {
          const sessionId = await createGuestSession()
          setGuestSessionId(sessionId)
          console.log('Создана новая гостевая сессия:', sessionId)
        } else {
          const sessionId = localStorage.getItem('guestSessionId')
          setGuestSessionId(sessionId)
          console.log('Используется существующая гостевая сессия:', sessionId)
        }
      } catch (error) {
        console.error('Ошибка при создании гостевой сессии:', error)
      }
    }
    initSession()
  }, [])

  useEffect(() => {
    if (guestSessionId) {
      const fetchRatedMovies = async () => {
        try {
          const ratedMoviesData = await getRatedMovies(guestSessionId)
          setRatedMovies(ratedMoviesData.results)
        } catch (error) {
          console.error('Ошибка при получении оценённых фильмов:', error)
        }
      }
      fetchRatedMovies()
    }
  }, [guestSessionId])

  const handleDelete = async (movieId) => {
    try {
      await removeRating(movieId, guestSessionId)
      setRatedMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId))
    } catch (error) {
      console.error('Ошибка при удалении фильма из оценённых:', error)
    }
  }

  const handleTabChange = (key) => {
    setCurrentTab(key)
  }

  useEffect(() => {
    fetchMovies(query, currentPage)
  }, [query, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    setCurrentPage(1)
    debouncedFetchMovies(value, 1)
  }

  const handleRate = async (movieId, rating) => {
    console.log(`Rated movie with id ${movieId}: ${rating}`)
    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${guestSessionId}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ value: rating }),
      })

      if (!response.ok) {
        throw new Error('Не удалось оценить фильм')
      }

      console.log(`Фильм с ID ${movieId} оценён на ${rating}`)

      // Обновляем оцененные фильмы
      const updatedRatedMovies = await getRatedMovies(guestSessionId)
      setRatedMovies(updatedRatedMovies.results)
    } catch (error) {
      console.error('Ошибка при выставлении рейтинга:', error)
    }
  }

  return (
    <GenreProvider>
      <Layout className="app">
        <Header>
          <Tabs
            activeKey={currentTab}
            onChange={handleTabChange}
            items={[
              {
                label: 'Search',
                key: '1',
                children: (
                  <Input.Search
                    placeholder="Search for a movie..."
                    enterButton="Search"
                    size="large"
                    onChange={handleSearch}
                  />
                ),
              },
              {
                label: 'Rated',
                key: '2',
                children: null, // Здесь не нужно рендерить MovieList
              },
            ]}
          />
        </Header>

        <Content className="content">
          {isOffline ? (
            <Alert message="You are offline" type="warning" showIcon />
          ) : loading ? (
            <Spin className="spin" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : currentTab === '1' && movies.length ? (
            <>
              <MovieList
                movies={movies}
                onRate={handleRate}
                guestSessionId={guestSessionId}
                accessToken={ACCESS_TOKEN}
                isRatedTab={false}
              />
              <Pagination
                current={currentPage}
                total={totalPages * 10}
                onChange={handlePageChange}
                pageSize={20}
                showSizeChanger={false}
              />
            </>
          ) : currentTab === '1' ? (
            <Alert message="No movies found" type="info" showIcon />
          ) : (
            <MovieList movies={ratedMovies} onDelete={handleDelete} isRatedTab={true} />
          )}
        </Content>
      </Layout>
    </GenreProvider>
  )
}

export default App
