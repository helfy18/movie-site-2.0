import Image from "next/image";

interface props {
  movie: Movie;
}

const OtherSiteReviews = ({ movie }: props) => {
  return (
    <table className="text-center">
      <tbody>
        <tr key="imdb">
          <td>
            <div className="flex justify-center">
              <Image
                src="/imdb.png"
                height={40}
                width={80}
                alt="IMDB"
                onClick={() => window.open("https://www.imdb.com/", "_blank")}
                style={{ cursor: "pointer" }}
              />
            </div>
          </td>
          <td>{movie.imdb}</td>
        </tr>
        <tr key="rt">
          <td>
            <div className="flex justify-center">
              <Image
                src="/rt.png"
                height={40}
                width={140}
                alt="Rotten Tomatoes"
                onClick={() =>
                  window.open("https://www.rottentomatoes.com/", "_blank")
                }
                style={{ cursor: "pointer" }}
              />
            </div>
          </td>
          <td>{movie.rottentomatoes}</td>
        </tr>
        <tr key="metacritic">
          <td>
            <div className="flex justify-center">
              <Image
                src="/metacritic.png"
                height={40}
                width={175}
                alt="Metacritic"
                onClick={() =>
                  window.open("https://www.metacritic.com/", "_blank")
                }
                style={{ cursor: "pointer" }}
              />
            </div>
          </td>
          <td>{movie.metacritic}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default OtherSiteReviews;
