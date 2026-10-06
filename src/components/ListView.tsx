import { useState } from "react";
import { Link } from "react-router-dom";
import { posterUrl } from "../api/tmdb";
import type { Movie, Genre } from "../api/tmdb";
import styles from './ListView.module.css';
import placeholder from '../assets/No-Image-Placeholder.svg'

type sortOptions = 'popularity' | 'release_date' | 'title';
type order = 'asc' | 'desc';

interface ListViewProps {
    movies: Movie[];
    genres: Genre[];
}

interface ShowMovie {
    movie: Movie;
    genreNames: string[];
}

/* References: 
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
- https://dev.to/dave123456/make-an-accessible-search-bar-in-react-15p4
- https://aryamansingh.hashnode.dev/building-a-sort-by-list-feature-in-react-with-styled-component
- https://commons.wikimedia.org/wiki/File:No-Image-Placeholder.svg 
- https://www.geeksforgeeks.org/reactjs/how-to-implement-multiple-filters-in-react/
- https://stackoverflow.com/questions/63184650/how-to-set-separator-between-list-element-properly-with-css-and-html
- Used Coolors for website color palette: https://coolors.co/564787-dbcbd8-f2fdff-9ad4d6-101935

- Pearl: #F2FDFF
- Teal: #9AD4D6
- Navy: #101935
- White: #FFFFFF
*/
function ListView({ movies, genres }: ListViewProps) {
    const [options, setSortOptions] = useState<sortOptions>('popularity');
    const [order, setOrder] = useState<order>('desc');
    const [query, setQuery] = useState('');

    // sort and filter search bar
    const userSearch = query.trim().toLowerCase();
    const filteredMovies: Movie[] = [];
    for (const i of movies) {
        if (i.title.toLowerCase().includes(userSearch)) {
            filteredMovies.push(i);
        }
    }

    filteredMovies.sort((a, b) => {
        let out = 0;
        if (options === 'popularity') {
            out = a.popularity - b.popularity;
        } else if (options === 'title') {
            out = a.title.localeCompare(b.title);
        } else {
            out = a.release_date.localeCompare(b.release_date);
        }

        if (order === 'desc') {
            out = -out;
        } 
        return out;
    });

    const showMovies: ShowMovie[] = [];
    for (const i of filteredMovies) {
        const genreNames: string[] = [];
        for (const j of i.genre_ids) {
            for (const k of genres) {
                if (k.id === j) {
                    genreNames.push(k.name);
                }
            }
        }
        showMovies.push({ movie: i, genreNames: genreNames });
    }

    return (
        <div className={styles.listPage}>
            <div className={styles.searchBar}>
                <input 
                    className={styles.search}
                    type="text"
                    placeholder="Search movies by title"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}>    
                </input>

                <label className={styles.sortLabel}>
                    Sort by: 
                    <select 
                        className={styles.item}
                        value={options}
                        onChange={(event) => setSortOptions(event.target.value as sortOptions)}>
                        
                        <option value="popularity">Popularity</option>
                        <option value="release_date">Release Date</option>
                        <option value="title">Title</option>
                    </select>
                </label>

                <label className={styles.sortLabel}>
                    Order: 
                    <select 
                        className={styles.item}
                        value={order}
                        onChange={(event) => setOrder(event.target.value as order)}>

                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>

            {showMovies.length === 0 && (<p className="status">No movies match your search.</p>)}
            <ul className={styles.movieList}>
                {showMovies.map((result) => (
                    <li key={result.movie.id}>
                        <Link to={`/details/${result.movie.id}`} className={styles.movieItem}>
                            <img className={styles.posterImage} src={posterUrl(result.movie.poster_path) ?? placeholder}></img>

                            <div>
                                <h2 className={styles.movieTitle}>{result.movie.title}</h2>
                                <p className={styles.releaseYear}>{result.movie.release_date.slice(0,4)}</p>
                                <ul className={styles.genreList}>
                                    {result.genreNames.map((genreName) => 
                                        <li key={genreName} className={styles.genre}>{genreName}</li>
                                    )}
                                </ul>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListView;