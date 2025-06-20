'use client';

import { useEffect } from 'react';

interface Props {
  slug: string;
}

export default function VisitasCounter({ slug }: Props) {
  useEffect(() => {
    fetch(`/api/visitas/${slug}`).catch((err) => {
      console.error('Error al contar visita:', err);
    });
  }, [slug]);

  return null;
}
