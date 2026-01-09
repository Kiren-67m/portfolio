// ============================================
// Navigation & Scroll Effects
// ============================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
    
    // Update scroll progress
    updateScrollProgress();
    
    // Update active nav link
    updateActiveNavLink();
});

// Scroll progress bar
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// ============================================
// Intersection Observer for Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// Observe skill items
document.querySelectorAll('.skill-item').forEach(item => {
    observer.observe(item);
});

// ============================================
// AI Chat Interface
// ============================================

const chatButton = document.getElementById('chatButton');
const chatPanel = document.getElementById('chatPanel');
const chatOverlay = document.getElementById('chatOverlay');
const chatClose = document.getElementById('chatClose');
const chatBack = document.getElementById('chatBack');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const quickQuestions = document.querySelectorAll('.quick-question');
const chatTriggerNav = document.querySelector('.chat-trigger-nav');

// Open chat panel
function openChat() {
    chatPanel.classList.add('active');
    chatOverlay.classList.add('active');
    chatButton.classList.add('hidden');
    document.body.style.overflow = 'hidden';
    chatInput.focus();
}

// Close chat panel
function closeChat() {
    chatPanel.classList.remove('active');
    chatOverlay.classList.remove('active');
    chatButton.classList.remove('hidden');
    document.body.style.overflow = '';
}

// Event listeners
chatButton.addEventListener('click', openChat);
chatTriggerNav.addEventListener('click', (e) => {
    e.preventDefault();
    openChat();
});
chatClose.addEventListener('click', closeChat);
chatBack.addEventListener('click', closeChat);
chatOverlay.addEventListener('click', closeChat);

// Auto-resize textarea
chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    
    // Toggle send button active state
    if (this.value.trim()) {
        chatSend.classList.add('active');
    } else {
        chatSend.classList.remove('active');
    }
});

// Send message
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatSend.classList.remove('active');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get AI response
    getAIResponse(message);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Quick question buttons
quickQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
        const question = btn.textContent;
        chatInput.value = question;
        chatInput.style.height = 'auto';
        chatInput.style.height = (chatInput.scrollHeight) + 'px';
        chatSend.classList.add('active');
        chatInput.focus();
    });
});

