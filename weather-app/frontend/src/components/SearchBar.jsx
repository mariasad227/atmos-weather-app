import { useEffect, useRef, useState } from "react";
import { api } from "../api";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.geocode(query.trim());
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function pick(place) {
    onSelect(place);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="search-box" ref={boxRef}>
      <span className="search-icon mono">⌕</span>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        placeholder="Find a city..."
        aria-label="Search for a city"
      />
      {loading && <span className="search-status mono">···</span>}
      {open && results.length > 0 && (
        <ul className="search-results">
          {results.map((r, i) => (
            <li key={i}>
              <button onClick={() => pick(r)}>
                <span>{r.city}</span>
                <span className="search-region mono">
                  {[r.admin1, r.country].filter(Boolean).join(", ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
