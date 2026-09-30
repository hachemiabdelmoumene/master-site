import { useState, useEffect, useMemo } from 'react';
import { resourceService } from '../services/resourceService';

export function useResources({ specialtySlug, moduleId, semester, category, searchQuery } = {}) {
  const [drives, setDrives] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = {};
    if (specialtySlug) params.specialty_slug = specialtySlug;
    if (moduleId) params.module_id = moduleId;

    Promise.all([
      resourceService.getDrives(params),
      resourceService.getYouTubeVideos(params),
    ])
      .then(([drivesData, videosData]) => {
        if (!isMounted) return;
        setDrives(drivesData);
        setVideos(videosData);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [specialtySlug, moduleId]);

  const filteredDrives = useMemo(() => {
    return drives.filter((item) => {
      const matchSem = !semester || item.semester === semester;
      const matchCat = !category || item.category === category;
      const matchQuery = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.module_code && item.module_code.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSem && matchCat && matchQuery;
    });
  }, [drives, semester, category, searchQuery]);

  const filteredVideos = useMemo(() => {
    return videos.filter((item) => {
      return !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.module_code && item.module_code.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  }, [videos, searchQuery]);

  return { drives: filteredDrives, videos: filteredVideos, loading };
}
