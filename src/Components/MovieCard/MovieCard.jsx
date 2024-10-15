import React, { useContext, useState } from 'react'
import { Card, Rate, Tag, Tooltip } from 'antd'
import { format } from 'date-fns'

import { GenreContext } from '../../contexts/GenreContext'
import './MovieCard.less'

const { Meta } = Card

const MovieCard = ({ movie, onRate }) => {
  const { title, release_date, overview, vote_average, genre_ids, poster_path } = movie
  const genres = useContext(GenreContext)

  const [userRating, setUserRating] = useState(null)

  const handleRateChange = (value) => {
    setUserRating(value)
    onRate(movie.id, value)
  }

  const truncateText = (text, genreCount) => {
    const minLength = 150 // Минимальная длина текста
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
      <div className="movie-rating" style={{ backgroundColor: getRatingColor(vote_average) }}>
        {vote_average.toFixed(1)}
      </div>
      <Meta
        title={
          <Tooltip title={title}>
            <span className="movie-title">{title}</span> {/* Ограничиваем длину названия */}
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
