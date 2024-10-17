import React, { useContext, useState } from 'react'
import { Card, Rate, Tag, Tooltip, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { format } from 'date-fns'

import { GenreContext } from '../../contexts/GenreContext'
import './MovieCard.less'

const { Meta } = Card

const MovieCard = ({ movie, onRate, onDelete, guestSessionId, accessToken, isRatedTab }) => {
  const { title, release_date, overview, vote_average, genre_ids, poster_path } = movie
  const genres = useContext(GenreContext)

  const [userRating, setUserRating] = useState(null)

  const rateMovie = async (movieId, rating) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${guestSessionId}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ value: rating }),
      })

      if (!response.ok) {
        throw new Error('Не удалось оценить фильм')
      }

      console.log(`Фильм с ID ${movieId} оценён на ${rating}`)
    } catch (error) {
      console.error('Ошибка при установке рейтинга:', error)
    }
  }

  const handleRateChange = (value) => {
    setUserRating(value)
    rateMovie(movie.id, value)
    onRate(movie.id, value)
  }

  const handleDelete = () => {
    onDelete(movie.id)
  }

  const truncateText = (text, genreCount) => {
    const minLength = 150
    const adjustedMaxLength = Math.max(minLength, 150 - genreCount * 10)
    if (text.length <= adjustedMaxLength) return text
    const truncated = text.slice(0, text.lastIndexOf(' ', adjustedMaxLength))
    return truncated + '...'
  }

  const getRatingColor = (rating) => {
    if (rating <= 3) return '#E90000'
    if (rating <= 5) return '#E97E00'
    if (rating <= 7) return '#E9D100'
    return '#66E900'
  }

  return (
    <Card
      className="movie-card"
      hoverable
      cover={
        poster_path ? (
          <img alt={title} src={`https://image.tmdb.org/t/p/w500/${poster_path}`} />
        ) : (
          <img alt={title} src="https://placehold.it/300x450" />
        )
      }
    >
      {isRatedTab && (
        <Button className="delete-button" shape="circle" icon={<CloseOutlined />} size="small" onClick={handleDelete} />
      )}

      <div className="movie-rating" style={{ backgroundColor: getRatingColor(vote_average) }}>
        {vote_average.toFixed(1)}
      </div>
      <Meta
        title={
          <Tooltip title={title}>
            <span className="movie-title">{title}</span>
          </Tooltip>
        }
        description={
          <>
            <p>{release_date ? format(new Date(release_date), 'MMMM d, yyyy') : 'Release date unknown'}</p>
            <div className="genres">
              {genre_ids.map((id) => {
                const genre = genres.find((g) => g.id === id)
                return genre ? <Tag key={id}>{genre.name}</Tag> : null
              })}
            </div>
            <div className="movie-description">
              <p>{truncateText(overview, genre_ids.length)}</p>
            </div>
            <div className="rate-wrapper">
              <Rate value={userRating || vote_average} onChange={handleRateChange} count={10} />
            </div>
          </>
        }
      />
    </Card>
  )
}

export default MovieCard
