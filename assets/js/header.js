/**
 * Header ve Mobil Menü işlevselliği
 */
document.addEventListener('DOMContentLoaded', function() {
    // Header elementini yükle
    loadComponent('header-container', 'components/header.html');
    
    // Footer elementini yükle
    loadComponent('footer-container', 'components/footer.html');
    
    /**
     * Harici HTML komponentlerini yüklemek için fonksiyon
     */
    function loadComponent(targetId, componentPath) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                targetElement.innerHTML = data;
                
                // Komponent yüklendikten sonra mobil menü işlevselliğini ekle
                if (targetId === 'header-container') {
                    initializeMobileMenu();
                }
            })
            .catch(error => {
                console.error(`Komponent yüklenirken hata oluştu (${componentPath}):`, error);
            });
    }
    
    /**
     * Mobil menü işlevselliğini başlat
     */
    function initializeMobileMenu() {
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        
        if (!mobileMenuButton || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
            console.error('Mobil menü elemanları bulunamadı!');
            return;
        }
        
        // Başlangıçta mobil menü gizli olmalı
        mobileMenu.style.display = 'none';
        mobileMenuOverlay.style.display = 'none';
        
        // Menü açma fonksiyonu
        function openMobileMenu() {
            console.log('Mobil menü açılıyor');
            mobileMenuOverlay.style.display = 'block';
            mobileMenu.style.display = 'block';
            
            // Kısa bir gecikme ile animasyon için class ekle
            setTimeout(() => {
                mobileMenu.classList.add('active');
            }, 10);
            
            document.body.style.overflow = 'hidden';
        }
        
        // Menü kapatma fonksiyonu
        function closeMobileMenu() {
            console.log('Mobil menü kapanıyor');
            mobileMenu.classList.remove('active');
            
            // Animasyon tamamlandıktan sonra gizle
            setTimeout(() => {
                mobileMenu.style.display = 'none';
                mobileMenuOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
        
        // Event listener'ları ekle
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            openMobileMenu();
        });
        
        mobileMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
        
        mobileMenuOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
        
        // Mobil menü içindeki linklere tıklandığında menüyü kapat
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav .nav-link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Global fonksiyonları tanımla
        window.openMobileMenuManual = openMobileMenu;
        window.closeMobileMenuManual = closeMobileMenu;
    }
}); 