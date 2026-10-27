/**
 * Mant Sherasiya - Portfolio Interactive Engine
 * Core Logic: Theme System, Neural Canvas, K-Means Playground, Project Modals, Typewriter
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initNeuralCanvas();
  initTypewriter();
  initStatCounters();
  initHeroTilt();
  initProjectFilters();
  initProjectModal();
  initKMeansPlayground();
  initResumeActions();
  initContactForm();
  initMobileNav();
  initScrollSpy();
});

/* --------------------------------------------------------------------------
   1. Theme System (Modern Web Guidance Compliant)
   -------------------------------------------------------------------------- */
function initThemeSystem() {
  const themeToggle = document.getElementById('theme-toggle');
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  const mediaDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getActiveTheme() {
    const saved = localStorage.getItem('color-scheme');
    if (saved === 'light' || saved === 'dark') return saved;
    return mediaDark.matches ? 'dark' : 'light';
  }

  function applyTheme(theme, persist = true) {
    if (theme === 'system') {
      localStorage.removeItem('color-scheme');
      metaColorScheme.content = 'light dark';
      document.documentElement.setAttribute('data-theme', 'system');
      showToast('Theme set to System Default');
    } else {
      if (persist) localStorage.setItem('color-scheme', theme);
      metaColorScheme.content = theme;
      document.documentElement.setAttribute('data-theme', theme);
      showToast(`Switched to ${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode`);
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = getActiveTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  mediaDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('color-scheme')) {
      metaColorScheme.content = 'light dark';
      document.documentElement.setAttribute('data-theme', 'system');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Interactive Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Machine Learning Pipelines',
    'Customer Segmentation & RFM',
    'Power BI Dashboards & DAX',
    'Generative AI & RAG Systems',
    'Econometric & SQL Analytics',
    'Predictive Modeling'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
}

/* --------------------------------------------------------------------------
   3. Animated Stat Counters
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const numbers = document.querySelectorAll('.stat-number');
  if (!numbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasAnimated) {
      hasAnimated = true;
      numbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-count'), 10);
        const duration = 1600;
        const start = performance.now();

        function updateCount(time) {
          const progress = Math.min((time - start) / duration, 1);
          const easeOutQuad = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(easeOutQuad * target);
          num.textContent = current;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            num.textContent = target;
          }
        }

        requestAnimationFrame(updateCount);
      });
    }
  }, { threshold: 0.3 });

  const statsRow = document.querySelector('.hero-stats-row');
  if (statsRow) observer.observe(statsRow);
}

/* --------------------------------------------------------------------------
   4. Hero 3D Card Gyroscope / Tilt Effect
   -------------------------------------------------------------------------- */
function initHeroTilt() {
  const card = document.getElementById('heroCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* --------------------------------------------------------------------------
   5. Ambient Neural Background Canvas
   -------------------------------------------------------------------------- */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 70);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1
    });
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const dotColor = isDark ? 'rgba(0, 229, 255, 0.45)' : 'rgba(2, 132, 199, 0.3)';
    const lineColor = isDark ? 'rgba(99, 102, 241, ' : 'rgba(14, 165, 233, ';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = lineColor + (1 - dist / 130) * 0.22 + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(0, 229, 255, ' + (1 - dist / 150) * 0.35 + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   6. Project Filtering System
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Project Deep Dive Modal Database & Controller
   -------------------------------------------------------------------------- */
const PROJECT_DETAILS = {
  unsupervised: {
    title: 'Customer Segmentation using Unsupervised Learning',
    category: 'Unsupervised Machine Learning & RFM Analytics',
    image: 'assets/project_clustering.jpg',
    github: 'https://github.com/Mant-0957/UnSuperVised_FINAL',
    problem: 'Retail businesses face high churn and marketing waste when adopting generic blanket promotions. The goal was to systematically uncover behavioral archetypes and buying loyalty from over 500,000 real-world e-commerce transaction logs (Online Retail II dataset).',
    methodology: 'Engineered Recency, Frequency, and Monetary (RFM) feature spaces, followed by Log Transformation and RobustScaler to neutralize skew and outliers. Implemented K-Means, Agglomerative Hierarchical Clustering, and DBSCAN. Conducted Elbow method and Silhouette coefficient analysis to mathematically validate the optimal cluster count (K=4).',
    results: [
      'Segmented customer base into 4 distinct actionable cohorts: Champions (High RFM), Loyal Customers, At Risk, and Hibernating.',
      'Identified that the top 15% of customer cohort generated over 58% of aggregate gross revenue.',
      'Compared Silhouette Scores across K-Means (0.42), DBSCAN (0.34 due to density variations), and Agglomerative (0.39).'
    ],
    tech: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'RFM Modeling', 'K-Means', 'DBSCAN', 'Hierarchical Clustering', 'Matplotlib', 'Seaborn']
  },
  supervised: {
    title: 'Supervised Machine Learning Predictive Pipeline',
    category: 'Predictive Modeling & Scikit-learn',
    image: 'assets/project_ml_sql.jpg',
    github: 'https://github.com/Mant-0957/SuperVised_FINAL',
    problem: 'Constructing robust, reproducible predictive classification and regression models requires handling real-world issues: missing values, multicollinearity, class imbalance, and hyperparameter sensitivity.',
    methodology: 'Developed an end-to-end ML notebook pipeline implementing automated EDA, Median/Mode imputation, One-Hot & Target Encoding, and Stratified K-Fold cross validation. Evaluated Logistic Regression, Random Forest, and Gradient Boosting with GridSearchCV tuning and SHAP-based feature importance interpretation.',
    results: [
      'Achieved 0.88 Classification Accuracy and 0.94 ROC-AUC on holdout validation test sets.',
      'Constructed detailed Confusion Matrices, Precision-Recall curves, and identified key predictive drivers.',
      'Packaged trained models using Pickle for production inference readiness.'
    ],
    tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'ROC/AUC Analysis', 'Random Forest', 'Cross-Validation', 'Jupyter Notebook']
  },
  economy: {
    title: 'Indian Economy Macroeconomic Analysis',
    category: 'Econometrics & Statistical Visualization',
    image: 'assets/project_economy.jpg',
    github: 'https://github.com/Mant-0957/Indian_Economy_Analysis',
    problem: 'Understanding multi-decade structural shifts in India’s macroeconomic landscape requires reconciling disparate datasets across GDP growth, CPI inflation, fiscal deficits, and sectoral contributions (GVA).',
    methodology: 'Aggregated longitudinal macroeconomic data from RBI and statistical yearbooks. Cleaned and indexed historical records in Excel and Pandas. Applied moving averages, correlation matrices, and time-series decomposition to model post-reform trajectories.',
    results: [
      'Visualized the structural transition of India’s economy from Agriculture (15.1%) to Services (56.6% GVA contribution).',
      'Modeled inflation vs. fiscal deficit dynamics and highlighted key resilience intervals during global supply chain shocks.',
      'Generated high-definition visual narratives for academic and economic stakeholders.'
    ],
    tech: ['Python', 'Excel Pivot Tables', 'Descriptive Statistics', 'Time Series EDA', 'Matplotlib', 'Seaborn']
  },
  salesbi: {
    title: 'Executive Sales Analytics & KPI Dashboard',
    category: 'Power BI Business Intelligence',
    image: 'assets/project_powerbi.jpg',
    github: 'https://github.com/Mant-0957/PR3_Sales_PowerBI',
    problem: 'Enterprise leadership required an executive single-pane dashboard to track revenue velocities, regional variances, and customer conversion rates across cross-border product lines.',
    methodology: 'Built a multi-table Star Schema data model in Power BI Desktop. Created complex DAX measures including Year-over-Year (YoY) revenue changes, Moving Average Orders, Customer Lifetime Value (CLV), and dynamic parameter slicers.',
    results: [
      'Delivered interactive drill-downs across regions (NA, EMEA, APAC, LATAM) with automatic KPI threshold alerts.',
      'Enhanced reporting speed by 40% through optimized data model relationships and aggregated views.',
      'Synthesized monthly revenue trends against targets to support quarterly budgeting decisions.'
    ],
    tech: ['Power BI Desktop', 'DAX Measures', 'Star Schema Modeling', 'Data Cleaning', 'KPI Dashboards', 'Sales Intelligence']
  },
  sqlstudy: {
    title: 'Business Case Study & Advanced SQL Analytics',
    category: 'Relational Database Intelligence',
    image: 'assets/project_ml_sql.jpg',
    github: 'https://github.com/Mant-0957/sqlfinalproject',
    problem: 'Navigating raw transactional relational databases to uncover churn rates, repeat purchase velocity, and regional revenue concentration using raw SQL queries.',
    methodology: 'Designed relational schemas and authored advanced SQL queries leveraging Multi-Table INNER/LEFT JOINs, Common Table Expressions (CTEs), Subqueries, Aggregate Window Functions (ROW_NUMBER, DENSE_RANK, SUM OVER PARTITION), and CASE statements.',
    results: [
      'Extracted monthly customer retention matrices and cohort behavioral metrics from relational databases.',
      'Identified top 5 highest-margin product categories contributing to over 40% of net profits.',
      'Translated database outputs into concise business briefs and strategic recommendations.'
    ],
    tech: ['SQL', 'Relational Schemas', 'CTEs & Window Functions', 'Cohort Analysis', 'Database Query Tuning', 'Business Analytics']
  },
  studentbi: {
    title: 'Student Academic Analytics Dashboard',
    category: 'Education Analytics & Power BI',
    image: 'assets/project_powerbi.jpg',
    github: 'https://github.com/Mant-0957/Student_PR_POWERBI',
    problem: 'Educational institutions struggle to identify at-risk students early due to fragmented attendance, exam performance, and extracurricular engagement metrics.',
    methodology: 'Engineered data pipeline linking attendance registries with semester examination distributions. Created Power BI visual hierarchy with quartile distributions, subject correlation heatmaps, and attendance-score regression lines.',
    results: [
      'Demonstrated direct correlation between attendance thresholds (<75%) and letter-grade drops.',
      'Empowered academic advisors with interactive student score cards and progress projections.',
      'Implemented dynamic filtering across academic batches, grades, and subjects.'
    ],
    tech: ['Power BI', 'DAX', 'Data Preparation', 'Academic Metrics', 'Data Visualization']
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const dismissBtn = document.getElementById('modal-dismiss-btn');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  if (!modal) return;

  function openProject(id) {
    const data = PROJECT_DETAILS[id];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-img').src = data.image;
    document.getElementById('modal-problem').textContent = data.problem;
    document.getElementById('modal-methodology').textContent = data.methodology;

    const resultsList = document.getElementById('modal-results');
    resultsList.innerHTML = '';
    data.results.forEach(res => {
      const li = document.createElement('li');
      li.textContent = res;
      resultsList.appendChild(li);
    });

    const techBox = document.getElementById('modal-tech-stack');
    techBox.innerHTML = '';
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      techBox.appendChild(span);
    });

    const ghLink = document.getElementById('modal-github-link');
    ghLink.href = data.github;

    modal.showModal();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.close();
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project-id');
      openProject(id);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  dismissBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* --------------------------------------------------------------------------
   8. Interactive K-Means Customer Clustering Playground
   -------------------------------------------------------------------------- */
function initKMeansPlayground() {
  const canvas = document.getElementById('kmeansCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const kSelect = document.getElementById('k-select');
  const btnGenerate = document.getElementById('btn-generate-points');
  const btnStep = document.getElementById('btn-step-cluster');
  const btnRun = document.getElementById('btn-run-cluster');
  const btnClear = document.getElementById('btn-clear-canvas');

  const pointCountEl = document.getElementById('point-count');
  const iterationCountEl = document.getElementById('iteration-count');
  const statusEl = document.getElementById('cluster-status');

  const CLUSTER_COLORS = ['#00e5ff', '#a855f7', '#10b981', '#f59e0b', '#f43f5e'];

  let points = [];
  let centroids = [];
  let iterations = 0;
  let isConverged = false;
  let animId = null;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    draw();
  }

  window.addEventListener('resize', resizeCanvas);

  function generateSampleCohorts() {
    points = [];
    iterations = 0;
    isConverged = false;
    iterationCountEl.textContent = '0';
    statusEl.textContent = 'Cohort Generated';

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Generate 3 natural clusters: Low RFM, Medium Casuals, High Champions
    const centers = [
      { x: w * 0.25, y: h * 0.75, count: 40, spread: 45 }, // Low Spend, Infrequent
      { x: w * 0.55, y: h * 0.50, count: 45, spread: 50 }, // Moderate Regulars
      { x: w * 0.80, y: h * 0.25, count: 35, spread: 40 }  // High Value Champions
    ];

    centers.forEach(c => {
      for (let i = 0; i < c.count; i++) {
        points.push({
          x: Math.max(20, Math.min(w - 20, c.x + (Math.random() - 0.5) * c.spread * 2)),
          y: Math.max(20, Math.min(h - 20, c.y + (Math.random() - 0.5) * c.spread * 2)),
          cluster: -1
        });
      }
    });

    initCentroids();
    updateUI();
    draw();
  }

  function initCentroids() {
    const k = parseInt(kSelect.value, 10);
    centroids = [];
    if (points.length === 0) return;

    // Pick random initial points as centroids (Forgy initialization)
    const shuffled = [...points].sort(() => 0.5 - Math.random());
    for (let i = 0; i < k; i++) {
      const p = shuffled[i % shuffled.length];
      centroids.push({
        x: p.x + (Math.random() - 0.5) * 20,
        y: p.y + (Math.random() - 0.5) * 20,
        color: CLUSTER_COLORS[i % CLUSTER_COLORS.length]
      });
    }
  }

  function stepClustering() {
    if (points.length === 0 || centroids.length === 0) return;

    // 1. Assign points to nearest centroid
    let changed = false;
    points.forEach(p => {
      let minDist = Infinity;
      let closest = -1;

      centroids.forEach((c, cIdx) => {
        const dx = p.x - c.x;
        const dy = p.y - c.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < minDist) {
          minDist = distSq;
          closest = cIdx;
        }
      });

      if (p.cluster !== closest) {
        changed = true;
        p.cluster = closest;
      }
    });

    // 2. Recompute centroid positions
    centroids.forEach((c, cIdx) => {
      const assigned = points.filter(p => p.cluster === cIdx);
      if (assigned.length > 0) {
        const sumX = assigned.reduce((acc, curr) => acc + curr.x, 0);
        const sumY = assigned.reduce((acc, curr) => acc + curr.y, 0);
        c.x = sumX / assigned.length;
        c.y = sumY / assigned.length;
      }
    });

    iterations++;
    iterationCountEl.textContent = iterations;

    if (!changed) {
      isConverged = true;
      statusEl.textContent = 'Converged (Optimal)';
    } else {
      statusEl.textContent = `Iteration ${iterations}`;
    }

    draw();
  }

  function autoRun() {
    if (isConverged) {
      initCentroids();
      isConverged = false;
      iterations = 0;
    }

    function loop() {
      if (!isConverged && iterations < 30) {
        stepClustering();
        animId = setTimeout(loop, 240);
      }
    }
    loop();
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw customer points
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      if (p.cluster >= 0 && centroids[p.cluster]) {
        ctx.fillStyle = centroids[p.cluster].color;
        ctx.shadowColor = centroids[p.cluster].color;
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    });

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw centroids (Distinct Glowing Stars/Crosses)
    centroids.forEach((c, idx) => {
      ctx.save();
      ctx.translate(c.x, c.y);

      // Centroid glow circle
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = 0.3;
      ctx.fill();

      // Centroid border
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Centroid marker symbol
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = c.color;
      ctx.font = '600 12px JetBrains Mono, monospace';
      ctx.fillText(`C${idx + 1}`, 18, 4);

      ctx.restore();
    });
  }

  function updateUI() {
    pointCountEl.textContent = `${points.length} points`;
  }

  // Click canvas to add points
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    points.push({ x, y, cluster: -1 });
    isConverged = false;
    statusEl.textContent = 'Point Added';
    updateUI();
    draw();
  });

  kSelect.addEventListener('change', () => {
    initCentroids();
    iterations = 0;
    isConverged = false;
    iterationCountEl.textContent = '0';
    statusEl.textContent = 'K Changed';
    draw();
  });

  btnGenerate.addEventListener('click', generateSampleCohorts);
  btnStep.addEventListener('click', stepClustering);
  btnRun.addEventListener('click', autoRun);

  btnClear.addEventListener('click', () => {
    points = [];
    centroids = [];
    iterations = 0;
    isConverged = false;
    clearTimeout(animId);
    iterationCountEl.textContent = '0';
    statusEl.textContent = 'Cleared';
    updateUI();
    draw();
  });

  // Initial startup
  setTimeout(() => {
    resizeCanvas();
    generateSampleCohorts();
  }, 300);
}

