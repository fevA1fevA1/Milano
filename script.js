const progress = document.getElementById("progress");

function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  progress.style.width = (scrollTop / docHeight) * 100 + "%";
}

window.addEventListener("scroll", updateProgress);
updateProgress();

const scenes = document.querySelectorAll(".scene, .day-intro, .coming-soon, footer");

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
    }
  });
},{threshold:.18});

scenes.forEach(scene=>{
  scene.classList.add("fade-section");
  observer.observe(scene);
});

const menuLinks = document.querySelectorAll(".menu a");
const daySections = document.querySelectorAll("#tag1,#tag2,#tag3");

const dayObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      menuLinks.forEach(link=>link.classList.remove("active"));
      const active = document.querySelector(`.menu a[href="#${entry.target.id}"]`);
      if(active) active.classList.add("active");
    }
  });
},{threshold:.35});

daySections.forEach(section=>dayObserver.observe(section));

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll",()=>{
  navbar.classList.toggle("scrolled", window.scrollY > 80);
});


// Countdown bis Reisebeginn
const tripDate = new Date("2026-07-03T08:50:00");

function updateCountdown(){
  const now = new Date();
  const diff = tripDate - now;
  const daysElement = document.getElementById("countdownDays");

  if(!daysElement) return;

  if(diff <= 0){
    daysElement.textContent = "Jetzt";
    return;
  }

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  daysElement.textContent = days + " Tage";
}

updateCountdown();


// Live Wetter Mailand über Open-Meteo
async function loadWeather(){
  const tempEl = document.getElementById("weatherTemp");
  const descEl = document.getElementById("weatherDesc");

  if(!tempEl || !descEl) return;

  try{
    const url = "https://api.open-meteo.com/v1/forecast?latitude=45.4642&longitude=9.1900&current_weather=true";
    const response = await fetch(url);
    const data = await response.json();

    const temp = Math.round(data.current_weather.temperature);
    const code = data.current_weather.weathercode;

    const descriptions = {
      0:"Klar",
      1:"Überwiegend klar",
      2:"Teilweise bewölkt",
      3:"Bewölkt",
      45:"Nebel",
      48:"Nebel",
      51:"Leichter Regen",
      53:"Regen",
      55:"Starker Regen",
      61:"Leichter Regen",
      63:"Regen",
      65:"Starker Regen",
      80:"Schauer",
      95:"Gewitter"
    };

    tempEl.textContent = temp + "°C";
    descEl.textContent = descriptions[code] || "Aktuell";
  }catch(error){
    tempEl.textContent = "--°";
    descEl.textContent = "Wetter nicht verfügbar";
  }
}

loadWeather();