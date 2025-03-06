// Danışanlarımız Ne Diyor? bölümü için JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const testimonialItems = document.querySelectorAll('.testimonial-item');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.testimonial-nav-btn.prev');
  const nextBtn = document.querySelector('.testimonial-nav-btn.next');
  let currentTestimonial = 0;
  
  // İndikatörlere tıklama olayı
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showTestimonial(index);
    });
  });
  
  // Önceki ve sonraki butonları
  prevBtn.addEventListener('click', prevTestimonial);
  nextBtn.addEventListener('click', nextTestimonial);
  
  function showTestimonial(index) {
    testimonialItems.forEach(item => {
      item.classList.remove('active');
    });
    
    indicators.forEach(dot => {
      dot.classList.remove('active');
    });
    
    testimonialItems[index].classList.add('active');
    indicators[index].classList.add('active');
    currentTestimonial = index;
  }
  
  function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
    showTestimonial(currentTestimonial);
  }
  
  function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialItems.length) % testimonialItems.length;
    showTestimonial(currentTestimonial);
  }
  
  // Otomatik geçiş
  let testimonialInterval = setInterval(nextTestimonial, 6000);
  
  // Kullanıcı etkileşiminde otomatik geçişi durdur ve yeniden başlat
  const testimonialContainer = document.querySelector('.testimonials-container');
  
  testimonialContainer.addEventListener('mouseenter', () => {
    clearInterval(testimonialInterval);
  });
  
  testimonialContainer.addEventListener('mouseleave', () => {
    testimonialInterval = setInterval(nextTestimonial, 6000);
  });
  
  // Dokunmatik cihazlar için kaydırma desteği
  let touchStartX = 0;
  let touchEndX = 0;
  
  testimonialContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  testimonialContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      nextTestimonial();
    } else if (touchEndX > touchStartX + 50) {
      prevTestimonial();
    }
  }
}); 