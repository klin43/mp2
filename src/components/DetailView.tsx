import { useState, useEffect } from "react";
import { fetchMovieDetail, posterUrl} from "../api/tmdb";
import type { Movie, MovieDetail } from "../api/tmdb";
import { useParams, useNavigate } from "react-router-dom";
import styles from './DetailView.module.css';
import placeholder from '../assets/No-Image-Placeholder.svg'
import nextArrow from '../assets/arrow-right-solid-full.svg'
import prevArrow from '../assets/arrow-left-solid-full.svg'

interface DetailViewProps {
    movies: Movie[];
}

function DetailView({ movies }: DetailViewProps) {
    const [loadedMovie, setLoadedMovie] = useState<MovieDetail | null>(null);
    const {id} = useParams<{id: string}>();
    const [error, setError] = useState(false);
    const nav = useNavigate();
    // given movie id, load full movie details 
    useEffect(() => {
        async function loadMovie() {
            if (id === undefined) {
                return; 
            }
            setError(false);
            try {
                const movieDetails = await fetchMovieDetail(id);
                setLoadedMovie(movieDetails);
            } catch {
                setError(true);
            }
        }
        loadMovie();
    }, [id]);

    let currMovie: MovieDetail | null = null; 
    if (loadedMovie !== null && String(loadedMovie.id) === id) {
        currMovie = loadedMovie;
    }

    // prev next btns 
    let idx = -1; 
    for (let i = 0; i < movies.length; i++) {
        if(String(movies[i].id) === id) {
            idx = i;
        }
    }

    let genreOut = 'None listed';
    let runtimeOut = 'Not available';
    if (currMovie !== null) {
        const temp: string[] = [];
        for (const i of currMovie.genres) {
            temp.push(i.name);
        }
        if (temp.length > 0) {
            genreOut = temp.join(', ');
        }
        if (currMovie.runtime) {
            runtimeOut = `${currMovie.runtime} minutes`;
        }
    }

    return (
        <div className={styles.detailPage}>
            <div className={styles.arrowBox}>
                <button className={styles.arrowBtn} disabled={idx <=0} onClick={() => nav(`/details/${movies[idx - 1].id}`)}>
                    <img className={styles.arrowIcon} src={prevArrow}></img>
                </button>
                <button className={styles.arrowBtn} disabled={idx === -1 || idx >= movies.length -1} onClick={() => nav(`/details/${movies[idx + 1].id}`)}>
                    <img className={styles.arrowIcon} src={nextArrow}></img>
                </button>
            </div>

            {error && <p>Movie not found.</p>}
            {currMovie === null && !error && <p>Loading movie...</p>}
            
            {currMovie !== null && (
                <div className={styles.detailContent}>
                    <img className={styles.posterImage} src={posterUrl(currMovie.poster_path) ?? placeholder}></img>
                    <div>
                        <h2 className={styles.detailTitle}>{currMovie.title}</h2>
                        <dl className={styles.info}>
                            <dt>Release date</dt>
                            <dd>{currMovie.release_date === '' ? 'Unknown' : currMovie.release_date} </dd>

                            <dt>Genres</dt>
                            <dd>{genreOut} </dd>

                            <dt>Language</dt>
                            <dd>{currMovie.original_language.toUpperCase()} </dd>

                            <dt>Runtime</dt>
                            <dd>{runtimeOut} </dd>

                            <dt>Status</dt>
                            <dd>{currMovie.status} </dd>

                            <dt>Overview</dt>
                            <dd>{currMovie.overview === '' ? 'No overview available.' : currMovie.overview} </dd>
                        </dl>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetailView;

/* References:
- FontAwesome svg images for previous and next arrows https://fontawesome.com/search?q=arrow&ic=free-collection
- https://reactrouter.com/api/hooks/useNavigate
- https://www.geeksforgeeks.org/reactjs/how-to-disable-a-button-in-reactjs/
*/