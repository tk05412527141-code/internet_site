document.addEventListener('DOMContentLoaded', () => {

    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const form = document.getElementById('add-article-form');
    const statusMessage = document.getElementById('status-message');

    // Function to load and display articles
    async function loadArticles() {
        const listSection = document.getElementById('article-list-section');
        const listContainer = document.getElementById('article-list');

        listSection.style.display = 'block';
        listContainer.innerHTML = '<p>Yükleniyor...</p>';

        try {
            const response = await fetch('/api/articles');
            const articles = await response.json();

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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;

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
            content,
            password: 'admin123' // Send password for server verification
        };

        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });

            if (response.ok) {
                statusMessage.textContent = 'Makale başarıyla eklendi!';
                statusMessage.style.color = 'green';
                form.reset();
                quill.setContents([]); // Clear editor
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
