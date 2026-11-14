
/* ==========================================
   SHAKTI - MAIN JAVASCRIPT
   Navigation + Language Switching
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // 1. MOBILE NAVIGATION

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", function () {

            navigation.classList.toggle("show-menu");

            const isOpen = navigation.classList.contains("show-menu");

            menuToggle.textContent = isOpen ? "✕" : "☰";

            menuToggle.setAttribute("aria-expanded", String(isOpen));

        });

        // Close menu after selecting a link

        navigation.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("show-menu");

                menuToggle.textContent = "☰";

                menuToggle.setAttribute("aria-expanded", "false");

            });

        });

    }


    // 2. LANGUAGE SWITCHING

    const languageToggle = document.getElementById("languageToggle");

    let currentLanguage = localStorage.getItem("shaktiLanguage") || "en";

    function changeLanguage(language) {

        currentLanguage = language;

        // Translate elements containing both language versions

        document.querySelectorAll("[data-en][data-ta]").forEach(function (element) {

            element.textContent = element.getAttribute(
                language === "ta" ? "data-ta" : "data-en"
            );

        });

        // Update page language

        document.documentElement.lang = language;

        // Update button

        if (languageToggle) {

            languageToggle.textContent =
                language === "en" ? "தமிழ்" : "English";

            languageToggle.setAttribute(
                "aria-label",
                language === "en" ? "Switch to Tamil" : "Switch to English"
            );

        }

        // Remember selected language

        try {
            localStorage.setItem("shaktiLanguage", language);
        } catch (error) {
            console.warn("Language preference could not be saved.");
        }

    }


    if (languageToggle) {

        languageToggle.addEventListener("click", function () {

            const newLanguage = currentLanguage === "en" ? "ta" : "en";

            changeLanguage(newLanguage);

        });

    }


    // Apply saved language on page load

    changeLanguage(currentLanguage);


    // 3. SMOOTH SCROLLING FOR INTERNAL LINKS

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const target = document.querySelector(
                link.getAttribute("href")
            );

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    // 4. ACCESSIBILITY: CLOSE MENU WITH ESCAPE

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && navigation && menuToggle) {

            navigation.classList.remove("show-menu");

            menuToggle.textContent = "☰";

            menuToggle.setAttribute("aria-expanded", "false");

        }

    });

});
