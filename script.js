// script.js — versão somente visual (sem funções de pedido/carrinho)
const App = {
  state: {
    data: window.CARDAPIO || [],
    categories: window.CATEGORIES || [],
    grouped: {},
    currentCategory: null,
  },

  els: {},

  init() {
    this.cacheElements();
    this.preprocessData();
    this.renderUI();
    this.bindEvents();
    console.log("Cardápio visual iniciado.");
  },

  cacheElements() {
    const q = (id) => document.getElementById(id);
    this.els = {
      categories: q("categories"),
      catalog: q("catalog"),
      search: q("search-input"),
    };
  },

  preprocessData() {
    const grouped = {};
    this.state.data.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    this.state.grouped = grouped;
    this.state.currentCategory =
      this.state.categories[0] || Object.keys(grouped)[0];
  },

  renderUI() {
    this.renderCategories();
    this.renderCatalog(this.state.currentCategory);
  },

  renderCategories() {
    const { categories } = this.state;
    const container = this.els.categories;
    container.innerHTML = "";

    categories.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "category-pill" + (i === 0 ? " active" : "");
      btn.textContent = cat;
      btn.dataset.cat = cat;
      btn.addEventListener("click", () => {
        // Remover ativo anterior
        document
          .querySelectorAll(".category-pill")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.state.currentCategory = cat;

        // Centralizar o botão clicado (efeito carrossel)
        const containerRect = container.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const offset =
          btnRect.left -
          containerRect.left -
          containerRect.width / 2 +
          btnRect.width / 2;
        container.scrollBy({
          left: offset,
          behavior: "smooth",
        });

        // Renderizar o catálogo da categoria
        this.renderCatalog(cat);
      });
      container.appendChild(btn);
    });
  },

  renderCatalog(category) {
    const container = this.els.catalog;
    container.innerHTML = "";
    const items = this.state.grouped[category] || [];

    if (!items.length) {
      container.innerHTML = `<p style="text-align:center;color:#999">Nenhum item encontrado.</p>`;
      return;
    }

    items.forEach((item, i) => {
      const card = document.createElement("article");
      card.className = "card";
      card.style.animationDelay = `${i * 0.04}s`;

      const thumb = document.createElement("div");
      thumb.className = "thumb";
      if (item.image) {
        thumb.style.backgroundImage = `url('${item.image}')`;
        this.makeThumbClickable(thumb, item.image);
      }

      const info = document.createElement("div");
      info.className = "info";

      const h3 = document.createElement("h3");
      h3.textContent = item.name;

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = `R$ ${item.price.toFixed(2).replace(".", ",")}`;

      info.appendChild(h3);
      if (item.description) {
        const desc = document.createElement("p");
        desc.className = "small";
        desc.textContent = item.description;
        info.appendChild(desc);
      }
      info.appendChild(price);

      card.appendChild(thumb);
      card.appendChild(info);
      container.appendChild(card);
    });
  },

  bindEvents() {
    this.els.search.addEventListener("input", (e) => {
      const term = e.target.value.trim().toLowerCase();
      if (!term) {
        this.renderCatalog(this.state.currentCategory);
        return;
      }
      this.renderSearch(term);
    });

    // Fechar modal ao clicar no X ou no fundo
    document.getElementById("modalClose").addEventListener("click", () => {
      this.closeImageModal();
    });

    document.getElementById("modalBackdrop").addEventListener("click", () => {
      this.closeImageModal();
    });

    // Fechar com tecla ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeImageModal();
      }
    });
  },

  renderSearch(term) {
    const container = this.els.catalog;
    container.innerHTML = "";

    const matches = this.state.data.filter((it) => {
      const name = it.name.toLowerCase();
      const desc = (it.description || "").toLowerCase();
      const cat = it.category.toLowerCase();

      return name.includes(term) || desc.includes(term) || cat.includes(term);
    });

    if (!matches.length) {
      container.innerHTML = `<p style="text-align:center;color:#999">Nenhum resultado para "${term}".</p>`;
      return;
    }

    matches.forEach((item, i) => {
      const card = document.createElement("article");
      card.className = "card";
      card.style.animationDelay = `${i * 0.03}s`;

      const thumb = document.createElement("div");
      thumb.className = "thumb";
      if (item.image) {
        thumb.style.backgroundImage = `url('${item.image}')`;
        this.makeThumbClickable(thumb, item.image);
      }

      const info = document.createElement("div");
      info.className = "info";

      const h3 = document.createElement("h3");
      h3.textContent = item.name;

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = `R$ ${item.price.toFixed(2).replace(".", ",")}`;

      info.appendChild(h3);
      if (item.description) {
        const desc = document.createElement("p");
        desc.className = "small";
        desc.textContent = item.description;
        info.appendChild(desc);
      }
      info.appendChild(price);

      card.appendChild(thumb);
      card.appendChild(info);
      container.appendChild(card);
    });
  },

  // ===========================
  // MODAL DE IMAGEM
  // ===========================
  openImageModal(src) {
    const modal = document.getElementById("imageModal");
    const img = document.getElementById("modalImage");
    const backdrop = document.getElementById("modalBackdrop");

    img.src = src;
    modal.classList.add("active");
    backdrop.classList.add("active");

    // Impede rolagem do body
    document.body.style.overflow = "hidden";
  },

  closeImageModal() {
    const modal = document.getElementById("imageModal");
    const backdrop = document.getElementById("modalBackdrop");

    modal.classList.remove("active");
    backdrop.classList.remove("active");

    // Restaura rolagem
    document.body.style.overflow = "";
  },

  makeThumbClickable(thumb, imageSrc) {
    if (imageSrc) {
      thumb.style.cursor = "zoom-in";
      thumb.addEventListener("click", () => {
        this.openImageModal(imageSrc);
      });
    }
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
