document.addEventListener('DOMContentLoaded', () => {

    // Başlık Kaydırma Efekti
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }
    });

    // Mobil Menü Aç/Kapa
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Bir linke tıklandığında mobil menüyü kapat
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Bağlantılar için Yumuşak Kaydırma (Smooth Scroll)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gallery Slider Functionality
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    if (sliderWrapper && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateSlider() {
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
            resetTimer();
        }

        function resetTimer() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        // Event Listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });

        // Initialize Auto Slide
        slideInterval = setInterval(nextSlide, 5000);

        // Optional: Pause on hover
        sliderWrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderWrapper.addEventListener('mouseleave', () => resetTimer());
    }
});

// Basit fade-in animasyon gözlemcisi
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Use class instead of inline styles for cleaner code
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);


// Kartlara ve hakkında bölümüne animasyon uygula
const animatedElements = document.querySelectorAll('.card, .about-text, .about-image, .category-card'); // Added category-card
animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll'); // Add class for CSS handling if needed, or keep inline
    // Inline style for initial state (if not in CSS)
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// --- General Topics Category Handling ---
const generalTopicsData = [
    {
        title: "YARGI KARARLARIYLA İMAR SUÇLARI",
        date: "Güncel",
        summary: "Yargı Kararlarıyla İmar Suçları (TCK m.184, m.176, m.203 – 3194 sayılı İmar Kanunu – 2863…",
        link: "https://bilginhukuk.av.tr/yargi-kararlariyla-imar-suclari/"
    },
    {
        title: "Apartman ve Sitelerde Hâkimin Müdahalesi",
        date: "Güncel",
        summary: "Apartman ve site yaşamı, bireysel özgürlüklerin toplu yaşamın düzeniyle sınırlandığı…",
        link: "https://bilginhukuk.av.tr/apartman-ve-sitelerde-hakimin-mudahalesi/"
    },
    {
        title: "Taşınmazı Sattırmadan Ortaklıktan Çıkarma Davası",
        date: "Güncel",
        summary: "Hisseli taşınmazlarda birlikte mülkiyet her zaman uyumlu bir…",
        link: "https://bilginhukuk.av.tr/tasinmazi-sattirmadan-ortakliktan-cikarma-davasi-yargi-kararlariyla/"
    },
    {
        title: "İşçi Avukatların Güçlendirilmesi ve Asgari Pay",
        date: "Güncel",
        summary: "Avukatlık Kanunu’na göre avukat, hukuki bilgi ve tecrübesini adaletin hizmetine sunan…",
        link: "https://bilginhukuk.av.tr/isci-avukatlarin-isveren-avukatlar-karsisinda-guclendirilmesi-icin-bir-cozum-onerisi-vekalet-ucretlerinden-asgari-pay-verme-zorunlulugu/"
    },
    {
        title: "Hukukta Uzmanlaşma",
        date: "Güncel",
        summary: "Her çağın olmazsa olmazları vardır. Modern zamanların olmazsa olmazıysa neredeyse her sahada karşımıza çıkan uzmanlaşmadır…",
        link: "https://bilginhukuk.av.tr/hukukta-uzmanlasma/"
    },
    {
        title: "Deprem Sorumluluk Haritası/Memleketin Manzarası",
        date: "Güncel",
        summary: "GENEL MANZARA Ülke olarak plansız, hatta neredeyse günlük yaşıyoruz. 10, belki 20 yıllığına herkese kazanç…",
        link: "https://bilginhukuk.av.tr/deprem-sorumluluk-haritasi-memleketin-manzarasi/"
    },
    {
        title: "Arazi/Arsa Yatırımı Yaparken Nelere Dikkat Etmeliyiz?",
        date: "Güncel",
        summary: "Arazi/Arsa Yatırımının Stratejik Değeri Toprak, sınırlı ve değerli…",
        link: "https://bilginhukuk.av.tr/arazi-arsa-yatirimi-yaparken-nelere-dikkat-etmeliyiz/"
    }
];

// Find the General Topics card
document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.category-card');
    categories.forEach(card => {
        const title = card.querySelector('h3').textContent.trim();
        if (title === "Genel Konular") {
            card.addEventListener('click', () => {
                showCategoryModal("Genel Konular", generalTopicsData);
            });
        }
    });
});

function showCategoryModal(categoryTitle, articles) {
    let modalContentHTML = `<h2>${categoryTitle}</h2><div class="category-articles-list">`;

    articles.forEach(article => {
        modalContentHTML += `
            <div class="modal-article-item">
                <a href="${article.link}" target="_blank" class="modal-article-link">
                    <h4>${article.title}</h4>
                </a>
                <p class="article-date">${article.date}</p>
                <p>${article.summary}</p>
                <a href="${article.link}" target="_blank" class="read-more-btn">Devamını Oku <i class="fas fa-external-link-alt"></i></a>
                <hr>
            </div>
        `;
    });

    modalContentHTML += `</div>`;

    const blogModal = document.getElementById('blog-modal');
    const modalBody = document.getElementById('modal-body-content');

    if (blogModal && modalBody) {
        modalBody.innerHTML = modalContentHTML;
        blogModal.style.display = "block";
        setTimeout(() => {
            blogModal.classList.add('show');
        }, 10);
    }
}


// --- BLOG MODAL ÖZELLİĞİ (Existing) ---
const modal = document.getElementById('blog-modal');
const modalBody = document.getElementById('modal-body-content');
const closeModalSpan = document.querySelector('.close-modal');
const readMoreButtons = document.querySelectorAll('.read-more');

// "Devamını Oku" butonlarına tıklama olayı
readMoreButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const articleId = this.getAttribute('data-id');
        const articleContent = document.getElementById(articleId).innerHTML;

        modalBody.innerHTML = articleContent;
        modal.style.display = 'block';

        // Küçük bir gecikmeyle opacity transition'ı tetikle
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Body scroll'u kilitle
        document.body.style.overflow = 'hidden';
    });
});

// Modalı kapatma fonksiyonu
function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Scroll'u geri aç
    }, 300); // Transition süresi kadar bekle
}

// Çarpı işaretine basınca kapat
if (closeModalSpan) {
    closeModalSpan.addEventListener('click', closeModal);
}

// Modal dışına tıklayınca kapat
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// ESC tuşuna basınca kapat
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

});
