
import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import "./App.css";

const API_URL = "https://api.openverse.org/v1/images/";

function App() {
  // Store photos and application states
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // References for infinite scrolling
  const observerRef = useRef(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  // =====================================
  // 1. FETCH PHOTOS FROM OPENVERSE API
  // =====================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchPhotos = async () => {
      loadingRef.current = true;
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}?q=nature&page=${page}&page_size=10`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Convert API response into our photo structure
        const newPhotos = data.results.map((item) => ({
          id: item.id,
          author: item.creator || "Unknown Author",
          title: item.title || "Untitled",
          download_url: item.thumbnail || item.url,
          original_url: item.url,
          attribution: item.attribution,
          license: item.license,
          license_url: item.license_url,
          likes: 0,
        }));

        // Append new photos to existing photos
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          ...newPhotos,
        ]);

        // Check whether more pages are available
        const morePages =
          page < data.page_count && newPhotos.length > 0;

        hasMoreRef.current = morePages;
        setHasMore(morePages);

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching photos:", err);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    };

    fetchPhotos();

    return () => {
      controller.abort();
    };
  }, [page, retryCount]);

  // =====================================
  // 2. INFINITE SCROLLING
  // =====================================

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (
          target.isIntersecting &&
          !loadingRef.current &&
          hasMoreRef.current
        ) {
          // Prevent multiple API requests
          loadingRef.current = true;

          // Load next page
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    const element = observerRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // =====================================
  // 3. LIKE FUNCTIONALITY
  // =====================================

  const handleLike = (id) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === id
          ? {
              ...photo,
              likes: photo.likes + 1,
            }
          : photo
      )
    );
  };

  // =====================================
  // 4. RETRY FUNCTIONALITY
  // =====================================

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // =====================================
  // 5. UI
  // =====================================

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>Photo Gallery</h1>
        <p>Explore beautiful photographs</p>
      </header>

      {/* Photo Gallery */}
      <main className="gallery">

        {photos.map((photo) => (
          <article className="photo-card" key={photo.id}>

            {/* Image */}
            <a
              href={photo.original_url}
              target="_blank"
              rel="noreferrer"
              className="image-link"
            >
              <img
                src={photo.download_url}
                alt={photo.title}
                className="photo"
                loading="lazy"
              />
            </a>

            {/* Author and Like Button */}
            <div className="photo-info">

              <div className="author-info">
                <h3>{photo.author}</h3>
                <p>{photo.title}</p>
              </div>

              <button
                className="like-button"
                onClick={() => handleLike(photo.id)}
                aria-label={`Like photo by ${photo.author}`}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                <span>{photo.likes}</span>
              </button>

            </div>

            {/* Image Attribution and License */}
            <div className="attribution">

              {photo.attribution && (
                <div>{photo.attribution}</div>
              )}

              {photo.license_url && (
                <a
                  href={photo.license_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  License: {photo.license}
                </a>
              )}

            </div>

          </article>
        ))}

      </main>

      {/* Loading Indicator */}
      {loading && (
        <p className="loading">
          Loading more photos...
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>

          <button onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {/* End of Gallery */}
      {!hasMore && photos.length > 0 && (
        <p className="end-message">
          You have reached the end of the gallery!
        </p>
      )}

      {/* Observer Target */}
      <div
        ref={observerRef}
        className="observer"
      />

    </div>
  );
}

export default App;
