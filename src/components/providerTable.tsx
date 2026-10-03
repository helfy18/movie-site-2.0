import Link from "next/link";
import Image from "next/image";
import { providerSearchUrl } from "@/providerSearch";

interface Props {
  movie: Movie;
}

const renderProviderRow = (
  label: string,
  providers: ProviderInfo[],
  title: string,
  fallback: string,
) => (
  <tr key={label}>
    <td>{label}</td>
    <td className="flex flex-wrap gap-0.5">
      {providers?.map((provider) => (
        <Link
          href={providerSearchUrl(provider.provider_id, title, fallback)}
          target="_blank"
          className="pr-4"
          rel="noopener noreferrer"
          key={provider.provider_id}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w154/${provider.logo_path}`}
            height={45}
            width={45}
            alt={provider.provider_name}
            className="rounded-full"
          />
        </Link>
      ))}
      {!providers?.length && <span className="text-muted">Not Available</span>}
    </td>
  </tr>
);

const ProviderTable = ({ movie }: Props) => {
  const { link, flatrate, rent, buy, ads, free } = movie.provider;
  const freeProviders = [...(free ?? []), ...(ads ?? [])].filter(
    (provider, index, all) =>
      all.findIndex((p) => p.provider_id === provider.provider_id) === index,
  );
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={2}>Providers - Brought to You By JustWatch.com</th>
        </tr>
      </thead>
      <tbody>
        {renderProviderRow("With Account", flatrate, movie.movie, link)}
        {freeProviders.length > 0 &&
          renderProviderRow("For Free", freeProviders, movie.movie, link)}
        {renderProviderRow("For Rent", rent, movie.movie, link)}
        {renderProviderRow("To Buy", buy, movie.movie, link)}
      </tbody>
    </table>
  );
};

export default ProviderTable;
