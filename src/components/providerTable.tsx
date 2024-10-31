import { getProviderLink } from "@/utils";
import Link from "next/link";
import Image from "next/image";

interface props {
  movie: Movie;
}

const renderProviderRow = (label: string, providers: ProviderInfo[]) => (
  <tr key={label.toLowerCase()}>
    <td>{label}</td>
    <td className="flex flex-wrap gap-0.5">
      {providers?.map((provider, index) => (
        <Link
          href={getProviderLink(provider.provider_id)}
          target="_blank"
          className="pr-4"
          rel="noopener noreferrer"
          key={`${label}-${index}`}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w154/${provider.logo_path}`}
            height={45}
            width={45}
            alt="provider"
          />
        </Link>
      ))}
    </td>
  </tr>
);

const ProviderTable = ({ movie }: props) => {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={2}>Providers - Brought to You By JustWatch.com</th>
        </tr>
      </thead>
      <tbody>
        {renderProviderRow("With Account", movie.provider.flatrate)}
        {renderProviderRow("For Rent", movie.provider.rent)}
      </tbody>
    </table>
  );
};

export default ProviderTable;
