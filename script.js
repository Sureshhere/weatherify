// ============================================
// WEATHERIFY - JavaScript
// Weather API, Animations & Interactions
// ============================================

// Weather API Configuration
const weather = {
    apikey: '673d0c9312adf317d04cd672ae9a9b3d',
    
    fetchWeather: function(city) {
        const weatherDisplay = document.querySelector('.weather-display');
        if (weatherDisplay) {
            weatherDisplay.classList.add('loading');
        }
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apikey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => this.displayWeather(data))
            .catch(error => {
                console.error('Weather fetch error:', error);
                if (weatherDisplay) {
                    weatherDisplay.classList.remove('loading');
                }
            });
    },
    
    displayWeather: function(data) {
        const { name, coord } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, feels_like, pressure } = data.main;
        const { speed } = data.wind;
        const { visibility } = data;
        const { all: cloudiness } = data.clouds;
        const { sunrise, sunset } = data.sys;
        
        // Update main weather card
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
        
        // Update extra weather panel
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
        
        // Format sunrise and sunset times
        if (sunriseEl) {
            const sunriseDate = new Date(sunrise * 1000);
            sunriseEl.innerText = sunriseDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        if (sunsetEl) {
            const sunsetDate = new Date(sunset * 1000);
            sunsetEl.innerText = sunsetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        
        // Fetch Air Quality data
        this.fetchAirQuality(coord.lat, coord.lon);
    },
    
    fetchAirQuality: function(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apikey}`)
            .then(response => response.json())
            .then(data => {
                const aqi = data.list[0].main.aqi;
                const pm25 = data.list[0].components.pm2_5;
                
                const aqiEl = document.querySelector('.aqi');
                const pm25El = document.querySelector('.pm25');
                
                // AQI Labels: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
                const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
                
                if (aqiEl) aqiEl.innerText = aqiLabels[aqi - 1] || '--';
                if (pm25El) pm25El.innerText = `${pm25.toFixed(1)} µg/m³`;
            })
            .catch(error => {
                console.error('Air quality fetch error:', error);
            });
    },
    
    search: function() {
        const searchInput = document.querySelector('.searchbar_2');
        if (searchInput && searchInput.value.trim()) {
            this.fetchWeather(searchInput.value.trim());
        }
    }
};

// Event Listeners for Weather Search
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.searchBTN');
    const searchInput = document.querySelector('.searchbar_2');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => weather.search());
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                weather.search();
            }
        });
    }
    
    // Fetch default weather
    weather.fetchWeather('Delhi');
});

// ============================================
// SNOW ANIMATION
// ============================================
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
    
    render() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        
        this.particles.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            
            // Create gradient for each particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.w, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            this.ctx.fill();
            
            // Reset particle if out of bounds
            if (p.x > this.w + 5 || p.x < -5 || p.y > this.h) {
                p.x = Math.random() * this.w;
                p.y = -10;
            }
        });
        
        if (!this.quit) {
            requestAnimationFrame(this.render.bind(this));
        }
    },
    
    destroy() {
        this.quit = true;
    }
};

// Initialize snow animation
Snow.init();

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
const scrollTopBtn = document.getElementById('topBtn');

window.addEventListener('scroll', function() {
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
});

function toTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionally unobserve after animation
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
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

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});