// Récupération des paramètres pour la page commande
const params = new URLSearchParams(window.location.search);
const plat = params.get("plat") || "Choisissez un plat depuis le menu";
const prix = parseInt(params.get("prix") || "0", 10);

const nomElt = document.getElementById("nomPlat");
const prixElt = document.getElementById("prixPlat");
const prixUnitElt = document.getElementById("prixUnit");
const totalElt = document.getElementById("totalPrix");
const qtyInput = document.getElementById("qty");
const btnAdd = document.getElementById("btnAdd");
const btnVider = document.getElementById("btnVider");
const btnPayer = document.getElementById("btnPayer");
const modePaiement = document.getElementById("modePaiement");
const toast = document.getElementById("toast");
const listePanier = document.getElementById("listePanier");
const totalPanier = document.getElementById("totalPanier");

function formatFcfa(v) {
  return `${v.toLocaleString("fr-FR")} FCFA`;
}

function chargerPanier() {
  try {
    return JSON.parse(localStorage.getItem("panier")) || [];
  } catch (e) {
    return [];
  }
}

function sauverPanier(items) {
  localStorage.setItem("panier", JSON.stringify(items));
}

function renderPanier() {
  const items = chargerPanier();
  if (!listePanier) return;
  listePanier.innerHTML = "";

  if (!items.length) {
    listePanier.innerHTML = '<li class="item-vide">Votre panier est vide.</li>';
    if (totalPanier) totalPanier.textContent = "0 FCFA";
    return;
  }

  let total = 0;
  items.forEach((it) => {
    const li = document.createElement("li");
    li.className = "item-panier";
    const ligneTotal = it.prix * it.qte;
    total += ligneTotal;
    li.innerHTML = `
      <div>
        <div class="libelle">${it.nom}</div>
        <div class="details">${it.qte} × ${formatFcfa(it.prix)}</div>
      </div>
      <div class="prix-ligne">${formatFcfa(ligneTotal)}</div>
    `;
    listePanier.appendChild(li);
  });
  if (totalPanier) totalPanier.textContent = formatFcfa(total);
}

if (nomElt) nomElt.textContent = plat;
if (prixElt) prixElt.textContent = formatFcfa(prix);
if (prixUnitElt) prixUnitElt.textContent = formatFcfa(prix);

function updateTotal() {
  const qty = Math.max(1, parseInt(qtyInput?.value || "1", 10));
  if (qtyInput) qtyInput.value = qty;
  const total = qty * prix;
  if (totalElt) totalElt.textContent = formatFcfa(total);
}
if (qtyInput) qtyInput.addEventListener("input", updateTotal);
updateTotal();

if (btnAdd) {
  btnAdd.addEventListener("click", () => {
    const qty = Math.max(1, parseInt(qtyInput?.value || "1", 10));
    const items = chargerPanier();
    items.push({ nom: plat, prix, qte: qty });
    sauverPanier(items);
    renderPanier();
    if (toast) {
      toast.textContent = `${qty} x ${plat} ajouté`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1500);
    }
  });
}

if (btnVider) {
  btnVider.addEventListener("click", () => {
    sauverPanier([]);
    renderPanier();
  });
}

if (btnPayer) {
  btnPayer.addEventListener("click", () => {
    const mode = modePaiement?.value || "momo";
    if (toast) {
      toast.textContent = `Mode ${mode.toUpperCase()} sélectionné. (Paiement à intégrer)`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1500);
    }
  });
}

// Filtrage des catégories sur le menu
function filtrer(cat) {
  const cards = document.querySelectorAll(".plats .plat");
  cards.forEach((card) => {
    const show = cat === "all" || card.classList.contains(cat);
    card.style.display = show ? "flex" : "none";
  });

  const tabs = document.querySelectorAll(".categories li");
  tabs.forEach((li) => li.classList.toggle("active", li.dataset.cat === cat));
}

// Activer l'onglet "Tout" par défaut si présent
window.addEventListener("DOMContentLoaded", () => {
  const defaultTab = document.querySelector(".categories li[data-cat='all']");
  if (defaultTab) defaultTab.classList.add("active");
  updateTotal();
  renderPanier();
});
