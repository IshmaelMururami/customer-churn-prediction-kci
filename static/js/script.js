document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // CUSTOMER CHURN PREDICTION — UI INTERACTIONS
    // =====================================================

    const form = document.querySelector("form");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const addClassWhenReady = (element, className, delay = 0) => {
        if (!element) {
            return;
        }

        if (prefersReducedMotion) {
            element.classList.add(className);
            return;
        }

        window.setTimeout(() => {
            element.classList.add(className);
        }, delay);
    };
    const submitButton = form
        ? form.querySelector('button[type="submit"], input[type="submit"]')
        : null;

    // -----------------------------------------------------
    // 1. Smooth entrance animation
    // -----------------------------------------------------

    document.body.classList.add("page-ready");

    document.querySelectorAll(
        ".hero, .result-hero, .prediction-card, .result-card, .feature-strip, .result-note"
    ).forEach((section, index) => {
        section.classList.add("motion-ready");
        addClassWhenReady(section, "motion-visible", 80 + (index * 80));
    });


    // -----------------------------------------------------
    // 2. Form field interaction
    // -----------------------------------------------------

    const fields = document.querySelectorAll(
        "input, select"
    );

    fields.forEach((field) => {

        field.addEventListener("focus", () => {
            field.classList.add("field-active");
        });

        field.addEventListener("blur", () => {
            field.classList.remove("field-active");

            if (field.value.trim() !== "" && field.checkValidity()) {
                field.classList.add("field-complete");
            } else {
                field.classList.remove("field-complete");
            }
        });


        field.addEventListener("input", () => {
            field.classList.toggle(
                "field-invalid",
                field.value.trim() !== "" && !field.checkValidity()
            );
        });
    });


    // -----------------------------------------------------
    // 3. Form submission loading state
    // -----------------------------------------------------

    if (form) {

        form.addEventListener("submit", (event) => {

            // Allow normal Flask form submission
            if (!form.checkValidity()) {
                form.classList.add("form-invalid");
                return;
            }

            if (submitButton) {

                submitButton.dataset.originalText =
                    submitButton.innerHTML;

                submitButton.innerHTML = `
                    <span class="loading-spinner"></span>
                    Analysing Customer...
                `;

                submitButton.disabled = true;
                submitButton.classList.add("is-loading");
                submitButton.setAttribute("aria-busy", "true");
            }

            // Prevent accidental double submission
            form.classList.add("form-processing");
        });

    }


    // -----------------------------------------------------
    // 4. Prevent accidental double-click submission
    // -----------------------------------------------------

    let submissionStarted = false;

    if (form) {

        form.addEventListener("submit", (event) => {

            if (submissionStarted) {
                event.preventDefault();
                return;
            }

            submissionStarted = true;

        });

    }


    // -----------------------------------------------------
    // 5. Animate probability bar on results page
    // -----------------------------------------------------

    const probabilityBar = document.querySelector(
        ".probability-fill, .progress-bar"
    );

    if (probabilityBar) {

        const targetWidth =
            probabilityBar.dataset.probability ||
            probabilityBar.getAttribute("data-width") ||
            probabilityBar.style.width;

        if (!prefersReducedMotion) {
            probabilityBar.style.width = "0%";
        }

        requestAnimationFrame(() => {

            window.setTimeout(() => {

                if (targetWidth) {
                    probabilityBar.style.width = targetWidth;
                }

            }, prefersReducedMotion ? 0 : 250);

        });

    }


    // -----------------------------------------------------
    // 6. Animate result cards
    // -----------------------------------------------------

    const resultCards = document.querySelectorAll(
        ".result-card, .profile-card, .risk-card, .guidance-card"
    );

    resultCards.forEach((card, index) => {

        if (prefersReducedMotion) {
            card.classList.add("motion-visible");
            return;
        }

        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";

        window.setTimeout(() => {

            card.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 150 + (index * 80));

    });


    // -----------------------------------------------------
    // 7. Risk badge subtle pulse
    // -----------------------------------------------------

    const riskBadge = document.querySelector(
        ".risk-badge"
    );

    if (riskBadge) {

        addClassWhenReady(riskBadge, "risk-visible", 500);

    }


    // -----------------------------------------------------
    // 8. Number input protection
    // -----------------------------------------------------

    const numberInputs = document.querySelectorAll(
        'input[type="number"]'
    );

    numberInputs.forEach((input) => {

        input.addEventListener("input", () => {

            if (input.value < 0) {
                input.value = 0;
            }

        });

    });


    // -----------------------------------------------------
    // 9. Scroll smoothly to prediction results
    // -----------------------------------------------------

    const resultSection = document.querySelector(
        ".results-container, .result-section"
    );

    if (resultSection) {

        window.setTimeout(() => {

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, prefersReducedMotion ? 0 : 300);

    }


    // -----------------------------------------------------
    // 10. Button hover feedback
    // -----------------------------------------------------

    const buttons = document.querySelectorAll(
        "button, .btn"
    );

    buttons.forEach((button) => {

        button.addEventListener("mouseenter", () => {
            button.classList.add("button-hover");
        });

        button.addEventListener("mouseleave", () => {
            button.classList.remove("button-hover");
        });

    });


    // -----------------------------------------------------
    // 11. Back-to-top style navigation support
    // -----------------------------------------------------

    const analyseAnotherButton =
        document.querySelector(
            'a[href="/"], .analyse-another'
        );

    if (analyseAnotherButton) {

        analyseAnotherButton.addEventListener(
            "click",
            () => {

                document.body.classList.add(
                    "page-exiting"
                );

            }
        );

    }


    // -----------------------------------------------------
    // 12. Keyboard accessibility
    // -----------------------------------------------------

    fields.forEach((field) => {

        field.addEventListener("keydown", (event) => {

            if (
                event.key === "Enter" &&
                field.tagName !== "SELECT"
            ) {

                if (!form) {
                    return;
                }

                const formElements =
                    Array.from(
                        form.querySelectorAll(
                            "input, select, button"
                        )
                    );

                const currentIndex =
                    formElements.indexOf(field);

                const nextElement =
                    formElements[currentIndex + 1];

                if (nextElement) {
                    event.preventDefault();
                    nextElement.focus();
                }

            }

        });

    });


    // -----------------------------------------------------
    // 13. Console confirmation for development
    // -----------------------------------------------------

    console.log(
        "Customer Intelligence interface loaded successfully."
    );

});