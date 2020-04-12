 
      var swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 0,
        slidesPerGroup: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        
        
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
    
          250: {
              slidesPerView: 1,
            spaceBetween: 2,
          },
          450:{
            slidesPerView:2,
            spaceBetween:2,
          },
          600: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
        }
        
      });