 window.onscroll = function()
  {
      myFunction()
    };
      
      var navbar = document.getElementById("nav-header");
      var sticky = navbar.offsetTop;
      
      function myFunction() {
        if (window.pageYOffset >= sticky) {
          navbar.classList.add("sticky");
          document.getElementById("nav-header").style.background = "rgba(0, 29, 56, 1)";
        } else {
          navbar.classList.remove("sticky");
        }
      }