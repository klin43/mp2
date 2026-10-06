import { useState } from "react";
import { Link } from "react-router-dom";
import { posterUrl } from "../api/tmdb";
import type { Movie, Genre } from "../api/tmdb";
import styles from './GalleryView.module.css';
import placeholder from '../assets/No-Image-Placeholder.svg'

interface GalleryViewProps {
    movies: Movie[];
    genres: Genre[];
}

function GalleryView({ movies, genres }: GalleryViewProps) {
    const [selectedGenres, setselectedGenres] = useState<number[]>([]);
    const showMovies: Movie[] = [];
    
    for (const i of movies) {
        if (i.poster_path === null) {
            continue;
        }

        let keep = true;
        for (const j of selectedGenres) {
            if (!i.genre_ids.includes(j)) {
                keep = false;
            }
        }
        if (keep) {
            showMovies.push(i);
        }
    }

    return (
        <div className={styles.galleryPage}>
            <div className={styles.genreFilter}>
                <p className={styles.filterLabel}>Filter by genre</p>
                <div className={styles.filterBox}>
                    {genres.map((genre) => (
                        <label key={genre.id} className={styles.genreOptions}>
                            <input type="checkbox" checked={selectedGenres.includes(genre.id)} 
                                onChange={() => {
                                    if (selectedGenres.includes(genre.id)) {
                                        setselectedGenres(selectedGenres.filter((temp) => temp !== genre.id));
                                    } else {
                                        setselectedGenres([...selectedGenres, genre.id]);
                                    }
                                }}
                            />
                            
                            {genre.name}
                        </label>
                    ))}
                </div>
            </div>
            {showMovies.length === 0 && (<p className="status">No movies match the selected genres.</p>)}
            
            <ul className={styles.galleryBody}>
                {showMovies.map((movie) => (
                    <li key={movie.id}>
                        <Link to={`/details/${movie.id}`} className={styles.galleryMovie}>
                            <img className={styles.poster} src={posterUrl(movie.poster_path) ?? placeholder}></img>
                            <p className={styles.caption}>{movie.title}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GalleryView;

/* References: 
- https://medium.com/@varimallashankar/multi-select-dropdown-in-react-build-a-reusable-and-fully-functional-component-623e7a119869
*/