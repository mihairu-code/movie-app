import React from 'react'

import MovieCard from '../MovieCard/MovieCard'
import './MovieList.less'

const MovieList = ({ movies, onRate, onDelete, guestSessionId, accessToken, isRatedTab }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onRate={onRate}
          onDelete={onDelete}
          guestSessionId={guestSessionId}
          accessToken={accessToken}
          isRatedTab={isRatedTab}
        />
      ))}
    </div>
  )
}

export default MovieList
