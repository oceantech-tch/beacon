import React, { useState } from "react";
import "./fontIcons/autoComplete.css";

interface Props {
  options: string[];
  onSelect: (value: string) => void;
}

const AutoComplete: React.FC<Props> = ({ options, onSelect }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (value: string) => {
    onSelect(value);
    setQuery(value);
    setOpen(false);
  };

  return (
    <div className="auto-wrap">
      <input
        className="auto-input"
        value={query}
        placeholder="Search G-Shock models..."
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && query.trim() !== "" && filtered.length > 0 && (
        <div className="auto-list">
          {filtered.map((model) => (
            <div
              key={model}
              className="auto-item"
              onClick={() => handleSelect(model)}
            >
              {model}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;