// Add message to chat
function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (type === 'ai') {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    } else {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Support markdown-like formatting
    const formattedContent = formatMessage(content);
    messageContent.innerHTML = formattedContent;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Format message content (simple markdown support)
function formatMessage(text) {
    // Convert line breaks
    text = text.replace(/\n/g, '<br>');
    
    // Convert bullet points
    text = text.replace(/^•\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Convert bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Convert code blocks
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    return text;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';
    
    const dots = document.createElement('div');
    dots.className = 'message-content';
    dots.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(dots);
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ============================================
// AI Response Logic
// ============================================

// Knowledge base about the person
const knowledgeBase = {
    name: "Qiming Liu / Kiren",
    profession: "Data Analyst",
    location: "Springfield, MO",
    email: "liuqm110@gmail.com",
    phone: "+1 417 234 8164",
    github: "github.com/Kiren-67m",
    linkedin: "linkedin.com/in/qiming-liu-845ba92a0",
    education: "Missouri State University",
    skills: {
        programming: ["SQL (Advanced)", "Python (Intermediate)", "JavaScript (Intermediate)"],
        tools: ["Excel (Advanced)", "Power BI (Intermediate)", "IBM Cognos Analytics (Intermediate)", "RStudio (Intermediate)", "Automation Tools (Intermediate)"]
    },
    experience: [
        {
            title: "Intern, Front Office Operations / Customer Service",
            company: "Chaoyang Bank, Lingyuan Branch",
            period: "Feb 2025 – Mar 2025",
            description: "Assisted 50+ customers per day with routine inquiries, verified customer documentation with 100% accuracy, improved lobby workflow efficiency by reducing wait times by 15%"
        }
    ],
    projects: [
        {
            name: "Retail Sales SQL Analysis",
            description: "Holiday and promotion SQL analysis for Walmart-style retail data, focusing on revenue uplift patterns.",
            tech: ["SQL", "MySQL", "Retail Analytics"]
        },
        {
            name: "Automated Ops Monitoring Pipeline",
            description: "Python + n8n data pipeline that produces daily KPIs and anomaly flags for operational monitoring.",
            tech: ["Python", "n8n", "ETL", "Google Sheets"]
        },
        {
            name: "BLACKPINK Global Spotify Diffusion",
            description: "ERR-6 early-retention metric and Streamlit dashboard for global Spotify release diffusion analysis.",
            tech: ["Python", "Streamlit", "Spotify Data"]
        }
    ]
};

// Get AI response based on user query
async function getAIResponse(userMessage) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    removeTypingIndicator();
    
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    
    // Intent detection and response generation
    if (lowerMessage.includes('技能') || lowerMessage.includes('技术') || lowerMessage.includes('skill') || lowerMessage.includes('tech')) {
        response = `Here are the main skills I use:\n\n<strong>Programming & Data:</strong>\n• SQL (Advanced)\n• Python (Intermediate)\n• JavaScript (Intermediate)\n\n<strong>Analytics & BI Tools:</strong>\n• Excel (Advanced)\n• Power BI (Intermediate)\n• IBM Cognos Analytics (Intermediate)\n• RStudio (Intermediate)\n• Automation Tools (Intermediate)\n\nI'm studying Data Analytics at Missouri State University and building these skills through hands-on projects.`;
    } 
    else if (lowerMessage.includes('经验') || lowerMessage.includes('工作') || lowerMessage.includes('experience') || lowerMessage.includes('work')) {
        response = `Here is my work experience:\n\n${knowledgeBase.experience.map(exp => 
            `<strong>${exp.title}</strong> @ ${exp.company}\n${exp.period}\n${exp.description}`
        ).join('\n\n')}\n\nYou can ask me for more details about specific responsibilities or outcomes.`;
    }
    else if (lowerMessage.includes('项目') || lowerMessage.includes('project') || lowerMessage.includes('作品')) {
        response = `Here are some of my key projects:\n\n${knowledgeBase.projects.map(proj => 
            `<strong>${proj.name}</strong>\n${proj.description}\nTech stack: ${proj.tech.join(', ')}`
        ).join('\n\n')}\n\nFeel free to ask about any project you're most interested in.`;
    }
    else if (lowerMessage.includes('联系') || lowerMessage.includes('contact') || lowerMessage.includes('邮箱') || lowerMessage.includes('email')) {
        response = `I'd be happy to connect!\n\n<strong>Contact details:</strong>\n• 📧 Email: ${knowledgeBase.email}\n• 📱 Phone: ${knowledgeBase.phone}\n• 💼 LinkedIn: ${knowledgeBase.linkedin}\n• 💻 GitHub: ${knowledgeBase.github}\n\nYou can also use the contact icons at the bottom of this site.`;
    }
    else if (lowerMessage.includes('教育') || lowerMessage.includes('education') || lowerMessage.includes('背景') || lowerMessage.includes('background')) {
        response = `I'm a ${knowledgeBase.profession} student at ${knowledgeBase.education}, based in ${knowledgeBase.location}.\n\nI focus on building practical systems that support real operational and decision-making needs. I learn through iterative problem-solving and improving solutions based on real-world feedback.\n\nI'm currently looking for internship opportunities where continuous learning, execution, and system improvement are important.`;
    }
    else if (lowerMessage.includes('名字') || lowerMessage.includes('name') || lowerMessage.includes('who')) {
        response = `Hi! I'm ${knowledgeBase.name}, a ${knowledgeBase.profession} student.\n\nI'm studying Data Analytics at ${knowledgeBase.education} and love building practical, data-driven systems. You can ask me about my skills, experience, or projects.`;
    }
    else if (lowerMessage.includes('你好') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = `Hi there! 👋 Great to meet you.\n\nI'm an AI assistant that knows about ${knowledgeBase.name}. I can tell you about:\n• Work experience and projects\n• Technical skills and tools\n• Education and background\n• How to contact me\n\nWhat would you like to know?`;
    }
    else {
        response = `Thanks for your question about "${userMessage}".\n\nYou can ask me things like:\n• \"What are your main skills?\"\n• \"Tell me about your work experience.\"\n• \"What projects have you done?\"\n• \"How can I contact you?\"\n\nOr just ask anything you're curious about related to my background.`;
    }
    
    addMessage(response, 'ai');
}

// ============================================
// Copy to clipboard functionality
// ============================================

document.querySelectorAll('.info-card').forEach(card => {
    card.addEventListener('click', function() {
        const text = this.querySelector('span, a')?.textContent || '';
        if (text && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                // Show feedback
                const originalBg = this.style.background;
                this.style.background = '#e8f5e9';
                setTimeout(() => {
                    this.style.background = originalBg;
                }, 500);
            });
        }
    });
});

// ============================================
// Initialize
// ============================================

// Set initial scroll progress
updateScrollProgress();

// Add stagger animation delay to hero elements and init sliders
document.addEventListener('DOMContentLoaded', () => {
    // Hero animations are handled by animate.css classes

    // Photo slider in hero section
    const photoSlides = document.querySelectorAll('.photo-slide');
    const prevBtn = document.getElementById('photoPrev');
    const nextBtn = document.getElementById('photoNext');
    let currentSlide = 0;

    function showSlide(index) {
        if (!photoSlides.length) return;
        photoSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    if (photoSlides.length && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + photoSlides.length) % photoSlides.length;
            showSlide(currentSlide);
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % photoSlides.length;
            showSlide(currentSlide);
        });
    }
});
