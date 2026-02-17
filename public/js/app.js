document.addEventListener('DOMContentLoaded', () => {

    // Başlık Kaydırma Efekti
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }
        });
    }

    // Hero Slider Functionality
    const initHeroSlider = () => {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length > 0) {
            let currentSlide = 0;
            const slideInterval = 5000; // 5 seconds

            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, slideInterval);
        }
    };
    initHeroSlider();

    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');

        // Check for saved user preference, if any, on load of the website
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
            if (currentTheme === 'dark') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }

        themeToggleBtn.addEventListener('click', () => {
            let theme = 'light';
            if (document.documentElement.getAttribute('data-theme') !== 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                theme = 'dark';
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                document.documentElement.removeAttribute('data-theme'); // default to light
                theme = 'light';
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', theme);
        });
    }


    // Mobil Menü Aç/Kapa
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
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
    }


    // Basit fade-in animasyon gözlemcisi
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);


    // Kartlara ve hakkında bölümüne animasyon uygula
    const animatedElements = document.querySelectorAll('.card, .about-text, .about-image, .category-card, .team-card, .blog-card');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        // Inline style for initial state (if not in CSS)
        // Check if already visible to avoid hiding content on reload if JS runs late
        // el.style.opacity = '0';
        // el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });



    // --- Article Detail Page Logic (Updated with Comments) ---
    const articleContentContainer = document.getElementById('article-content');
    if (articleContentContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        if (articleId) {
            // Fetch Article
            fetch('/api/articles')
                .then(response => response.json())
                .then(articles => {
                    if (articles && articles[articleId]) {
                        const article = articles[articleId];
                        document.getElementById('article-title').textContent = article.title;
                        document.getElementById('article-date').textContent = article.date;
                        document.getElementById('article-body').innerHTML = article.content;
                        document.title = `Bilgin Hukuk Bürosu | ${article.title}`;
                    } else {
                        document.getElementById('article-body').innerHTML = '<p>Makale bulunamadı.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching articles:', error);
                    document.getElementById('article-body').innerHTML = '<p>Makale yüklenirken bir hata oluştu.</p>';
                });

            // Fetch Comments
            loadComments(articleId);

            // Handle Comment Submission
            const commentForm = document.getElementById('comment-form');
            if (commentForm) {
                commentForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const name = document.getElementById('comment-name').value;
                    const text = document.getElementById('comment-text').value;
                    const statusDiv = document.getElementById('comment-status');

                    try {
                        const response = await fetch(`/api/articles/${articleId}/comments`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, text })
                        });

                        if (response.ok) {
                            statusDiv.textContent = 'Yorumunuz gönderildi!';
                            statusDiv.style.color = 'green';
                            commentForm.reset();
                            loadComments(articleId); // Reload comments
                        } else {
                            statusDiv.textContent = 'Yorum gönderilemedi.';
                            statusDiv.style.color = 'red';
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        statusDiv.textContent = 'Bir hata oluştu.';
                        statusDiv.style.color = 'red';
                    }
                });
            }
        }
    }

    function loadComments(articleId) {
        const commentsList = document.getElementById('comments-list');
        fetch(`/api/articles/${articleId}/comments`)
            .then(res => res.json())
            .then(comments => {
                if (comments.length === 0) {
                    commentsList.innerHTML = '<p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>';
                    return;
                }
                commentsList.innerHTML = '';
                comments.forEach(comment => {
                    const commentEl = document.createElement('div');
                    commentEl.style.marginBottom = '1rem';
                    commentEl.style.padding = '1rem';
                    commentEl.style.background = '#fff';
                    commentEl.style.border = '1px solid #eee';
                    commentEl.style.borderRadius = '0.5rem';
                    commentEl.innerHTML = `
                        <div style="font-weight: bold; margin-bottom: 0.25rem;">${comment.name} <span style="font-weight: normal; color: #888; font-size: 0.8rem;">- ${comment.date}</span></div>
                        <div>${comment.text}</div>
                    `;
                    commentsList.appendChild(commentEl);
                });
            })
            .catch(err => console.error('Error loading comments:', err));
    }

    // --- Blog Page Logic ---
    const blogArticlesContainer = document.getElementById('blog-articles-container');
    if (blogArticlesContainer) {
        fetch('/api/articles')
            .then(response => response.json())
            .then(articles => {
                blogArticlesContainer.innerHTML = ''; // Clear loading message

                // Convert object to array and reverse to show newest first (assuming keys are somewhat ordered or we sort by date)
                // Since keys are article-timestamp for new ones, but article-1 etc for old, we might need robust sorting.
                // For now, let's just reverse the keys if they are inserted in order. 
                // Better: Sort by date if possible, but date format is string. 
                // Let's just render them as is for now, maybe reverse.
                const articleIds = Object.keys(articles).reverse();

                if (articleIds.length === 0) {
                    blogArticlesContainer.innerHTML = '<p>Henüz makale bulunmamaktadır.</p>';
                    return;
                }

                const searchInput = document.getElementById('blog-search-input');
                const filterBtns = document.querySelectorAll('.filter-btn');
                let currentCategory = 'all';
                let searchTerm = '';

                function renderArticles() {
                    blogArticlesContainer.innerHTML = '';

                    const filteredIds = articleIds.filter(id => {
                        const article = articles[id];
                        // Filter by Category
                        // Note: If old articles don't have category, treat as 'Genel' or inclusive if 'all'
                        const articleCategory = article.category || 'Genel';
                        const matchesCategory = currentCategory === 'all' || articleCategory === currentCategory;

                        // Filter by Search
                        const searchContent = (article.title + ' ' + article.content).toLowerCase();
                        const matchesSearch = searchContent.includes(searchTerm);

                        return matchesCategory && matchesSearch;
                    });

                    if (filteredIds.length === 0) {
                        blogArticlesContainer.innerHTML = '<p>Aradığınız kriterlere uygun makale bulunamadı.</p>';
                        return;
                    }

                    filteredIds.forEach(id => {
                        const article = articles[id];
                        // Create a plain text summary from HTML content
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = article.content;
                        const textContent = tempDiv.textContent || tempDiv.innerText || "";
                        const summary = textContent.substring(0, 150) + '...';
                        const categoryBadge = article.category ? `<span class="category-badge" style="font-size: 0.8rem; background: #eee; padding: 2px 8px; border-radius: 4px; margin-bottom: 5px; display: inline-block;">${article.category}</span>` : '';

                        const articleCard = `
                            <article class="blog-card">
                                <div class="blog-content">
                                    <div class="blog-date">${article.date}</div>
                                    ${categoryBadge}
                                    <h3>${article.title}</h3>
                                    <p>${summary}</p>
                                    <a href="article-detail.html?id=${id}" class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></a>
                                </div>
                            </article>
                        `;
                        blogArticlesContainer.innerHTML += articleCard;
                    });

                    // Re-apply animations
                    const newCards = blogArticlesContainer.querySelectorAll('.blog-card');
                    newCards.forEach(el => {
                        el.classList.add('animate-on-scroll');
                        el.style.transition = 'all 0.6s ease-out';
                        observer.observe(el);
                    });
                }

                // Initial Render
                renderArticles();

                // Search Listener
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        searchTerm = e.target.value.toLowerCase();
                        renderArticles();
                    });
                }

                // Filter Listener
                filterBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Update UI
                        filterBtns.forEach(b => {
                            b.classList.remove('active');
                            b.style.background = '#fff';
                            b.style.color = '#333';
                        });
                        btn.classList.add('active');
                        btn.style.background = 'var(--primary-color, #0a2540)'; // Fallback color
                        btn.style.color = '#fff';

                        // Update Logic
                        currentCategory = btn.getAttribute('data-category');
                        renderArticles();
                    });
                });

                // Set initial style for active button
                const activeBtn = document.querySelector('.filter-btn.active');
                if (activeBtn) {
                    activeBtn.style.background = 'var(--primary-color, #0a2540)';
                    activeBtn.style.color = '#fff';
                }

            })
            .catch(error => {
                console.error('Error fetching articles:', error);
                blogArticlesContainer.innerHTML = '<p>Makaleler yüklenirken bir hata oluştu.</p>';
            });
    }

    // --- General Topics Category Handling (kept for Services page) ---
    // If we have the modal and category cards, we keep this logic
    const blogModal = document.getElementById('blog-modal');
    if (blogModal) {
        // ... (Keep the modal logic if needed, or remove if we want everything on pages)
        // User asked for multi-page refactor. The "General Topics" modal is a bit of a hybrid.
        // I will keep it functional for now as it's a specific feature.

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

        const categories = document.querySelectorAll('.category-card');
        categories.forEach(card => {
            const h3 = card.querySelector('h3');
            if (h3) {
                const title = h3.textContent.trim();
                if (title === "Genel Konular") {
                    card.addEventListener('click', () => {
                        showCategoryModal("Genel Konular", generalTopicsData);
                    });
                }
            }
        });

        // Modal Functionality
        const modalBody = document.getElementById('modal-body-content');
        const closeModalSpan = document.querySelector('.close-modal');

        function showCategoryModal(categoryTitle, articles) {
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

                const links = modalBody.querySelectorAll('.modal-article-link, .read-more-btn-local');
                links.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const index = link.getAttribute('data-index');
                        renderFullArticle(articles[index]);
                    });
                });
            }

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
                const backBtn = modalBody.querySelector('.back-to-list-btn');
                backBtn.addEventListener('click', () => {
                    renderListView();
                });
                modalBody.scrollTop = 0;
            }

            renderListView();
            blogModal.style.display = "block";
            setTimeout(() => {
                blogModal.classList.add('show');
            }, 10);
            document.body.style.overflow = 'hidden';
        }


        function closeModal() {
            blogModal.classList.remove('show');
            setTimeout(() => {
                blogModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }

        if (closeModalSpan) {
            closeModalSpan.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (event) => {
            if (event.target === blogModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && blogModal.classList.contains('show')) {
                closeModal();
            }
        });

    } // End of if (blogModal)

    // --- Contact Form Logic ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Gönderiliyor...';
            submitBtn.disabled = true;

            const inputs = contactForm.querySelectorAll('input, select, textarea');
            const name = inputs[0].value;
            const email = inputs[1].value;
            const subject = inputs[2].value;
            const message = inputs[3].value;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });

                if (response.ok) {
                    alert('Mesajınız başarıyla gönderildi!');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    alert('Hata: ' + (data.error || 'Mesaj gönderilemedi.'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Bir bağlantı hatası oluştu.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Cookie Consent Banner ---
    const cookieBanner = document.createElement('div');
    cookieBanner.id = 'cookie-banner';
    cookieBanner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #333;
        color: #fff;
        padding: 1rem;
        text-align: center;
        z-index: 9999;
        display: none;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
    `;
    cookieBanner.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 1rem;">
            <p style="margin: 0; font-size: 0.9rem;">Sitemizden en iyi şekilde faydalanabilmeniz için çerezler kullanılmaktadır. Sitemize giriş yaparak çerez kullanımını kabul etmiş sayılırsınız.</p>
            <button id="accept-cookies" style="background: var(--primary-color, #0a2540); color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 2rem; cursor: pointer; font-weight: 600;">Kabul Et</button>
        </div>
    `;
    document.body.appendChild(cookieBanner);

    const acceptBtn = document.getElementById('accept-cookies');
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.style.display = 'block';
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

});
