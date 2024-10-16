import React from 'react'

import MovieCard from '../MovieCard/MovieCard'
import './MovieList.less'

const MovieList = ({ movies, onRate, guestSessionId, accessToken }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onRate={onRate} guestSessionId={guestSessionId} />
      ))}
    </div>
  )
}

export default MovieList
