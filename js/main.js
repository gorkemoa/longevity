// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll için tüm anchor linklerini seç
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form gönderimi
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Form gönderildiğinde kullanıcıya bilgi ver
            alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
            this.reset();
        });
    }

    // Scroll olayını dinle ve header'ı güncelle
    let lastScroll = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Aşağı scroll
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Yukarı scroll
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
    
    // Hero slider
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const prevBtn = document.querySelector('.slider-nav.prev');
        const nextBtn = document.querySelector('.slider-nav.next');
        let currentSlide = 0;
        let isAnimating = false;
        
        // Optimizasyon: Slider'ı oluşturma ve arka plan resimlerini optimize etme
        function setupSlider() {
            // İlk slaytı aktif et
            if (slides.length > 0) {
                slides[0].classList.add('active');
                
                // Tüm slaytların arka plan görsellerini optimize etme
                for (let i = 0; i < slides.length; i++) {
                    const slide = slides[i];
                    
                    // Mobil cihazlar için görüntüleri optimize et
                    if (window.innerWidth <= 768 && slide.dataset.imgSrc) {
                        // Arka plan resminin URL'sini alıp küçük ekranlar için optimize et
                        const imgUrl = slide.dataset.imgSrc;
                        
                        // Eğer webp uzantılı resim varsa, doğrudan kullan
                        if (imgUrl.includes('.webp')) {
                            continue; // Zaten webp formatında, optimizasyon gerekmiyor
                        }
                        
                        // Resmi daha düşük çözünürlükte yükle (mobil cihazlar için)
                        const mobileOptimizedUrl = imgUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                        if (mobileOptimizedUrl !== imgUrl) {
                            // WebP formatı destekleniyorsa ve yeni URL varsa kullan
                            const img = new Image();
                            img.onload = function() {
                                slide.style.backgroundImage = `url('${mobileOptimizedUrl}')`;
                            };
                            img.onerror = function() {
                                // WebP yüklenemezse, orijinal resmi kullan
                                console.log('WebP format not supported or file not found, using original image');
                            };
                            img.src = mobileOptimizedUrl;
                        }
                    }
                }
            }
        }
        
        // Slider'ı oluştur
        setupSlider();
        
        // İlk slide'ı göster
        if (slides.length > 0) {
            slides[0].classList.add('active');
        }
        
        // Next slide gösterme fonksiyonu
        function showNextSlide() {
            if (isAnimating) return;
            isAnimating = true;
            
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            
            // Animasyon süresi sonunda isAnimating'i false yap (CSS geçiş süresi 500ms)
            setTimeout(function() {
                isAnimating = false;
            }, 600);
        }
        
        // Prev slide gösterme fonksiyonu
        function showPrevSlide() {
            if (isAnimating) return;
            isAnimating = true;
            
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            
            // Animasyon süresi sonunda isAnimating'i false yap
            setTimeout(function() {
                isAnimating = false;
            }, 600);
        }
        
        // Butonlara tıklama olayları
        if (prevBtn) {
            prevBtn.addEventListener('click', showPrevSlide);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', showNextSlide);
        }
        
        // Otomatik geçiş
        let slideInterval = setInterval(showNextSlide, 5000);
        
        // Slider'a tıklama veya dokunma olduğunda otomatik geçişi durdur
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            heroSlider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(showNextSlide, 5000);
            });
            
            // Dokunmatik cihazlar için geliştirilmiş kaydırma desteği
            let touchStartX = 0;
            let touchEndX = 0;
            let touchStartY = 0;
            let touchEndY = 0;
            let touchThreshold = 50; // Kaydırma algılama eşiği
            let touchStartTime = 0;
            let touchEndTime = 0;
            let touchTimeThreshold = 300; // Kaydırma süre eşiği (ms)
            
            heroSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
                touchStartTime = new Date().getTime();
                clearInterval(slideInterval);
            }, { passive: true });
            
            heroSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                touchEndTime = new Date().getTime();
                
                // Hızlı dikey kaydırmayı kontrol et
                const touchTimeElapsed = touchEndTime - touchStartTime;
                const verticalSwipeDistance = Math.abs(touchEndY - touchStartY);
                const horizontalSwipeDistance = Math.abs(touchEndX - touchStartX);
                
                // Yatay kaydırma dikey kaydırmadan daha belirginse ve yeterince hızlıysa işle
                if (horizontalSwipeDistance > verticalSwipeDistance && 
                    horizontalSwipeDistance > touchThreshold && 
                    touchTimeElapsed < touchTimeThreshold) {
                    handleSwipe();
                }
                
                slideInterval = setInterval(showNextSlide, 5000);
            }, { passive: true });

            // Bir piksel bile sürükleme olduğunda otomatik geçişi durdur
            heroSlider.addEventListener('touchmove', (e) => {
                clearInterval(slideInterval);
            }, { passive: true });
            
            function handleSwipe() {
                if (touchEndX < touchStartX - touchThreshold) {
                    // Sola kaydırma - Sonraki slayt
                    showNextSlide();
                } else if (touchEndX > touchStartX + touchThreshold) {
                    // Sağa kaydırma - Önceki slayt
                    showPrevSlide();
                }
            }
        }
    }
    
    // Hero slider'ı başlat
    initHeroSlider();
}); 