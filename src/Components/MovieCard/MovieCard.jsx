import React from 'react'
import { Card, Rate, Tag } from 'antd'
import { format } from 'date-fns'
import './MovieCard.less'

const { Meta } = Card

const MovieCard = ({ movie }) => {
  const { title, release_date, overview, vote_average, genre_ids, poster_path } = movie

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    const truncated = text.slice(0, text.lastIndexOf(' ', maxLength)) // Используем slice
    return truncated + '...'
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
      <Meta
        title={title}
        description={
          <>
            <p>{release_date ? format(new Date(release_date), 'MMMM d, yyyy') : 'Release date unknown'}</p>
            <p>{truncateText(overview, 150)}</p>
            <div className="genres"></div>
            <Rate disabled defaultValue={vote_average} count={10} /> {/* Рейтинг от 0 до 5 */}
          </>
        }
      />
    </Card>
  )
}

export default MovieCard
