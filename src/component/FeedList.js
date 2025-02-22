import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import RSSParser from "rss-parser";

const parser = new RSSParser();

export default function FeedList({ url, onDlt, onChangeCount }) {
  const [feeds, setFeeds] = useState("");
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const corsProxy = "https://morning-dashboard-backend.onrender.com/proxy?url=";

  function handleOpen() {
    setIsOpen((isOpen) => !isOpen);
  }

  function handleDlt() {
    onDlt(url.urlLink);
  }

  function handleChangeCount(newCount) {
    onChangeCount(url.urlLink, newCount);
  }

  function handleRefresh() {
    parseFeed(url);
  }

  async function parseFeed(url) {
    try {
      const response = await fetch(`${corsProxy}${url.urlLink}`);
      console.log(response);
      const feedData = await response.text();
      const feeds = await parser.parseString(feedData);
      setFeeds(feeds);

      setItems(feeds.items.slice(0, url.count));
    } catch (error) {
      console.error("Error parsing RSS feed:", error);
    }
  }

  useEffect(() => {
    parseFeed(url);
  }, [url]);

  return (
    <div className="card">
      <div className="card-header">
        <h2>{feeds.title}</h2>
        <div className="card-header-buttons">
          <button className="round-btn" onClick={handleDlt}>
            ✖
          </button>
          <Popup
            trigger={<button className="round-btn">⚙</button>}
            modal
            closeOnDocumentClick
          >
            {(close) => (
              <div className="popup-content">
                <PopupForm
                  onChangeCount={(newCount) => {
                    handleChangeCount(newCount);
                    close();
                  }}
                  articleCount={url.count}
                  title={feeds.title}
                />
              </div>
            )}
          </Popup>
          <button className="round-btn" onClick={handleRefresh}>
            ↻
          </button>
          <button className="round-btn" onClick={handleOpen}>
            {isOpen ? "-" : "🗖"}
          </button>
        </div>
      </div>
      <div>
        {isOpen && (
          <ul>
            {items.map((feed) => (
              <Feed key={feed.link} feed={feed} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PopupForm({ onChangeCount, articleCount, title }) {
  const [count, setCount] = useState(articleCount);

  function handleSubmit(e) {
    e.preventDefault();
    onChangeCount(count);
  }

  return (
    <form onSubmit={handleSubmit} className="popup-form">
      <p>No. of Article for {title}</p>
      <input
        type="number"
        name="Number of Articles"
        placeholder="Number of Articles"
        value={count}
        min="1"
        onChange={(e) => setCount(Number(e.target.value))}
      />
      <button>Save</button>
    </form>
  );
}

function Feed({ feed }) {
  const publishDate = feed.pubDate ? new Date(feed.pubDate) : null;
  const curDate = new Date();

  const diff = curDate - publishDate;

  console.log(diff);

  let timeAgo = null; // Default timeAgo if no pubDate exists

  if (publishDate && !isNaN(publishDate)) {
    const diff = curDate - publishDate;
    console.log(diff);

    // Convert time difference
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      timeAgo = `${years}year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
      timeAgo = `${months}month${months > 1 ? "s" : ""}`;
    } else if (weeks > 0) {
      timeAgo = `${weeks}w`;
    } else if (days > 0) {
      timeAgo = `${days}d`;
    } else if (hours > 0) {
      timeAgo = `${hours}h`;
    } else if (minutes > 0) {
      timeAgo = `${minutes}m`;
    } else {
      timeAgo = `${seconds}s`;
    }
  }

  return (
    <li>
      <a
        href={feed.link}
        target="_blank"
        rel="noopener noreferrer"
        className="feed-link"
      >
        <h3 className="feed-title">{feed.title}</h3>
        <span className="feed-time">{timeAgo}</span>
      </a>
    </li>
  );
}
