window.gtranslateSettings = {"default_language":"en","languages":["en","vi"],"wrapper_selector":".gtranslate_wrapper"}
// Navigation functions
function goHome() {
    // In a real app, this would navigate to the home page
    window.location.href = '/';
}

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        goHome();
    }
}

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');

if (searchInput && searchSuggestions) {
    searchInput.addEventListener('focus', () => {
        searchSuggestions.classList.add('active');
    });

    searchInput.addEventListener('blur', (e) => {
        // Delay hiding to allow clicking on suggestions
        setTimeout(() => {
            if (!searchSuggestions.contains(document.activeElement)) {
                searchSuggestions.classList.remove('active');
            }
        }, 200);
    });

    // Handle suggestion clicks
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const text = e.currentTarget.querySelector('span').textContent;
            searchInput.value = text;
            searchSuggestions.classList.remove('active');

            // In a real app, this would perform the search
            console.log('Searching for:', text);
        });
    });

    // Handle search form submission
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                // In a real app, this would perform the search
                console.log('Searching for:', query);
                searchSuggestions.classList.remove('active');
            }
        }
    });
}
function createClickBurst(e) {
const container = document.createElement('div');
container.className = 'click-effect-container';

container.style.left = `${e.pageX - 25}px`;
container.style.top = `${e.pageY - 25}px`;

document.body.appendChild(container);

const PARTICLE_COUNT = 12;
const colors = ['#0066FF', '#3399FF', '#FFD700', '#FFFFFF', '#8A2BE2', '#FC46AD'];

for (let i = 0; i < PARTICLE_COUNT; i++) {
const particle = document.createElement('div');
particle.className = 'click-effect-particle';

particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
particle.style.width = '10px';
particle.style.height = '10px';
particle.style.transform = 'translate(15px, 15px) scale(1)';
particle.style.opacity = '1';

container.appendChild(particle);

const angle = (360 / PARTICLE_COUNT) * i; // Góc bay ra
const radius = 50 + Math.random() * 40;   // Khoảng cách bay ra
const x = radius * Math.cos(angle * Math.PI / 180); // Tọa độ x cuối cùng
const y = radius * Math.sin(angle * Math.PI / 180); // Tọa độ y cuối cùng

setTimeout(() => {
    // Style cuối cùng của mảnh vỡ (sau khi đã bay ra)
    particle.style.transform = `translate(${x}px, ${y}px) scale(0)`;
    particle.style.opacity = '0';
}, 10);
}
setTimeout(() => {
container.remove();
}, 700);
}

// Gắn hàm xử lý sự kiện vào toàn bộ trang
document.addEventListener('click', createClickBurst);
// Add some interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Random fun facts rotation
    const funFacts = [
        "The first 404 error was discovered at CERN in 1992 when a server room was literally 'not found'!",
        "404 pages are a great opportunity for creativity - some of the most memorable web experiences happen here!",
        "The HTTP 404 status code means 'Not Found' - but you found our awesome 404 page!",
        "Some websites have turned 404 pages into games, art galleries, and interactive experiences!",
        "The number 404 has become so iconic that it's used in everyday language to mean 'missing' or 'not found'!"
    ];

    // Rotate fun facts every 5 seconds
    let currentFactIndex = 0;
    const factElements = document.querySelectorAll('.glass-effect p');

    if (factElements.length > 0) {
        setInterval(() => {
            currentFactIndex = (currentFactIndex + 1) % funFacts.length;
            factElements.forEach((el, index) => {
                if (index < 2) {
                    el.textContent = funFacts[(currentFactIndex + index) % funFacts.length];
                }
            });
        }, 5000);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchSuggestions) searchSuggestions.classList.remove('active');
        }
        if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            goHome();
        }
    });
});

// Add some easter eggs
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.transform = 'rotate(360deg)';
        document.body.style.transition = 'transform 2s ease-in-out';

        setTimeout(() => {
            document.body.style.transform = '';
            alert('🎉 Konami Code activated! You found the secret!');
        }, 2000);

        konamiCode = [];
    }
});

// GTranslate settings
window.gtranslateSettings = {
    "default_language": "en",
    "languages": ["en", "vi"],
    "wrapper_selector": ".gtranslate_wrapper"
};

// Cloudflare challenge script (self-executing)
(function () {
    function c() {
        var b = a.contentDocument || a.contentWindow.document;
        if (b) {
            var d = b.createElement('script');
            d.innerHTML = "window.__CF$cv$params={r:'992ac546840485e3',t:'MTc2MTE1NDczMC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName('head')[0].appendChild(d);
        }
    }
    if (document.body) {
        var a = document.createElement('iframe');
        a.height = 1;
        a.width = 1;
        a.style.position = 'absolute';
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = 'none';
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        if ('loading' !== document.readyState) c();
        else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c);
        else {
            var e = document.onreadystatechange || function () { };
            document.onreadystatechange = function (b) {
                e(b);
                'loading' !== document.readyState && (document.onreadystatechange = e, c());
            }
        }
    }
})();
window.gtranslateSettings = {"default_language":"en","languages":["en","vi"],"wrapper_selector":".gtranslate_wrapper"}