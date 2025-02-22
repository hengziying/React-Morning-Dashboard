import Dashboard from "./component/Dashboard";
import LayoutForm from "./component/LayoutForm";
import UrlForm from "./component/UrlForm";
import React, { useEffect, useState } from "react";
import FeedList from "./component/FeedList";

export default function App() {
  //retrieve urls, columns, and rows from local storage
  const savedUrls = JSON.parse(localStorage.getItem("urls")) || [
    {
      urlLink: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
      count: 5,
    },
    {
      urlLink: "https://feeds.theguardian.com/theguardian/world/rss",
      count: 5,
    },
  ];

  const savedColumns = JSON.parse(localStorage.getItem("columns")) || 2;
  const savedRows = JSON.parse(localStorage.getItem("rows")) || 2;

  const [Urls, setUrls] = useState(savedUrls);
  const [columns, setColumns] = useState(savedColumns);
  const [rows, setRows] = useState(savedRows);

  //save columns, row, and urls to local storage when they change
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [columns, rows]);

  useEffect(() => {
    localStorage.setItem("urls", JSON.stringify(Urls));
  }, [Urls]);

  function handleAddUrl(newUrl) {
    setUrls((prevUrl) => [...prevUrl, newUrl]);
  }

  function handleColumnsChange(val) {
    setColumns(val);
  }

  function handleRowsChange(val) {
    setRows(val);
  }

  function handleArticleCountChange(urlLinkToChange, newCount) {
    setUrls((urls) =>
      urls.map((url) =>
        url.urlLink === urlLinkToChange ? { ...url, count: newCount } : url
      )
    );
  }

  function handleDeleteUrl(urlLinkToDlt) {
    setUrls((urls) => urls.filter((url) => url.urlLink !== urlLinkToDlt));
  }

  return (
    <div className="dashboard">
      <Dashboard />
      <UrlForm urls={Urls} onAddUrl={handleAddUrl} />
      <LayoutForm
        columns={columns}
        rows={rows}
        onColChange={handleColumnsChange}
        onRowChange={handleRowsChange}
      />
      <div
        className="grid-container"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, auto)`,
        }}
      >
        {Urls.map((url) => (
          <FeedList
            key={url.urlLink}
            url={url}
            onDlt={handleDeleteUrl}
            onChangeCount={handleArticleCountChange}
          />
        ))}
      </div>
    </div>
  );
}
