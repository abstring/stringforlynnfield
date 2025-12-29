(function () {
  document.addEventListener("DOMContentLoaded", () => {
    loadSection(
      "assets/data/events.json",
      "[data-events-list]",
      renderEvents,
      "Loading events...",
      "No upcoming events right now—check back soon."
    );

    loadSection(
      "assets/data/news.json",
      "[data-news-list]",
      renderNews,
      "Loading news...",
      "No news articles yet—stay tuned for updates."
    );
  });

  async function loadSection(url, selector, renderFn, loadingText, emptyText) {
    const container = document.querySelector(selector);
    if (!container) return;

    setStatus(container, loadingText);

    try {
      const data = await fetchJSON(url);
      if (!data || data.length === 0) {
        setStatus(container, emptyText);
        return;
      }
      renderFn(container, data);
    } catch (err) {
      console.error(`Error loading ${url}:`, err);
      setStatus(container, "Unable to load right now. Please refresh.");
    }
  }

  async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }

  function setStatus(container, text) {
    container.innerHTML = "";
    const status = document.createElement("p");
    status.className = "status-text";
    status.textContent = text;
    container.appendChild(status);
  }

  function renderEvents(container, events) {
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    events.forEach((event) => {
      const card = document.createElement("article");

      const title = document.createElement("h3");
      title.textContent = event.title;
      card.appendChild(title);

      if (event.meta) {
        const meta = document.createElement("p");
        meta.className = "meta";
        meta.textContent = event.meta;
        card.appendChild(meta);
      }

      if (event.description) {
        const desc = document.createElement("p");
        desc.textContent = event.description;
        card.appendChild(desc);
      }

      if (event.link) {
        const link = document.createElement("a");
        link.href = event.link;
        link.textContent = event.linkLabel || "Learn more";
        link.target = "_blank";
        link.rel = "noreferrer";
        card.appendChild(link);
      }

      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  }

  function renderNews(container, newsItems) {
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    newsItems.forEach((item) => {
      const card = document.createElement("article");

      const title = document.createElement("h3");
      title.textContent = item.title;
      card.appendChild(title);

      if (item.summary) {
        const summary = document.createElement("p");
        summary.textContent = item.summary;
        card.appendChild(summary);
      }

      if (item.link) {
        const link = document.createElement("a");
        link.href = item.link;
        link.textContent = item.linkLabel || "Read more";
        link.target = "_blank";
        link.rel = "noreferrer";
        card.appendChild(link);
      }

      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  }
})();
