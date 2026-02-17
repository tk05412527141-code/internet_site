const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.quilljs.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.quilljs.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://i.ibb.co"],
            connectSrc: ["'self'"],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    },
}));

// HTTP to HTTPS Redirect (Production Only)
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints
const fs = require('fs');
const articlesFilePath = path.join(__dirname, 'data', 'articles.json');
const contactsFilePath = path.join(__dirname, 'data', 'contacts.json');
const commentsFilePath = path.join(__dirname, 'data', 'comments.json');

// GET all articles
app.get('/api/articles', (req, res) => {
    fs.readFile(articlesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Veri okunamadı' });
        }
        res.json(JSON.parse(data));
    });
});

// POST new article (Simple Auth)
app.post('/api/articles', (req, res) => {
    const { title, date, content, password, category } = req.body;

    // Simple password check
    if (password !== 'admin123') {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }

    if (!title || !content) {
        return res.status(400).json({ error: 'Başlık ve içerik zorunludur' });
    }

    fs.readFile(articlesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Veri okunamadı' });
        }

        const articles = JSON.parse(data);
        const newId = 'article-' + Date.now(); // Simple ID generation

        articles[newId] = {
            title,
            date: date || new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
            category: category || 'Genel',
            content
        };

        fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 4), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Veri kaydedilemedi' });
            }
            res.status(201).json({ message: 'Makale eklendi', id: newId });
        });
    });
});

// DELETE article
app.delete('/api/articles/:id', (req, res) => {
    const articleId = req.params.id;
    // In a real app, we should authenticate here too. 
    // For simplicity, we'll assume the client sends the password in headers or body, 
    // but standard DELETE doesn't always have a body. 
    // Let's use a query param or header for simple auth since we are using simple password auth.
    // Or just check if the user is authorized (session based). 
    // Given the current simple architecture, let's look for an Authorization header or similar.
    // For now, let's keep it open or require a specific header.
    const password = req.headers['x-admin-password'];

    if (password !== 'admin123') {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }

    fs.readFile(articlesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Veri okunamadı' });
        }

        let articles = JSON.parse(data);
        if (!articles[articleId]) {
            return res.status(404).json({ error: 'Makale bulunamadı' });
        }

        delete articles[articleId];

        fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 4), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Veri kaydedilemedi' });
            }
            res.json({ message: 'Makale silindi' });
        });
    });
});

// PUT update article
app.put('/api/articles/:id', (req, res) => {
    const articleId = req.params.id;
    const { title, content, category, password } = req.body;

    if (password !== 'admin123') {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }

    if (!title || !content) {
        return res.status(400).json({ error: 'Başlık ve içerik zorunludur' });
    }

    fs.readFile(articlesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Veri okunamadı' });
        }

        let articles = JSON.parse(data);
        if (!articles[articleId]) {
            return res.status(404).json({ error: 'Makale bulunamadı' });
        }

        articles[articleId] = {
            ...articles[articleId],
            title,
            content,
            category: category || articles[articleId].category || 'Genel'
        };

        fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 4), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Veri kaydedilemedi' });
            }
            res.json({ message: 'Makale güncellendi', article: articles[articleId] });
        });
    });
});

// POST contact form
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Lütfen tüm zorunlu alanları doldurun.' });
    }

    fs.readFile(contactsFilePath, 'utf8', (err, data) => {
        let contacts = [];
        if (!err && data) {
            try {
                contacts = JSON.parse(data);
            } catch (e) {
                contacts = [];
            }
        }

        const newContact = {
            id: Date.now(),
            date: new Date().toISOString(),
            name,
            email,
            subject,
            message
        };

        contacts.push(newContact);

        fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 4), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Mesajınız kaydedilemedi.' });
            }
            res.status(201).json({ message: 'Mesajınız başarıyla alındı.' });
        });
    });
});

// GET comments for an article
app.get('/api/articles/:id/comments', (req, res) => {
    const articleId = req.params.id;
    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error(err);
            return res.status(500).json({ error: 'Yorumlar okunamadı' });
        }

        const commentsData = data ? JSON.parse(data) : {};
        const articleComments = commentsData[articleId] || [];
        res.json(articleComments);
    });
});

// POST comment
app.post('/api/articles/:id/comments', (req, res) => {
    const articleId = req.params.id;
    const { name, text } = req.body;

    if (!name || !text) {
        return res.status(400).json({ error: 'İsim ve yorum zorunludur' });
    }

    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        let commentsData = {};
        if (!err && data) {
            try {
                commentsData = JSON.parse(data);
            } catch (e) {
                commentsData = {};
            }
        }

        if (!commentsData[articleId]) {
            commentsData[articleId] = [];
        }

        const newComment = {
            id: Date.now(),
            date: new Date().toLocaleDateString('tr-TR'),
            name,
            text
        };

        commentsData[articleId].push(newComment);

        fs.writeFile(commentsFilePath, JSON.stringify(commentsData, null, 4), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Yorum kaydedilemedi' });
            }
            res.status(201).json(newComment);
        });
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send('<h1>404 - Sayfa Bulunamadı</h1><p>Aradığınız sayfa mevcut değil. <a href="/">Ana Sayfaya Dön</a></p>');
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
