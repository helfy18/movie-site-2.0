import { gradient } from "./movieGrid";

interface MovieGridProps {
  movie: Movie;
}

const InfoTable = ({ movie }: MovieGridProps) => {
  const rows = [
    { label: "Title", value: movie.movie },
    {
      label: "Score",
      value: `${movie.jh_score}/100`,
      style: { color: gradient[movie.jh_score], fontWeight: "bolder" },
    },
    { label: "Universe", value: movie.universe },
    { label: "Sub Universe", value: movie.sub_universe },
    {
      label: "Genres",
      value: `${movie.genre}${movie.genre_2 ? `, ${movie.genre_2}` : ""}`,
    },
    { label: "Exclusive", value: movie.exclusive },
    { label: "Holiday", value: movie.holiday },
    { label: "Year", value: movie.year },
    { label: "MPA Rating", value: movie.rated },
    { label: "Runtime", value: `${movie.runtime} min` },
    { label: "Budget", value: `$${movie.budget}` },
    { label: "Box Office", value: `$${movie.boxoffice}` },
    { label: "Actors", value: movie.actors },
    { label: "Director", value: movie.director },
    { label: "Studio", value: movie.studio },
  ];

  return (
    <table id="infoTable" className="table">
      <tbody>
        {rows.map(
          ({ label, value, style }) =>
            value && (
              <tr key={label}>
                <td>{label}</td>
                <td style={style}>{value}</td>
              </tr>
            )
        )}
      </tbody>
    </table>
  );
};

export default InfoTable;
