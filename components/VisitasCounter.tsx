'use client';

import { useEffect, useState } from 'react';

type Props = { slug: string };

export default function VisitasCounter({ slug }: Props) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Cada vez que el usuario abra la noticia, incrementamos y leemos el total
    fetch(`/api/visitas/${slug}`)
      .then((r) => r.json())
      .then((data) => setViews(data.views ?? 0))
      .catch(() => setViews(null));
  }, [slug]);

  return (
    <span>
      {views === null ? '...' : `${views} visita${views === 1 ? '' : 's'}`}
    </span>
  );
}
