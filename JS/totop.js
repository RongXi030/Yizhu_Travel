document.addEventListener("DOMContentLoaded", function () {
    
    const toTopBtn = document.querySelector(".ToTop");

    window.addEventListener("scroll", function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            toTopBtn.classList.add("ToTopshow");
        } else {
            toTopBtn.classList.remove("ToTopshow");
        }
    });
});