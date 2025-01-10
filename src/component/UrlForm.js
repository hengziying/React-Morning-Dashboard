import React, { useState } from "react";

export default function UrlForm({ urls, onAddUrl }) {
  const [url, setUrl] = useState("");
  const [articleCount, setArticleCount] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!url) return;

    if (!articleCount) {
      alert("Please enter the number of articles to display.");
      return;
    }

    const urlExists = urls.some((curUrl) => curUrl.urlLink === url);
    if (urlExists) {
      alert("URL already exists.");
      return;
    }

    const newUrl = { urlLink: url, count: articleCount };

    onAddUrl(newUrl);
    setUrl("");
    setArticleCount("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="RSS URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Articles"
        value={articleCount}
        min="1"
        onChange={(e) => setArticleCount(Number(e.target.value))}
      />

      <button>Add</button>
    </form>
  );
}
