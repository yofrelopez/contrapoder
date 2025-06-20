import { ExtendedRecordMap } from 'notion-types';
import Link from 'next/link';
import NotionRenderer from './NotionRenderer';
import { FaFacebook, FaWhatsapp, FaXTwitter, FaLinkedin } from 'react-icons/fa6';

type Props = {
  title: string;
  subtitulo: string;
  fecha?: string;
  description: string;
  url: string;
  recordMap: ExtendedRecordMap;
};

export default function NoticiaContent({ title, subtitulo, fecha, description, url, recordMap }: Props) {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{title}</h1>

      {subtitulo && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {subtitulo}
        </p>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {fecha}
      </div>

      <hr className="my-4" />

      <NotionRenderer recordMap={recordMap} />

      <div className="mt-6 flex gap-4 items-center">
        <span className="text-sm font-medium text-gray-500">Compartir:</span>

        <Link
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="w-6 h-6 text-blue-600 hover:opacity-80" />
        </Link>

        <Link
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="w-6 h-6 text-green-600 hover:opacity-80" />
        </Link>

        <Link
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaXTwitter className="w-6 h-6 text-black hover:opacity-80" />
        </Link>

        <Link
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="w-6 h-6 text-sky-700 hover:opacity-80" />
        </Link>
      </div>
    </main>
  );
}
