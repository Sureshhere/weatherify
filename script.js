// Weather object - handles all the weather stuff
const weather = {
    // gets weather data from our api
    fetchWeather: function(city) {
        const weatherDisplay = document.querySelector('.weather-display');
        if (weatherDisplay) {
            weatherDisplay.classList.add('loading');
        }
        
        fetch(`/api/weather?city=${encodeURIComponent(city)}`)
            .then(response => {
                if (!response.ok) throw new Error('City not found');
                return response.json();
            })
            .then(data => this.displayWeather(data))
            .catch(error => {
                console.error('Weather fetch error:', error);
                if (weatherDisplay) weatherDisplay.classList.remove('loading');
            });
    },
    
    // puts all the weather data on the page
    displayWeather: function(data) {
        const { name, coord } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, feels_like, pressure } = data.main;
        const { speed } = data.wind;
        const { visibility } = data;
        const { all: cloudiness } = data.clouds;
        const { sunrise, sunset } = data.sys;
        
        // main card stuff
        const cityEl = document.querySelector('.city');
        const iconEl = document.querySelector('.icon');
        const descEl = document.querySelector('.description');
        const tempEl = document.querySelector('.temp');
        const humidityEl = document.querySelector('.humidity');
        const windEl = document.querySelector('.wind');
        const weatherDisplay = document.querySelector('.weather-display');
        
        if (cityEl) cityEl.innerText = name;
        if (iconEl) iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        if (descEl) descEl.innerText = description;
        if (tempEl) tempEl.innerText = `${Math.round(temp)}°C`;
        if (humidityEl) humidityEl.innerText = `${humidity}%`;
        if (windEl) windEl.innerText = `${speed} km/h`;
        if (weatherDisplay) weatherDisplay.classList.remove('loading');
        
        // extra details panel
        const feelsLikeEl = document.querySelector('.feels-like');
        const pressureEl = document.querySelector('.pressure');
        const visibilityEl = document.querySelector('.visibility');
        const cloudinessEl = document.querySelector('.cloudiness');
        const sunriseEl = document.querySelector('.sunrise');
        const sunsetEl = document.querySelector('.sunset');
        
        if (feelsLikeEl) feelsLikeEl.innerText = `${Math.round(feels_like)}°C`;
        if (pressureEl) pressureEl.innerText = `${pressure} hPa`;
        if (visibilityEl) visibilityEl.innerText = `${(visibility / 1000).toFixed(1)} km`;
        if (cloudinessEl) cloudinessEl.innerText = `${cloudiness}%`;
        
        // converting unix time to readable time
        if (sunriseEl) {
            const sunriseDate = new Date(sunrise * 1000);
            sunriseEl.innerText = sunriseDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        if (sunsetEl) {
            const sunsetDate = new Date(sunset * 1000);
            sunsetEl.innerText = sunsetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        
        // also grab air quality
        this.fetchAirQuality(coord.lat, coord.lon);
    },
    
    // gets air quality data using lat/lon
    fetchAirQuality: function(lat, lon) {
        fetch(`/api/airquality?lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(data => {
                const aqi = data.list[0].main.aqi;
                const pm25 = data.list[0].components.pm2_5;
                
                const aqiEl = document.querySelector('.aqi');
                const pm25El = document.querySelector('.pm25');
                
                // 1=good, 5=very poor
                const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
                
                if (aqiEl) aqiEl.innerText = aqiLabels[aqi - 1] || '--';
                if (pm25El) pm25El.innerText = `${pm25.toFixed(1)} µg/m³`;
            })
            .catch(error => console.error('Air quality fetch error:', error));
    },
    
    // handles the search button click
    search: function() {
        const searchInput = document.querySelector('.searchbar_2');
        if (searchInput && searchInput.value.trim()) {
            this.fetchWeather(searchInput.value.trim());
        }
    }
};

// search button & enter key listeners
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.searchBTN');
    const searchInput = document.querySelector('.searchbar_2');
    
    if (searchBtn) searchBtn.addEventListener('click', () => weather.search());
    
    if (searchInput) {
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') weather.search();
        });
    }
    
    // load delhi weather by default
    weather.fetchWeather('Delhi');
});

// snowfall effect - makes it look cool
const Snow = {
    el: '#snow',
    density: 10000,
    maxHSpeed: 3,
    minFallSpeed: 1.5,
    canvas: null,
    ctx: null,
    particles: [],
    w: 0,
    h: 0,
    quit: false,
    
    init() {
        this.canvas = document.querySelector(this.el);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.reset();
        requestAnimationFrame(this.render.bind(this));
        window.addEventListener('resize', this.reset.bind(this));
    },
    
    // creates snow particles
    reset() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.particles = [];
        
        const mp = Math.ceil((this.w * this.h) / this.density);
        
        for (let i = 0; i < mp; i++) {
            const size = Math.random() * 3 + 2;
            this.particles.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                w: size,
                h: size,
                vy: this.minFallSpeed + Math.random() * 1.5,
                vx: (Math.random() * this.maxHSpeed) - this.maxHSpeed / 2,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    },
    
    // animates the snowfall
    render() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        
        this.particles.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.w, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            this.ctx.fill();
            
            // reset if goes off screen
            if (p.x > this.w + 5 || p.x < -5 || p.y > this.h) {
                p.x = Math.random() * this.w;
                p.y = -10;
            }
        });
        
        if (!this.quit) requestAnimationFrame(this.render.bind(this));
    },
    
    destroy() {
        this.quit = true;
    }
};

Snow.init();

// scroll to top button
const scrollTopBtn = document.getElementById('topBtn');

window.addEventListener('scroll', function() {
    if (scrollTopBtn) {
        scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }
});

function toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// fade-in animation when elements come into view
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});

// navbar gets darker when you scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            window.scrollTo({
                top: targetElement.offsetTop - navHeight,
                behavior: 'smooth'
            });
        }
    });
});

// highlights current section in navbar
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});