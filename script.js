let weather = {
  "apikey": '673d0c9312adf317d04cd672ae9a9b3d',
  fetchWeather: function (city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q="
      + city
      + "&units=metric&appid="
      + this.apikey)
      .then((Response) => Response.json())
      .then((data) => this.displayWeather(data));
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
  },

  search: function () {
    this.fetchWeather(document.querySelector(".searchbar_2").value);
  }
};

document.querySelector(".search_2 button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".searchbar_2").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search();
  }
});

weather.fetchWeather("hyderabad");



// -------------------




// -------------------

var Snow = {
  el: "#snow",
  density: 12000, // higher = fewer bits
  maxHSpeed: 5, // How much do you want them to move horizontally
  minFallSpeed: 2,
  canvas: null,
  ctx: null,
  particles: [],
  colors: [],
  mp: 1,
  quit: false,
  init() {
    this.canvas = document.querySelector(this.el);
    this.ctx = this.canvas.getContext("2d");
    this.reset();
    requestAnimationFrame(this.render.bind(this));
    window.addEventListener("resize", this.reset.bind(this));
  },
  reset() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.particles = [];
    this.mp = Math.ceil(this.w * this.h / this.density);
    for (var i = 0; i < this.mp; i++) {
      var size = Math.random() * 4 + 5;
      this.particles.push({
        x: Math.random() * this.w, //x-coordinate
        y: Math.random() * this.h, //y-coordinate
        w: size,
        h: size,
        vy: this.minFallSpeed + Math.random(), //density
        vx: (Math.random() * this.maxHSpeed) - this.maxHSpeed / 2,
        fill: "#ffffff",
        s: (Math.random() * 0.2) - 0.1
      });
    }
  },

  render() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.particles.forEach((p, i) => {
      p.y += p.vy;
      p.x += p.vx;
      this.ctx.fillStyle = p.fill;
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
      if (p.x > this.w + 5 || p.x < -5 || p.y > this.h) {
        p.x = Math.random() * this.w;
        p.y = -10;
      }
    });
    if (this.quit) {
      return;
    }
    requestAnimationFrame(this.render.bind(this));
  },
  destroy() {
    this.quit = true;
  }

};

var confetti = Snow.init();

// --------------------------

let mybutton = document.getElementById("topBtn");


window.onscroll = function () {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function toTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}