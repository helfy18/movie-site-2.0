import Image from "next/image";

interface Props {
  movie: Movie;
}

const OtherSiteReviews = ({ movie }: Props) => {
  const sites = [
    {
      name: "IMDb",
      logo: "/imdb.png",
      width: 80,
      href: "https://www.imdb.com/",
      value: movie.imdb,
    },
    {
      name: "Rotten Tomatoes",
      logo: "/rt.png",
      width: 140,
      href: "https://www.rottentomatoes.com/",
      value: movie.rottentomatoes,
    },
    {
      name: "Metacritic",
      logo: "/metacritic.png",
      width: 175,
      href: "https://www.metacritic.com/",
      value: movie.metacritic,
    },
  ];

  return (
    <table className="text-center">
      <tbody>
        {sites.map((site) => (
          <tr key={site.name}>
            <td>
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center"
              >
                <Image
                  src={site.logo}
                  height={40}
                  width={site.width}
                  alt={site.name}
                />
              </a>
            </td>
            <td>{site.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OtherSiteReviews;
