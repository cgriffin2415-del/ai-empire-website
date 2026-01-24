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

            // 1. Simulate Processing
            btn.innerText = "Decrypting Signal...";
            btn.style.opacity = "0.7";

            setTimeout(() => {
                // 2. Trigger Download
                // In a real app, this would be a response from the server.
                // Here we just point to the downloads folder.
                const downloadLink = document.createElement("a");
                downloadLink.href = `downloads/${targetFile}`;
                downloadLink.download = targetFile; // Suggest filename
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // 3. Reset UI
                btn.innerText = "Download Initialized";
                setTimeout(() => {
                    modal.classList.remove("show");
                    btn.innerText = originalText;
                    btn.style.opacity = "1";
                    modalForm.reset();
                }, 1500);

            }, 1500); // 1.5s delay
        });
    }

    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.classList.remove("show");
        }
    });
});