/* --------------------------------------------------------------------------
   9. Resume Actions (Print, Download & Copy)
   -------------------------------------------------------------------------- */
function initResumeActions() {
  const printBtn = document.getElementById('btn-print-resume');
  const copyBtn = document.getElementById('btn-copy-resume');

  printBtn?.addEventListener('click', () => {
    window.print();
  });

  copyBtn?.addEventListener('click', () => {
    const resumeText = `MANT SHERASIYA
Ahmedabad, Gujarat, India | +91 7016550632 | mantsherasiya05@gmail.com | https://github.com/Mant-0957

PROFESSIONAL SUMMARY
B. Tech Computer Science Engineering student and aspiring Data Scientist with hands-on project experience in machine learning, unsupervised learning, data analysis, SQL, Power BI, Excel, and statistical analysis. Building skills in Generative AI, Large Language Models (LLMs), and Retrieval-Augmented Generation (RAG).

EDUCATION
- Gandhinagar University: B.Tech in CSE (2025–2029)
- S.S. Agrawal Public School: Class XII — 81.1% (2024–2025)
- Krishna School: Class X — 94.16% (2022–2023)

TECHNICAL SKILLS
- Programming & Data: Python, SQL, C++, OOP, Pandas, NumPy
- Machine Learning & AI: Scikit-learn, Supervised Learning, Unsupervised Clustering (K-Means, DBSCAN, Agglomerative), GenAI, LLMs, RAG
- Data Analysis & BI: Power BI, Advanced Excel, Pivot Tables, Dashboards, EDA
- Mathematics & Statistics: Statistics, Probability, Linear Algebra, Calculus
- Tools: Git, GitHub, Jupyter Notebook, Colab, Matplotlib, Seaborn, Pickle`;

    navigator.clipboard.writeText(resumeText).then(() => {
      showToast('Resume summary copied to clipboard! 📋');
    });
  });
}

/* --------------------------------------------------------------------------
   10. Contact Form & Clipboard Copy Utilities
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied "${text}" to clipboard!`);
      });
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      const mailtoLink = `mailto:mantsherasiya05@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Mant,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      window.location.href = mailtoLink;
      showToast('Opening default mail client with prefilled message! 🚀');
      form.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   11. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   12. Navigation Active State Spy
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Toast Notification Generator
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3600);
}
