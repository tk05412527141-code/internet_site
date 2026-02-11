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
        content: `
            <h3>YARGI KARARLARIYLA İMAR SUÇLARI</h3>
            <p><strong>İMAR KİRLİLİĞİNE NEDEN OLMA SUÇU</strong></p>
            <p>Türk Ceza Kanunu’nun 184/1. maddesi uyarınca, yapı ruhsatiyesi alınmadan veya ruhsata aykırı olarak bina yapan ya da yaptıran kişi imar kirliliğine neden olma suçundan sorumlu tutulur. Suçun oluşabilmesi için; ruhsatsız veya ruhsata aykırı bir imalatın bulunması, bu imalatın bina niteliğinde olması ve fiilin belediye sınırları içinde veya özel imar rejimine tabi alanlarda gerçekleşmesi zorunludur.</p>
            <p><strong>Yapı – Bina Ayrımı (Suçun Konusu)</strong></p>
            <p>TCK 184/1 bakımından en temel ayrım, “yapı” ile “bina” kavramları arasındadır. 3194 sayılı İmar Kanunu’nun 5. maddesinde; Yapı, her türlü inşai faaliyeti kapsayan geniş bir kavram olarak, Bina ise, kendi başına kullanılabilen, üstü örtülü ve insanların veya eşyaların korunmasına elverişli yapılar olarak tanımlanmıştır. Bu ayrım ceza hukuku açısından belirleyicidir. Her bina bir yapıdır; ancak her yapı bina değildir.</p>
            <p><strong>Yargının “Bina” Kabul Kriterleri</strong></p>
            <p>Yargıtay Ceza Genel Kurulu, bina niteliğinin kabulü için iki temel kriter belirlemiştir: İmalatın taşıyıcı unsurları etkilemesi veya kapalı alan kazanımı sağlaması. Bu kriterleri taşımayan imalatlar, ruhsata aykırı olsa dahi TCK 184/1 kapsamında suç oluşturmaz.</p>
        `,
        link: "https://bilginhukuk.av.tr/yargi-kararlariyla-imar-suclari/"
    },
    {
        title: "Apartman ve Sitelerde Hâkimin Müdahalesi",
        date: "Güncel",
        summary: "Apartman ve site yaşamı, bireysel özgürlüklerin toplu yaşamın düzeniyle sınırlandığı…",
        content: `
            <h3>Apartman ve Sitelerde Hâkimin Müdahalesi</h3>
            <p>Apartman ve site yaşamı, bireysel özgürlüklerin toplu yaşamın düzeniyle sınırlandığı bir oluşumdur. Kat Mülkiyeti Kanunu, bu sınırları çizen ve ihlallere karşı hâkimin müdahalesini düzenleyen güçlü bir çerçeve sunar. Bu bağlamda, Kat Mülkiyeti Kanunu’nun (KMK) 33. maddesi, apartman ve sitelerde yaşanan ihlallere karşı hâkimin müdahalesi yolunu açık tutan temel düzenlemelerden biridir.</p>
            <p><strong>1. Kat Malikleri Kurulu Kararlarına Karşı Hâkimin Müdahalesi</strong></p>
            <p>Kat malikleri kurulu kararlarına karşı hâkimin müdahalesi, çoğunluğun iradesinin bireysel hakları ihlal ettiği durumlarda gündeme gelir. Bu müdahale, özellikle kararların kanunun emredici hükümlerine, yönetim planına ya da hakkaniyet ilkesine aykırı olması hâlinde söz konusu olur.</p>
            <p><strong>2. Kat Maliklerinin Borç ve Yükümlülüklerine Aykırılıklar</strong></p>
            <p>Ortak giderlere katılmama, ortak yerlerin amacı dışında kullanımı, dış cephe ve estetik yükümlülükler gibi konularda Yargıtay'ın yerleşik içtihatları mevcuttur. Örneğin, balkonların mimari projeye aykırı şekilde kapatılması ve dış cepheye kapı açılması işlemleri, proje değişikliği anlamına geldiğinden tüm maliklerin oybirliği gerektirir.</p>
        `,
        link: "https://bilginhukuk.av.tr/apartman-ve-sitelerde-hakimin-mudahalesi/"
    },
    {
        title: "Taşınmazı Sattırmadan Ortaklıktan Çıkarma Davası",
        date: "Güncel",
        summary: "Hisseli taşınmazlarda birlikte mülkiyet her zaman uyumlu bir…",
        content: `
            <h3>Taşınmazı Sattırmadan Ortaklıktan Çıkarma Davası</h3>
            <p>Hisseli taşınmazlarda birlikte mülkiyet her zaman uyumlu bir ortaklık anlamına gelmez. Bazı durumlarda bir paydaşın tutumu, diğerleri için bu ortaklığı sürdürülemez hâle getirir. İşte böyle anlarda, taşınmazı satmadan da çözüm üretmek mümkündür. Medeni Kanun, belirli şartlar altında paydaşın mülkiyetten çıkarılmasına imkân tanımaktadır.</p>
            <p>Medeni Kanunumuzun 696. maddesi uyarınca:</p>
            <ul>
                <li>Hissedarlıktan çıkartılmak istenen paydaşın yükümlülüklerini ağır biçimde çiğnemesi,</li>
                <li>Bu yüzden diğer hissedarlar için paylı mülkiyet ilişkisinin çekilmez hâle gelmesi,</li>
            </ul>
            <p>durumlarında dava açılarak hissedar paydaşlıktan çıkarılabilir.</p>
            <p><strong>Dava Süreci</strong></p>
            <p>Dava Sulh Hukuk Mahkemesinde açılır. Hakim, çıkarma istemini haklı görürse öncelikle çıkarılacak paydaşın payını karşılayacak kısmı maldan ayırmaya olanak varsa, bu ayırmayı yaparak ayrılan parçanın paylı mülkiyetten çıkarılana özgülenmesine karar verir.</p>
        `,
        link: "https://bilginhukuk.av.tr/tasinmazi-sattirmadan-ortakliktan-cikarma-davasi-yargi-kararlariyla/"
    },
    {
        title: "İşçi Avukatların Güçlendirilmesi ve Asgari Pay",
        date: "Güncel",
        summary: "Avukatlık Kanunu’na göre avukat, hukuki bilgi ve tecrübesini adaletin hizmetine sunan…",
        content: `
            <h3>İşçi Avukatların Güçlendirilmesi ve Asgari Pay</h3>
            <p>Avukatlık Kanunu’na göre avukat, hukuki bilgi ve tecrübesini adaletin hizmetine sunan, yargı erkinin ayrılmaz bir parçasıdır. Ancak günümüzde avukatlık mesleği giderek güvencesizleşmekte ve hukuk öğrencilerini mesleğe başladıklarında karşılayacak bir hayal kırıklığına dönüşmektedir.</p>
            <p>2000 yılından bu yana dosya sayıları ve avukat sayıları katlanarak artmıştır. Dosya sayısının iki kat arttığı bir ülkede avukat sayısının beş katına çıkması, ciddi ekonomik sorunları beraberinde getirmiştir.</p>
            <p><strong>Çözüm Önerisi</strong></p>
            <p>İşçi avukatların vekalet ücretlerinden asgari bir pay almasını zorunlu kılan düzenlemeler yapılmalıdır. Bu, hem mesleki bağımsızlığı koruyacak hem de yargı hizmetlerinin kalitesini artıracaktır. Avukatlık mesleği piyasa koşullarına bırakılmamalıdır.</p>
        `,
        link: "https://bilginhukuk.av.tr/isci-avukatlarin-isveren-avukatlar-karsisinda-guclendirilmesi-icin-bir-cozum-onerisi-vekalet-ucretlerinden-asgari-pay-verme-zorunlulugu/"
    },
    {
        title: "Hukukta Uzmanlaşma",
        date: "Güncel",
        summary: "Her çağın olmazsa olmazları vardır. Modern zamanların olmazsa olmazıysa neredeyse her sahada karşımıza çıkan uzmanlaşmadır…",
        content: `
            <h3>Hukukta Uzmanlaşma</h3>
            <p>Alanı ne olursa olsun her hukukçunun hukukun genel ilkeleri ve temelleriyle olan ilişkisini her daim canlı tutması gerekir. Bir uzman, hukuki bilincini uyanık tutmak için yalnızca mevzuat okumakla yetinmemeli; farklı sahalarda zihnini ve muhayyilesini besleyecek yeni kaynaklar da aramalıdır.</p>
            <p><strong>Kaçınılmaz Bir Süreç Olarak Uzmanlaşma</strong></p>
            <p>16. ve 17. yüzyıldan sonra bilgi dallarının hızla ayrışmasıyla birlikte, bir insanın tek başına tüm alanlara hakim olması imkansız hale gelmiştir. Hukukta da durum farksızdır. Bir avukatın hukukun bütün alanlarında derinlemesine bilgi sahibi olması beklenemez.</p>
            <p>Uzmanlaşma, yaratıcılığı körelten bir durum değil, aksine belli bir alanda derinleşerek yeni çözüm yolları üretmeyi sağlayan bir süreçtir.</p>
        `,
        link: "https://bilginhukuk.av.tr/hukukta-uzmanlasma/"
    },
    {
        title: "Deprem Sorumluluk Haritası/Memleketin Manzarası",
        date: "Güncel",
        summary: "GENEL MANZARA Ülke olarak plansız, hatta neredeyse günlük yaşıyoruz. 10, belki 20 yıllığına herkese kazanç…",
        content: `
            <h3>Deprem Sorumluluk Haritası / Memleketin Manzarası</h3>
            <p>Ülke olarak plansız, hatta neredeyse günlük yaşıyoruz. Dışarıdan bakıldığında ortada bir kazan-kazan denklemi var gibi görünse de, bir deprem olduğunda herkes kaybediyor. Sorun salt müteahhitlere indirgenemeyecek kadar derindir.</p>
            <p><strong>Sorumluluk Haritası</strong></p>
            <ul>
                <li><strong>Merkezi Yönetim (Devlet):</strong> Afetlerin önlenmesi, riskli bölgelerin tespiti ve denetim.</li>
                <li><strong>Yerel Yönetimler (Belediye):</strong> Plan yapma, ruhsat verme ve denetleme.</li>
                <li><strong>Müteahhit:</strong> Projeye ve mevzuata uygun inşaat yapma yükümlülüğü.</li>
                <li><strong>Yapı Denetim Firması:</strong> İnşaatın her aşamasını denetleme sorumluluğu.</li>
            </ul>
        `,
        link: "https://bilginhukuk.av.tr/deprem-sorumluluk-haritasi-memleketin-manzarasi/"
    },
    {
        title: "Arazi/Arsa Yatırımı Yaparken Nelere Dikkat Etmeliyiz?",
        date: "Güncel",
        summary: "Arazi/Arsa Yatırımının Stratejik Değeri Toprak, sınırlı ve değerli…",
        content: `
            <h3>Arazi/Arsa Yatırımı Yaparken Nelere Dikkat Etmeliyiz?</h3>
            <p>Toprak, sınırlı ve değerli bir kaynaktır. Doğru yer ve zamanda yapılan arsa yatırımları, geleceği planlayanlar için en kârlı seçeneklerden biridir. Ancak bu yatırım, yalnızca satın alıp beklemekten ibaret değildir.</p>
            <p><strong>Dikkat Edilecek Hususlar</strong></p>
            <ul>
                <li><strong>Mekânsal Strateji Planları:</strong> Bölgenin gelecekteki gelişim planlarını incelemek.</li>
                <li><strong>İmar Durumu:</strong> Yatırım yapılacak taşınmazın hukuki ve imar durumunu tam olarak anlamak.</li>
                <li><strong>Risk Analizi:</strong> Bölgesel riskleri ve kısıtlamaları değerlendirmek.</li>
            </ul>
            <p>Bilinçli yapılan toprak yatırımı, uzun vadede en güvenli limanlardan biridir.</p>
        `,
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
    const blogModal = document.getElementById('blog-modal');
    const modalBody = document.getElementById('modal-body-content');

    // Function to render the list view
    function renderListView() {
        let listHTML = `<h2>${categoryTitle}</h2><div class="category-articles-list">`;

        articles.forEach((article, index) => {
            listHTML += `
                <div class="modal-article-item">
                    <a href="#" class="modal-article-link" data-index="${index}">
                        <h4>${article.title}</h4>
                    </a>
                    <p class="article-date">${article.date}</p>
                    <p>${article.summary}</p>
                    <a href="#" class="read-more-btn-local" data-index="${index}">Devamını Oku <i class="fas fa-arrow-right"></i></a>
                    <hr>
                </div>
            `;
        });

        listHTML += `</div>`;
        modalBody.innerHTML = listHTML;

        // Add click listeners for local articles
        const links = modalBody.querySelectorAll('.modal-article-link, .read-more-btn-local');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const index = link.getAttribute('data-index');
                renderFullArticle(articles[index]);
            });
        });
    }

    // Function to render full article view
    function renderFullArticle(article) {
        let articleHTML = `
            <div class="modal-full-article">
                <button class="back-to-list-btn"><i class="fas fa-arrow-left"></i> Listeye Dön</button>
                <div class="full-article-content">
                    ${article.content}
                </div>
            </div>
        `;

        modalBody.innerHTML = articleHTML;

        // Back button listener
        const backBtn = modalBody.querySelector('.back-to-list-btn');
        backBtn.addEventListener('click', () => {
            renderListView();
        });

        // Scroll to top of modal
        modalBody.scrollTop = 0;
    }

    // Initial render
    renderListView();

    if (blogModal && modalBody) {
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
