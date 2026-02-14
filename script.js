document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        // Toggle Nav and Hamburger classes
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        root: null,
        threshold: 0.05, // Trigger slightly earlier
        rootMargin: "0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Modal Logic
    const modal = document.getElementById("quickstart-modal");
    const openModalBtns = document.querySelectorAll(".open-modal");
    const closeModalSpan = document.querySelector(".close-modal");

    // Find form inside modal if it exists
    const modalForm = modal ? modal.querySelector("form") : null;
    let targetFile = "quickstart-guide.pdf"; // Default file

    if (openModalBtns.length > 0 && modal) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Check if it's the contact form submit button, which we don't want to trigger modal
                if (btn.type === 'submit') return;

                e.preventDefault();

                // Capture the file requested
                if (btn.getAttribute("data-file")) {
                    targetFile = btn.getAttribute("data-file");
                } else {
                    targetFile = "quickstart-guide.pdf"; // Default for Hero buttons
                }

                modal.classList.add("show");
            });
        });
    }

    if (closeModalSpan) {
        closeModalSpan.addEventListener('click', () => {
            modal.classList.remove("show");
        });
    }

    // Handle Form Submit (Mock Download)
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = modalForm.querySelector("button");
            const originalText = btn.innerText;

            const nameInput = document.getElementById('modal-name');
            const emailInput = document.getElementById('modal-email');

            const name = nameInput.value;
            const email = emailInput.value;

            // 1. UI Feedback
            btn.innerText = "Connecting to Neural Network...";
            btn.style.opacity = "0.7";
            btn.disabled = true;

            // 2. Call Netlify Function
            fetch('/.netlify/functions/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            })
                .then(response => {
                    if (response.ok) {
                        // 3. Success: Redirect
                        window.location.href = "thank_you.html";
                    } else {
                        throw new Error('Subscription failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    btn.innerText = "Connection Failed. Try Again.";
                    btn.style.opacity = "1";
                    btn.disabled = false;
                    setTimeout(() => {
                        btn.innerText = originalText;
                    }, 3000);
                    alert("There was an issue connecting to the mainframe. Please check your signal (internet) and try again.");
                });
        });
    }

    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.classList.remove("show");
        }
    });
});
