import { gradient } from "./movieGrid";

interface MovieGridProps {
  movie: Movie;
}

const InfoTable = ({ movie }: MovieGridProps) => {
  return (
    <table id="infoTable" className="table">
      <tbody>
        <tr>
          <td>Title</td>
          <td>{movie.movie}</td>
        </tr>
        <tr>
          <td>Score</td>
          <td
            style={{
              color: gradient[movie.jh_score],
              fontWeight: "bolder",
            }}
          >
            {`${movie.jh_score}/100`}
          </td>
        </tr>
        {movie.universe && (
          <tr>
            <td>Universe</td>
            <td>{movie.universe}</td>
          </tr>
        )}
        {movie.sub_universe && (
          <tr>
            <td>Sub Universe</td>
            <td>{movie.sub_universe}</td>
          </tr>
        )}
        <tr>
          <td>Genres</td>
          <td>{`${movie.genre}${movie.genre_2 && `, ${movie.genre_2}`}`}</td>
        </tr>
        {movie.exclusive && (
          <tr>
            <td>Exclusive</td>
            <td>{movie.exclusive}</td>
          </tr>
        )}
        {movie.holiday && (
          <tr>
            <td>Holiday</td>
            <td>{movie.holiday}</td>
          </tr>
        )}
        <tr>
          <td>Year</td>
          <td>{movie.year}</td>
        </tr>
        <tr>
          <td>MPA Rating</td>
          <td>{movie.rated}</td>
        </tr>
        <tr>
          <td>Runtime</td>
          <td>{movie.runtime} min</td>
        </tr>
        <tr>
          <td>Budget</td>
          <td>${movie.budget}</td>
        </tr>
        <tr>
          <td>Box Office</td>
          <td>${movie.boxoffice}</td>
        </tr>
        <tr>
          <td>Actors</td>
          <td>{movie.actors}</td>
        </tr>
        <tr>
          <td>Director</td>
          <td>{movie.director}</td>
        </tr>
        <tr>
          <td>Studio</td>
          <td>{movie.studio}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default InfoTable;
