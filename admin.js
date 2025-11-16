document.addEventListener('DOMContentLoaded', () => {
    const projectForm = document.getElementById('project-form');
    const projectList = document.getElementById('project-list');
    const formTitle = document.getElementById('form-title');
    const cancelEditButton = document.getElementById('cancel-edit');

    // Inputs
    const projectIdInput = document.getElementById('project-id');
    const titleInput = document.getElementById('project-title');
    const clientInput = document.getElementById('project-client');
    const categoryInput = document.getElementById('project-category');
    const descriptionInput = document.getElementById('project-description');
    const imagesInput = document.getElementById('project-images');
    const imagePreview = document.getElementById('image-preview');
    const videoIdInput = document.getElementById('project-videoId');

    let projects = [];
    let existingImageUrls = [];

    // Preview de imagens
    imagesInput.addEventListener('change', () => {
        imagePreview.innerHTML = '';
        Array.from(imagesInput.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    // Carrega projetos
    async function loadInitialProjects() {
        try {
            const response = await fetch(`portfolio.json?v=${Date.now()}`);
            if (!response.ok && response.status === 404) {
                projects = [];
                renderProjectList();
                return;
            }
            projects = await response.json();
            renderProjectList();
        } catch (error) {
            showNotification('Erro ao carregar projetos.', 'error');
        }
    }

    // Renderiza lista
    function renderProjectList() {
        projectList.innerHTML = projects.length === 0 ? '<p style="color: var(--text-light);">Nenhum projeto cadastrado.</p>' : '';
        projects.forEach((project, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'project-list-item';
            listItem.innerHTML = `
                <p><strong>${project.title}</strong><br><small>${project.imageUrls ? project.imageUrls.length : 0} imagem(ns)</small></p>
                <div class="actions">
                    <button class="btn btn-small btn-edit" data-index="${index}">Editar</button>
                    <button class="btn btn-small btn-delete" data-index="${index}">Excluir</button>
                </div>
            `;
            projectList.appendChild(listItem);
        });
        addEventListenersToButtons();
    }

    function addEventListenersToButtons() {
        document.querySelectorAll('.btn-delete').forEach(button => button.addEventListener('click', handleDelete));
        document.querySelectorAll('.btn-edit').forEach(button => button.addEventListener('click', handleEdit));
    }

    // Função para salvar todo o portfólio no servidor
    async function savePortfolioToServer() {
        showNotification('Salvando no servidor...', 'info');
        try {
            const response = await fetch('/save-portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: projects }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Erro desconhecido');
            showNotification('Portfólio salvo com sucesso!', 'success');
        } catch (error) {
            showNotification(`Erro ao salvar: ${error.message}`, 'error');
            if (error.message.includes('Sessão expirada')) {
                setTimeout(() => { window.location.href = '/login.html'; }, 2000);
            }
        }
    }

    async function handleDelete(event) {
        const index = event.target.dataset.index;
        if (confirm(`Tem certeza que deseja excluir o projeto "${projects[index].title}"? Esta ação é permanente.`)) {
            projects.splice(index, 1);
            renderProjectList();
            await savePortfolioToServer(); // Salva automaticamente
        }
    }

    function handleEdit(event) {
        const index = event.target.dataset.index;
        const project = projects[index];
        formTitle.textContent = 'Editar Projeto';
        projectIdInput.value = index;
        titleInput.value = project.title;
        clientInput.value = project.client;
        categoryInput.value = project.category;
        descriptionInput.value = project.description;
        videoIdInput.value = project.videoId || '';
        existingImageUrls = project.imageUrls || [];
        imagePreview.innerHTML = `<p style="color: var(--text-light);">${existingImageUrls.length} imagem(ns) existente(s). Para alterar, selecione novas imagens.</p>`;
        cancelEditButton.style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    projectForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = projectForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Processando...';
        submitButton.disabled = true;

        let uploadedImageUrls = [];

        if (imagesInput.files.length > 0) {
            const formData = new FormData();
            for (const file of imagesInput.files) {
                formData.append('images', file);
            }
            try {
                showNotification('Enviando imagens...', 'info');
                const response = await fetch('/upload-images', { method: 'POST', body: formData });
                const result = await response.json();
                if (!result.success) throw new Error(result.message);
                uploadedImageUrls = result.urls;
            } catch (error) {
                showNotification(`Erro no upload: ${error.message}`, 'error');
                if (error.message.includes('Sessão expirada')) {
                    setTimeout(() => { window.location.href = '/login.html'; }, 2000);
                }
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                return;
            }
        } else {
            uploadedImageUrls = existingImageUrls;
        }

        const projectData = {
            title: titleInput.value, client: clientInput.value,
            category: categoryInput.value, description: descriptionInput.value,
            imageUrls: uploadedImageUrls, videoId: videoIdInput.value,
        };

        const id = projectIdInput.value;
        if (id) {
            projects[id] = { ...projects[id], ...projectData };
        } else {
            if (imagesInput.files.length === 0) {
                showNotification('Para um novo projeto, você deve selecionar ao menos uma imagem.', 'error');
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                return;
            }
            projectData.id = Date.now();
            projects.unshift(projectData);
        }

        renderProjectList();
        resetForm();
        await savePortfolioToServer(); // Salva automaticamente

        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    });

    function resetForm() {
        projectForm.reset();
        projectIdInput.value = '';
        imagePreview.innerHTML = '';
        existingImageUrls = [];
        formTitle.textContent = 'Adicionar Novo Projeto';
        cancelEditButton.style.display = 'none';
    }

    cancelEditButton.addEventListener('click', resetForm);

    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed', top: '20px', right: '20px', padding: '1rem 1.5rem',
            borderRadius: '8px', color: 'white',
            backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: '10001',
            transform: 'translateX(120%)', transition: 'transform 0.5s ease-in-out',
        });
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    loadInitialProjects();
});
