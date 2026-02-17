document.addEventListener('DOMContentLoaded', () => {

    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const form = document.getElementById('add-article-form');
    const statusMessage = document.getElementById('status-message');

    let currentEditingId = null; // Track if we are editing

    // Function to load and display articles
    async function loadArticles() {
        const listSection = document.getElementById('article-list-section');
        const listContainer = document.getElementById('article-list');

        listSection.style.display = 'block';
        listContainer.innerHTML = '<p>Yükleniyor...</p>';

        try {
            const response = await fetch('/api/articles');
            const articles = await response.json();
            window.currentArticles = articles; // Store for edit

            listContainer.innerHTML = '';

            const articleIds = Object.keys(articles).reverse(); // Newest first

            if (articleIds.length === 0) {
                listContainer.innerHTML = '<p>Henüz makale bulunmamaktadır.</p>';
                return;
            }

            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';

            // Header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background: #f8f9fa; text-align: left;">
                    <th style="padding: 0.75rem; border-bottom: 2px solid #dee2e6;">Tarih</th>
                    <th style="padding: 0.75rem; border-bottom: 2px solid #dee2e6;">Başlık</th>
                    <th style="padding: 0.75rem; border-bottom: 2px solid #dee2e6; text-align: right;">İşlem</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');

            articleIds.forEach(id => {
                const article = articles[id];
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #dee2e6';

                tr.innerHTML = `
                    <td style="padding: 0.75rem;">${article.date}</td>
                    <td style="padding: 0.75rem;"><strong>${article.title}</strong></td>
                    <td style="padding: 0.75rem; text-align: right;">
                        <button class="edit-btn" data-id="${id}" style="background: #ffc107; color: black; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; margin-right: 5px;">Düzenle</button>
                        <button class="delete-btn" data-id="${id}" style="background: #dc3545; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer;">Sil</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            listContainer.appendChild(table);

            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Bu makaleyi silmek istediğinize emin misiniz?')) {
                        try {
                            const delResponse = await fetch(`/api/articles/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'x-admin-password': 'admin123'
                                }
                            });

                            if (delResponse.ok) {
                                alert('Makale silindi.');
                                loadArticles(); // Refresh list
                            } else {
                                alert('Silme işlemi başarısız oldu.');
                            }
                        } catch (error) {
                            console.error('Error deleting:', error);
                            alert('Bir hata oluştu.');
                        }
                    }
                });
            });

            // Add event listeners to edit buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    editArticle(id);
                });
            });

        } catch (error) {
            console.error('Error loading articles:', error);
            listContainer.innerHTML = '<p>Makaleler yüklenirken hata oluştu.</p>';
        }
    }

    if (sessionStorage.getItem('isAdmin') === 'true') {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        loadArticles(); // Load articles on init if logged in
    }

    loginBtn.addEventListener('click', () => {
        const password = passwordInput.value;
        if (password === 'admin123') {
            loginSection.style.display = 'none';
            adminPanel.style.display = 'block';
            sessionStorage.setItem('isAdmin', 'true');
            loadArticles();
        } else {
            loginError.style.display = 'block';
        }
    });



    // Initialize Quill editor
    var quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Makale içeriğini buraya yazın...',
        modules: {
            toolbar: [
                [{ 'header': [2, 3, 4, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image']
            ]
        }
    });

    function editArticle(id) {
        const article = window.currentArticles[id];
        if (!article) return;

        document.getElementById('title').value = article.title;
        document.getElementById('date').value = article.date;
        document.getElementById('category').value = article.category || 'Genel';
        quill.root.innerHTML = article.content;

        currentEditingId = id;
        document.querySelector('#add-article-form button[type="submit"]').textContent = 'Makaleyi Güncelle';
        document.querySelector('h3').textContent = 'Makaleyi Düzenle';

        // Scroll to form
        document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;

        // Get HTML content from Quill
        const content = quill.root.innerHTML;

        // Check if content is empty (Quill leaves <p><br></p> when empty)
        if (quill.getText().trim().length === 0) {
            statusMessage.textContent = 'Lütfen makale içeriği giriniz.';
            statusMessage.style.color = 'red';
            return;
        }

        const articleData = {
            title,
            date,
            category,
            content,
            password: 'admin123' // Send password for server verification
        };

        try {
            let response;
            if (currentEditingId) {
                // Update existing
                response = await fetch(`/api/articles/${currentEditingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(articleData)
                });
            } else {
                // Create new
                response = await fetch('/api/articles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(articleData)
                });
            }

            if (response.ok) {
                statusMessage.textContent = currentEditingId ? 'Makale güncellendi!' : 'Makale başarıyla eklendi!';
                statusMessage.style.color = 'green';
                form.reset();
                quill.setContents([]); // Clear editor
                currentEditingId = null;
                document.querySelector('#add-article-form button[type="submit"]').textContent = 'Makaleyi Yayınla';
                document.querySelector('h3').textContent = 'Yeni Makale Ekle';
                loadArticles(); // Refresh list
            } else {
                statusMessage.textContent = 'Hata oluştu. Lütfen tekrar deneyin.';
                statusMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = 'Sunucu hatası.';
            statusMessage.style.color = 'red';
        }
    });
});
