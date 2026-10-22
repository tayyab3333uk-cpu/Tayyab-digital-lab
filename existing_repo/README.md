# Tayyab Faisal — Full-Stack Developer Portfolio

A professional, high-performance, cinematic personal portfolio engineered for **Tayyab Faisal**, Full-Stack Web Developer based in Karachi, Pakistan. Built with semantic HTML5, modern CSS3, Bootstrap 5, GSAP 3 & ScrollTrigger, and an optional PHP backend endpoint.

---

## 🚀 Live Demo & Profiles

* **GitHub Profile:** [https://github.com/tayyab3333uk-cpu](https://github.com/tayyab3333uk-cpu)
* **LinkedIn Profile:** [https://www.linkedin.com/in/tayyab-faisal-25532b378](https://www.linkedin.com/in/tayyab-faisal-25532b378)
* **Email:** [tayyab3333.uk@gmail.com](mailto:tayyab3333.uk@gmail.com)
* **Direct Phone / WhatsApp:** +92 334 8275259

---

## 🛠️ Verified Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, CSS Grid, Flexbox |
| **Backend** | PHP (Procedural & OOP, REST APIs), Laravel (MVC, Routing, Blade, Eloquent) |
| **Database** | MySQL (Relational Schema Design, Foreign Keys, Normalization, Queries) |
| **Programming Language** | Java (Object-Oriented Programming, Classes, Inheritance, Polymorphism) |
| **Animation & UX** | GSAP 3.12+, ScrollTrigger, Responsive Glassmorphism, Micro-Interactions |
| **Tools & Environment** | Git, GitHub, Visual Studio Code, XAMPP (Apache/MySQL), WordPress |

---

## 📂 Project Architecture

```text
Tayyab-Portfolio/
├── index.html                   # Main single-page developer portfolio
├── cv.html                      # Dedicated ATS-compliant printable CV (Print to PDF)
├── README.md                    # Documentation & setup guide
├── .gitignore                   # Git ignore specifications
├── api/
│   └── contact.php              # Secure PHP backend contact endpoint (for XAMPP/Apache)
└── assets/
    ├── css/
    │   ├── style.css            # Dark midnight theme, typography, layout & components
    │   └── animations.css       # Keyframes, floating effects, glowing pulses & scanlines
    ├── js/
    │   ├── main.js              # Navbar scroll spy, mobile drawer, terminal tabs, copy code
    │   ├── animations.js        # GSAP timelines, ScrollTrigger reveals, card 3D tilt
    │   └── contact.js           # Form validation, honest PHP submission & static mailto/WhatsApp fallback
    └── images/
        ├── placeholder-avatar.svg # High-contrast developer avatar placeholder
        ├── project-aura.svg     # Visual preview for Aura Watches
        ├── project-gaming.svg   # Visual preview for Reely Gaming Devices
        ├── project-civic.svg    # Visual preview for PakCivic
        ├── tayyab-profile.png   # (Drop your suit portrait here)
        └── tayyab-about.png     # (Drop your outdoor portrait here)
```

---

## 📸 Adding Your Personal Photographs

To replace the fallback monogram badges with your actual portraits:

1. Copy your professional suit portrait to:
   ```text
   assets/images/tayyab-profile.png
   ```
2. Copy your outdoor portrait to:
   ```text
   assets/images/tayyab-about.png
   ```
3. Keep the third developer-workspace reference image for design alignment:
   ```text
   assets/images/developer-workspace-reference.png
   ```

*Note: The website includes an automated fallback mechanism: if the PNG files are not found, it seamlessly renders the clean SVG avatar badge without displaying broken image icons.*

---

## 💻 Local Development & Testing

### Option A: Quick Static Preview (Python or VS Code)

If testing the static frontend:

1. Using **Python 3**:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your web browser.

2. Using **VS Code Live Server**:
   - Right-click `index.html` and choose **"Open with Live Server"**.

### Option B: Full Backend Testing with PHP / XAMPP

If testing the PHP contact submission script (`api/contact.php`):

1. Copy the `Tayyab-Portfolio` directory into your XAMPP web root:
   ```text
   C:\xampp\htdocs\Tayyab-Portfolio
   ```
2. Start **Apache** and **MySQL** in the XAMPP Control Panel.
3. Open `http://localhost/Tayyab-Portfolio/` in your browser.
4. Fill out the contact form and submit. The script will validate the input and log the message to `logs/contact_submissions.log`.

---

## 🌐 Deployment Instructions

### 1. Deploying to GitHub Pages (Static Hosting)

GitHub Pages hosts static HTML, CSS, and JS:

1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: complete developer portfolio for Tayyab Faisal"
   ```
2. Add your remote repository:
   ```bash
   git remote add origin https://github.com/tayyab3333uk-cpu/Tayyab-Portfolio.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub, navigate to **Settings** > **Pages** > Select `main` branch and `/ (root)` folder > Click **Save**.
4. **Backend Handling on GitHub Pages:**
   - Because GitHub Pages does not run PHP, `assets/js/contact.js` detects the static environment and transparently offers 1-click **Direct Email** and **WhatsApp** dispatches without displaying fake submission messages.

### 2. Deploying with Full PHP Support (cPanel / Apache / VPS)

To enable live execution of `api/contact.php`:
1. Upload all files to your server's `public_html` directory via FTP or Git.
2. Ensure PHP 7.4+ or 8.x is enabled.
3. Configure your server's sendmail / SMTP in `php.ini` or connect your preferred mail service (e.g., PHPMailer or SendGrid).

---

## 📄 CV / Resume System

* Access the print-ready CV at `cv.html` or by clicking **"Download CV"** in the navigation bar.
* Features clean print stylesheets (`@media print`) that format the document directly for A4 paper and PDF export when using your browser's Print dialog (`Ctrl + P` / `Cmd + P`).
