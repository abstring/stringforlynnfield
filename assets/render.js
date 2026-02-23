(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const state = {
      events: null,
      news: null,
      featured: null,
    };

    loadSection({
      url: "assets/data/events.json",
      selector: "[data-events-list]",
      renderFn: renderEvents,
      loadingText: "Loading events...",
      emptyText: "No upcoming events right now—check back soon.",
      onData: (data) => {
        state.events = data;
        renderFeatured(state);
      },
    });

    loadSection({
      url: "assets/data/news.json",
      selector: "[data-news-list]",
      renderFn: renderNews,
      loadingText: "Loading news...",
      emptyText: "No news articles yet—stay tuned for updates.",
      onData: (data) => {
        state.news = data;
        renderFeatured(state);
      },
    });

    loadFeatured("assets/data/featured.json", state);
  });

  async function loadSection(options) {
    const { url, selector, renderFn, loadingText, emptyText, onData } = options;
    const container = document.querySelector(selector);
    if (!container) return;

    setStatus(container, loadingText);

    try {
      const data = await fetchJSON(url);
      if (!data || data.length === 0) {
        setStatus(container, emptyText);
        return;
      }
      const list = normalizeList(data);
      if (!list || list.length === 0) {
        setStatus(container, emptyText);
        return;
      }

      renderFn(container, list);
      if (onData) onData(list);
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

      if (event.registerLink) {
        const registerButton = document.createElement("a");
        registerButton.href = event.registerLink;
        registerButton.textContent = "REGISTER";
        registerButton.className = "btn event-register";
        registerButton.target = "_blank";
        registerButton.rel = "noreferrer";
        card.appendChild(registerButton);
      }

      if (event.link) {
        const link = document.createElement("a");
        link.href = event.link;
        link.textContent = event.linkLabel || "Learn more";
        link.className = "event-link";
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

  async function loadFeatured(url, state) {
    const container = document.querySelector("[data-featured-card]");
    if (!container) return;

    setStatus(container, "Loading highlight...");

    try {
      const data = await fetchJSON(url);
      state.featured = data;
      renderFeatured(state);
    } catch (err) {
      console.error(`Error loading ${url}:`, err);
      setStatus(container, "Unable to load highlight right now.");
    }
  }

  function renderFeatured(state) {
    const container = document.querySelector("[data-featured-card]");
    if (!container || !state.featured) return;

    const { type, id } = state.featured;
    const source = type === "news" ? state.news : state.events;
    if (!source) return; // wait for data

    const item = (source || []).find((entry) => entry.id === id);
    if (!item) {
      setStatus(container, "No featured item selected.");
      return;
    }

    container.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = "Front Page Campaign News";
    container.appendChild(heading);

    const title = document.createElement("p");
    title.innerHTML = `<strong>${item.title}</strong>`;
    container.appendChild(title);

    if (type === "event" && item.meta) {
      const meta = document.createElement("p");
      meta.textContent = item.meta;
      container.appendChild(meta);
    }

    if (type === "news" && item.summary) {
      const summary = document.createElement("p");
      summary.textContent = item.summary;
      container.appendChild(summary);
    }

    if (item.description && type === "event") {
      const desc = document.createElement("p");
      desc.textContent = item.description;
      container.appendChild(desc);
    }

    if (type === "event" && item.registerLink) {
      const registerButton = document.createElement("a");
      registerButton.href = item.registerLink;
      registerButton.textContent = "REGISTER";
      registerButton.className = "btn event-register";
      registerButton.target = "_blank";
      registerButton.rel = "noreferrer";
      container.appendChild(registerButton);
    }

    if (item.link) {
      const link = document.createElement("a");
      link.href = item.link;
      link.textContent = item.linkLabel || (type === "news" ? "Read more" : "Learn more");
      if (type === "event") link.className = "event-link";
      link.target = "_blank";
      link.rel = "noreferrer";
      container.appendChild(link);
    }
  }

  function normalizeList(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    return [];
  }
})();
