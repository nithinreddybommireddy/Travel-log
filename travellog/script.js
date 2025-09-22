const container = document.querySelector(".container");

document.querySelector(".open-navbar-icon").addEventListener("click", () => {
  container.classList.add("change");
});

document.querySelector(".close-navbar-icon").addEventListener("click", () => {
  container.classList.remove("change");
});

const colors = ["#6495ed", "#7fffd4", "#ffa07a", "#f08080", "#afeeee"];

let i = 0;

Array.from(document.querySelectorAll(".nav-link")).forEach(item => {
  item.style.cssText = `background-color: ${colors[i++]}`;
});

Array.from(document.querySelectorAll(".navigation-button")).forEach(item => {
  item.onclick = () => {
    item.parentElement.parentElement.classList.toggle("change");
  };
});

function manali(){
  window.location.href="./manali.html"
}

function goa(){
  window.location.href="./goa.html"
}

function munnar(){
  window.location.href="./munnar.html"
}

function araku(){
  window.location.href="./araku.html"
}

function pondi(){
  window.location.href="./pondi.html"
}

function kedarnath(){
  window.location.href="./kedarnath.html"
}