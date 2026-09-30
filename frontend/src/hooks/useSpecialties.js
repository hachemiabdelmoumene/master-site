import { useState, useEffect } from 'react';
import { specialtyService } from '../services/specialtyService';

export function useSpecialties() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    specialtyService.getAllSpecialties()
      .then((data) => {
        if (isMounted) setSpecialties(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return { specialties, loading, error };
}

export function useSpecialtyDetail(slug) {
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoading(true);

    specialtyService.getSpecialtyBySlug(slug)
      .then((data) => {
        if (isMounted) setSpecialty(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [slug]);

  return { specialty, loading, error };
}
