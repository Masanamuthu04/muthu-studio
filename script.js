
document.addEventListener("DOMContentLoaded", () => {

    // M ZOOM INTRO ANIMATION
const introScreen = document.getElementById("introScreen");

if (introScreen) {
    setTimeout(() => {
        introScreen.remove();
    }, 2800);
}
    // EMAILJS INITIALIZATION
    if (window.emailjs) {
        emailjs.init({
            publicKey: "qNQnlbWF40VBl-y8e"
        });
    } else {
        console.error("EmailJS library failed to load.");
    }


    // MOBILE MENU
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");

            menuToggle.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }
    // NAVBAR CENTER SCROLL
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (!targetSection) return;

            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            history.replaceState(null, "", targetId);

        });

    });

    // SCROLL REVEAL
    const revealElements = document.querySelectorAll(
        ".section-heading, .services-heading, .projects-header, .project-card, .service-card, .skill-card, .about-content, .about-visual, .contact-left, .contact-right, .contact-form"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealElements.forEach(element => {
            element.classList.add("reveal");
            observer.observe(element);
        });

    } else {
        revealElements.forEach(element => {
            element.classList.add("show");
        });
    }


    // POPUP MESSAGE
    function showPopup(message, type) {
        const overlay = document.createElement("div");
        overlay.className = "email-popup-overlay";

        const popup = document.createElement("div");
        popup.className = "email-popup";

        const icon = document.createElement("div");
        icon.className = "email-popup-icon";
        icon.textContent = type === "success" ? "✓" : "!";

        const heading = document.createElement("h3");
        heading.textContent = type === "success"
            ? "Message Sent Successfully!"
            : "Message Not Sent";

        const description = document.createElement("p");
        description.textContent = message;

        const closeButton = document.createElement("button");
        closeButton.textContent = "Okay";
        closeButton.className = "email-popup-button";

        closeButton.addEventListener("click", () => {
            overlay.remove();
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });

        popup.append(icon, heading, description, closeButton);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }


    // CONTACT FORM EMAIL SENDING
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async event => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const service = document.getElementById("service").value;
            const message = document.getElementById("message").value.trim();

            const submitButton = contactForm.querySelector(".contact-submit");

            if (!submitButton) return;

            const originalButtonText = submitButton.innerHTML;


            // CHECK EMAILJS
            if (!window.emailjs) {
                showPopup(
                    "Email service is not available. Please try again later.",
                    "error"
                );
                return;
            }


            // CHECK REQUIRED FIELDS
            if (!name || !email || !message) {
                showPopup(
                    "Please fill in all required fields.",
                    "error"
                );
                return;
            }


            // START SENDING
            submitButton.disabled = true;
            submitButton.textContent = "Sending Message...";

            try {
                await emailjs.send(
                    "service_p745hf9",
                    "template_zhtwkh9",
                    {
                        name: name,
                        email: email,
                        service: service,
                        message: message
                    }
                );

                contactForm.reset();

                showPopup(
                    "Thanks for reaching out! I'll review your message and get back to you soon.",
                    "success"
                );

            } catch (error) {
                console.error("Email sending failed:", error);

                showPopup(
                    "Something went wrong. Please try again.",
                    "error"
                );

            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

});
