document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // CUSTOMER CHURN PREDICTION — UI INTERACTIONS
    // =====================================================

    const form = document.querySelector("form");
    const submitButton = form
        ? form.querySelector('button[type="submit"], input[type="submit"]')
        : null;

    // -----------------------------------------------------
    // 1. Smooth entrance animation
    // -----------------------------------------------------

    document.body.classList.add("page-loaded");


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

            if (field.value.trim() !== "") {
                field.classList.add("field-complete");
            } else {
                field.classList.remove("field-complete");
            }
        });

    });


    // -----------------------------------------------------
    // 3. Form submission loading state
    // -----------------------------------------------------

    if (form) {

        form.addEventListener("submit", (event) => {

            // Allow normal Flask form submission
            if (!form.checkValidity()) {
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

        form.addEventListener("submit", () => {

            if (submissionStarted) {
                return;
            }

            submissionStarted = true;

        });

    }


    // -----------------------------------------------------
    // 5. Animate probability bar on results page
    // -----------------------------------------------------

    const probabilityBar = document.querySelector(
        ".probability-fill"
    );

    if (probabilityBar) {

        const targetWidth =
            probabilityBar.dataset.probability ||
            probabilityBar.getAttribute("data-width") ||
            probabilityBar.style.width;

        probabilityBar.style.width = "0%";

        requestAnimationFrame(() => {

            setTimeout(() => {

                if (targetWidth) {
                    probabilityBar.style.width = targetWidth;
                }

            }, 250);

        });

    }


    // -----------------------------------------------------
    // 6. Animate result cards
    // -----------------------------------------------------

    const resultCards = document.querySelectorAll(
        ".result-card, .profile-card, .risk-card, .guidance-card"
    );

    resultCards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";

        setTimeout(() => {

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

        setTimeout(() => {
            riskBadge.classList.add("risk-visible");
        }, 500);

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

        setTimeout(() => {

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 300);

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