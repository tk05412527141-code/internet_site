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

    // Basit fade-in animasyon gözlemcisi
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Kartlara ve hakkında bölümüne animasyon uygula
    const animatedElements = document.querySelectorAll('.card, .about-text, .about-image');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // --- BLOG MODAL ÖZELLİĞİ ---
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
