const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector(".nav__menu");
const navLinks = document.querySelectorAll(".nav__link");
const revealElements = document.querySelectorAll(".reveal");
const projectCards = document.querySelectorAll(".project-card");
const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalTools = document.querySelector("#modal-tools");
const modalResult = document.querySelector("#modal-result");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const profilePhotos = document.querySelectorAll(".profile-card__photo");
const imageModal = document.querySelector("#image-modal");
const imageModalImg = document.querySelector("#image-modal-img");
const imageModalTitle = document.querySelector("#image-modal-title");
const closeImageButtons = document.querySelectorAll("[data-close-image]");

const toggleMenu = () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
};

const closeMenu = () => {
  navMenu.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

navToggle.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-45% 0px -48% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const openProjectModal = (card) => {
  const title = card.querySelector("h3").textContent;
  const description = card.querySelector("p").textContent;
  const result = card.querySelector("strong").textContent;
  const tools = [...card.querySelectorAll(".project-card__tags span")].map(
    (tag) => tag.textContent
  );

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalResult.textContent = result;
  modalTools.innerHTML = tools.map((tool) => `<span>${tool}</span>`).join("");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modal.querySelector(".project-modal__close").focus();
};

const closeProjectModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

const openImageModal = (button) => {
  const imageSrc = button.dataset.imageSrc;
  const imageTitle = button.dataset.imageTitle;

  imageModalImg.src = imageSrc;
  imageModalImg.alt = imageTitle;
  imageModalTitle.textContent = imageTitle;
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  imageModal.querySelector(".image-modal__close").focus();
};

const closeImageModal = () => {
  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  imageModalImg.src = "";
};

profilePhotos.forEach((button) => {
  button.addEventListener("click", () => openImageModal(button));
});

closeImageButtons.forEach((button) => {
  button.addEventListener("click", closeImageModal);
});

projectCards.forEach((card) => {
  card.addEventListener("click", () => openProjectModal(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectModal(card);
    }
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeProjectModal();
  }

  if (event.key === "Escape" && imageModal.classList.contains("is-open")) {
    closeImageModal();
  }
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();

  formStatus.classList.remove("is-error");

  if (!name || !email || !message) {
    formStatus.textContent = "Merci de completer tous les champs.";
    formStatus.classList.add("is-error");
    return;
  }

  if (!isValidEmail(email)) {
    formStatus.textContent = "Merci d'indiquer une adresse email valide.";
    formStatus.classList.add("is-error");
    return;
  }

  formStatus.textContent = "Message pret a etre envoye. Merci pour votre prise de contact.";
  contactForm.reset();
});
