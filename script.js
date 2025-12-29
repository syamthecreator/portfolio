// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  offset: 100,
  easing: 'ease-out',
  once: true,
  disable: 'mobile'
});

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const mobileNav = document.getElementById('mobileNav');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-progress');

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
}

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
  mobileNav.classList.add('active');
  document.body.style.overflow = 'hidden';
  menuToggle.classList.add('active');
});

closeMenu.addEventListener('click', () => {
  mobileNav.classList.remove('active');
  document.body.style.overflow = '';
  menuToggle.classList.remove('active');
});

// Close mobile menu when clicking on links
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
    menuToggle.classList.remove('active');
  });
});

// Typing Effect
class TypeWriter {
  constructor(element, words, wait = 3000) {
    this.element = element;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 100;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Initialize typing effect
const typedText = document.querySelector('.typed-text');
if (typedText) {
  const words = ['Delight Users', 'Solve Problems', 'Scale Businesses', 'Innovate'];
  new TypeWriter(typedText, words);
}

// Active Navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

function updateActiveLink() {
  let scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// Back to Top Button
function toggleBackToTop() {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', toggleBackToTop);

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Animate Skill Bars
function animateSkillBars() {
  skillBars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight - 100) {
      const width = bar.getAttribute('data-width');
      bar.style.width = `${width}%`;
    }
  });
}

// Use Intersection Observer for skill bars
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const width = bar.getAttribute('data-width');
      bar.style.width = `${width}%`;
    }
  });
}, observerOptions);

skillBars.forEach(bar => observer.observe(bar));

// Form Submission with EmailJS (FINAL)
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm(
      'syamthecreator@08',
      'template_o9jxg5f',
      contactForm
    )
    .then(() => {
      showNotification(
        "Message sent successfully! I'll get back to you soon.",
        "success"
      );
      contactForm.reset();
    })
    .catch((error) => {
      showNotification(
        "Failed to send message. Please try again later.",
        "error"
      );
      console.error("EmailJS Error:", error);
    });
  });
}


// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-info-circle'}'></i>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // Add styles for notification
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 30px;
      right: 30px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-left: 4px solid ${type === 'success' ? '#10b981' : '#3b82f6'};
      border-radius: var(--radius-md);
      padding: 16px 20px;
      box-shadow: var(--shadow-lg);
      z-index: 2000;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s forwards;
      max-width: 400px;
    }
    
    .notification.success {
      border-left-color: #10b981;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .notification i {
      font-size: 24px;
      color: ${type === 'success' ? '#10b981' : '#3b82f6'};
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  `;

  document.head.appendChild(style);

  // Remove notification after animation
  setTimeout(() => {
    notification.remove();
    style.remove();
  }, 3300);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Parallax effect for background blobs
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const blobs = document.querySelectorAll('.gradient-blob');

  blobs.forEach((blob, index) => {
    const speed = 0.2 + (index * 0.1);
    const yPos = -(scrolled * speed);
    blob.style.transform = `translateY(${yPos}px)`;
  });
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  updateActiveLink();
  toggleBackToTop();
  animateSkillBars();

  // Add loading animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

document.addEventListener("DOMContentLoaded", () => {
  const projects = document.querySelectorAll(".project-item");
  const toggleBtn = document.getElementById("toggleProjects");

  const INITIAL_COUNT = 3;
  let expanded = false;

  function showInitialProjects() {
    projects.forEach((project, index) => {
      if (index < INITIAL_COUNT) {
        project.classList.add("visible");
      } else {
        project.classList.remove("visible");
      }
    });
  }

  // Initial state
  showInitialProjects();

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    expanded = !expanded;

    if (expanded) {
      projects.forEach(project => project.classList.add("visible"));
      toggleBtn.querySelector("span").textContent = "Show Less Projects";
    } else {
      showInitialProjects();
      toggleBtn.querySelector("span").textContent = "View All Projects";
    }
  });
});



function forceDownload(url, fileName) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Fetch failed");
      return res.blob();
    })
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(() => {
      // Fallback (opens PDF if download blocked)
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.target = "_self";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
}


// Desktop
const resumeBtn = document.getElementById("downloadResume");
if (resumeBtn) {
  resumeBtn.addEventListener("click", () => {
    forceDownload(
      "assets/resume/Syam_Kumar_Flutter_Developer.pdf",
      "Syam_Kumar_Flutter_Developer.pdf"
    );
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const extras = document.querySelectorAll(".skill-extra");
  const btn = document.getElementById("toggleSkills");
  let open = false;

  btn.addEventListener("click", e => {
    e.preventDefault();
    open = !open;

    extras.forEach(skill => skill.classList.toggle("show", open));

    btn.querySelector("span").textContent =
      open ? "Show Less Skills" : "View More Skills";

    if (open) {
      setTimeout(() => {
        document.querySelectorAll(".skill-extra .skill-progress")
          .forEach(bar => bar.style.width = bar.dataset.width + "%");
      }, 150);
    }
  });
});

// Mobile
const resumeBtnMobile = document.getElementById("downloadResumeMobile");
if (resumeBtnMobile) {
  resumeBtnMobile.addEventListener("click", () => {
    forceDownload(
      "assets/resume/Syam_Kumar_Flutter_Developer.pdf",
      "Syam_Kumar_Flutter_Developer.pdf"
    );
  });
}
