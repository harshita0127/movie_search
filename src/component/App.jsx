import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [movie, setMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=717508db`);
        if (res.data.Response === 'True') {
          setSuggestions(res.data.Search);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching suggestions');
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchMovie = async (title) => {
    try {
      const res = await axios.get(`https://www.omdbapi.com/?t=${title}&apikey=717508db`);
      if (res.data.Response === 'True') {
        setMovie(res.data);
        setError('');
        setSuggestions([]);
        setQuery(title);

        // YouTube trailer embed URL
        const youtubeQuery = encodeURIComponent(`${res.data.Title} official trailer`);
        const youtubeSearchUrl = `https://www.youtube.com/embed?listType=search&list=${youtubeQuery}`;
        setTrailerUrl(youtubeSearchUrl);
      } else {
        setMovie(null);
        setError('Movie not found!');
        setTrailerUrl('');
      }
    } catch (err) {
      setError('Error fetching data');
      setTrailerUrl('');
    }
  };

  return (
    <div className="app">
      <h1 className="title">🎬 Movie Mart</h1>

      <div className="search-box">
        <input
          className="search-input"
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" onClick={() => searchMovie(query)}>
          Search
        </button>

        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((movie) => (
              <li key={movie.imdbID} onClick={() => searchMovie(movie.Title)}>
                {movie.Title} ({movie.Year})
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {movie && (
        <div className="movie-card">
          <img src={movie.Poster} alt={movie.Title} />
          <h2>{movie.Title} ({movie.Year})</h2>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Plot:</strong> {movie.Plot}</p>
          <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>

          
        </div>
      )}
    </div>
  );
}

export default App;
