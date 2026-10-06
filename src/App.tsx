import { useState, useEffect } from 'react'
import './App.css'
import type { Movie, Genre } from './api/tmdb';
import { fetchPopularMovies, fetchGenres } from './api/tmdb';
import { Link, Route, Routes } from 'react-router-dom';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';
import DetailView from './components/DetailView';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const loadedMovies = await fetchPopularMovies();
        const loadedGenres = await fetchGenres();
        setMovies(loadedMovies);
        setGenres(loadedGenres);
      } catch (err) {
        setError('Failed to load movies.')
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <header className='header'>
        <h1 className='header-title'>Popular Movies Catalog</h1>
        <nav className='header-feat'>
          <Link to="/">List</Link>
          <Link to="/gallery">Gallery</Link>
        </nav>
      </header>

      {loading && <p className='status'>Loading movies...</p>}
      {error && <p className='status'>{error}</p>}

      {!loading && !error && (
        <Routes>
          <Route path='/' element={<ListView movies={movies} genres={genres} />}></Route>
          <Route path='/gallery' element={<GalleryView movies={movies} genres={genres} />}></Route>
          <Route path='/details/:id' element={<DetailView movies={movies} />}></Route>
        </Routes>
      )}
    </div>
  );
}

export default App
