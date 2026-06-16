// App State
let projects = [];
let currentProject = null;
let editingProjectId = null;
let connectMode = false;
let selectedNote = null;
let noteCounter = 0;

// DOM Elements
const dashboard = document.getElementById('dashboard');
const whiteboard = document.getElementById('whiteboard');
const projectsGrid = document.getElementById('projectsGrid');
const emptyState = document.getElementById('emptyState');
const projectModal = document.getElementById('projectModal');
const projectForm = document.getElementById('projectForm');
const projectNameInput = document.getElementById('projectName');
const projectDescriptionInput = document.getElementById('projectDescription');
const modalTitle = document.getElementById('modalTitle');
const canvas = document.getElementById('canvas');
const projectTitle = document.getElementById('projectTitle');

// Initialize
function init() {
    loadProjects();
    renderProjects();
    setupEventListeners();
}

// Load projects from localStorage
function loadProjects() {
    const stored = localStorage.getItem('projectBoardProjects');
    if (stored) {
        projects = JSON.parse(stored);
    }
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('projectBoardProjects', JSON.stringify(projects));
}

// Render projects grid
function renderProjects() {
    projectsGrid.innerHTML = '';
    
    if (projects.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${escapeHtml(project.name)}</h3>
            <p>${escapeHtml(project.description || 'No description')}</p>
            <button class="edit-btn" data-id="${project.id}">✏️ Edit</button>
        `;
        
        // Click on card to open project
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('edit-btn')) {
                openProject(project.id);
            }
        });
        
        // Edit button
        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editProject(project.id);
        });
        
        projectsGrid.appendChild(card);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup event listeners
function setupEventListeners() {
    // New project button
    document.getElementById('newProjectBtn').addEventListener('click', () => {
        showCreateModal();
    });
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', closeWhiteboard);
    
    // Add note button
    document.getElementById('addNoteBtn').addEventListener('click', addNote);
    
    // Add image button
    document.getElementById('addImageBtn').addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });
    
    // Image input
    document.getElementById('imageInput').addEventListener('change', handleImageUpload);
    
    // Connect mode button
    document.getElementById('connectModeBtn').addEventListener('click', toggleConnectMode);
    
    // Modal cancel
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    
    // Project form submit
    projectForm.addEventListener('submit', handleProjectSubmit);
    
    // Close modal on outside click
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });
    
    // Canvas click for connections
    canvas.addEventListener('click', handleCanvasClick);
}

// Show create project modal
function showCreateModal() {
    editingProjectId = null;
    modalTitle.textContent = 'Create New Project';
    projectNameInput.value = '';
    projectDescriptionInput.value = '';
    projectModal.classList.add('active');
    projectNameInput.focus();
}

// Show edit project modal
function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    editingProjectId = id;
    modalTitle.textContent = 'Edit Project';
    projectNameInput.value = project.name;
    projectDescriptionInput.value = project.description || '';
    projectModal.classList.add('active');
    projectNameInput.focus();
}

// Close modal
function closeModal() {
    projectModal.classList.remove('active');
}

// Handle project form submit
function handleProjectSubmit(e) {
    e.preventDefault();
    
    const name = projectNameInput.value.trim();
    const description = projectDescriptionInput.value.trim();
    
    if (!name) return;
    
    if (editingProjectId) {
        // Update existing project
        const project = projects.find(p => p.id === editingProjectId);
        if (project) {
            project.name = name;
            project.description = description;
        }
    } else {
        // Create new project
        const newProject = {
            id: Date.now(),
            name: name,
            description: description,
            notes: [],
            connections: []
        };
        projects.push(newProject);
    }
    
    saveProjects();
    renderProjects();
    closeModal();
}

// Open project whiteboard
function openProject(id) {
    currentProject = projects.find(p => p.id === id);
    if (!currentProject) return;
    
    projectTitle.textContent = currentProject.name;
    dashboard.classList.remove('active');
    whiteboard.classList.add('active');
    
    renderCanvas();
}

// Close whiteboard
function closeWhiteboard() {
    saveCurrentProject();
    currentProject = null;
    whiteboard.classList.remove('active');
    dashboard.classList.add('active');
    renderProjects();
}

// Render canvas with notes and connections
function renderCanvas() {
    canvas.innerHTML = '';
    
    if (!currentProject) return;
    
    // Add SVG for connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('connections-svg');
    canvas.appendChild(svg);
    
    // Draw connections
    currentProject.connections.forEach(conn => {
        drawConnection(svg, conn.from, conn.to);
    });
    
    // Render notes
    currentProject.notes.forEach(note => {
        renderNote(note);
    });
}

// Render a single note
function renderNote(noteData) {
    const note = document.createElement('div');
    note.className = 'note';
    note.dataset.id = noteData.id;
    note.style.left = noteData.x + 'px';
    note.style.top = noteData.y + 'px';
    if (noteData.color) {
        note.style.background = noteData.color;
    }
    
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Write your note...';
    textarea.value = noteData.text || '';
    textarea.addEventListener('input', () => {
        noteData.text = textarea.value;
        saveCurrentProject();
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'note-delete';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteNote(noteData.id);
    });
    
    note.appendChild(deleteBtn);
    note.appendChild(textarea);
    
    // Add image if exists
    if (noteData.image) {
        const img = document.createElement('img');
        img.src = noteData.image;
        note.appendChild(img);
    }
    
    // Make draggable
    makeDraggable(note, noteData);
    
    // Select on click
    note.addEventListener('click', (e) => {
        e.stopPropagation();
        selectNote(note, noteData);
    });
    
    canvas.appendChild(note);
}

// Make note draggable
function makeDraggable(element, noteData) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    element.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.classList.contains('note-delete')) {
            return;
        }
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = noteData.x;
        initialY = noteData.y;
        
        element.style.zIndex = 100;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        noteData.x = initialX + dx;
        noteData.y = initialY + dy;
        
        element.style.left = noteData.x + 'px';
        element.style.top = noteData.y + 'px';
        
        // Redraw connections
        renderCanvas();
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.zIndex = '';
            saveCurrentProject();
        }
    });
}

// Select note for connection
function selectNote(element, noteData) {
    if (!connectMode) return;
    
    // Remove previous selection
    document.querySelectorAll('.note.selected').forEach(n => n.classList.remove('selected'));
    
    if (selectedNote && selectedNote !== noteData) {
        // Create connection
        currentProject.connections.push({
            from: selectedNote.id,
            to: noteData.id
        });
        saveCurrentProject();
        renderCanvas();
        selectedNote = null;
        toggleConnectMode(); // Turn off connect mode
    } else {
        selectedNote = noteData;
        element.classList.add('selected');
    }
}

// Delete note
function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    
    currentProject.notes = currentProject.notes.filter(n => n.id !== id);
    currentProject.connections = currentProject.connections.filter(
        c => c.from !== id && c.to !== id
    );
    
    saveCurrentProject();
    renderCanvas();
}

// Add new note
function addNote() {
    const noteData = {
        id: 'note_' + Date.now() + '_' + noteCounter++,
        x: 50 + Math.random() * 100,
        y: 50 + Math.random() * 100,
        text: '',
        color: '#ffeb3b'
    };
    
    currentProject.notes.push(noteData);
    saveCurrentProject();
    renderNote(noteData);
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const noteData = {
            id: 'note_' + Date.now() + '_' + noteCounter++,
            x: 100 + Math.random() * 100,
            y: 100 + Math.random() * 100,
            text: '',
            image: event.target.result,
            color: '#fff9c4'
        };
        
        currentProject.notes.push(noteData);
        saveCurrentProject();
        renderNote(noteData);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
}

// Toggle connect mode
function toggleConnectMode() {
    connectMode = !connectMode;
    const btn = document.getElementById('connectModeBtn');
    
    if (connectMode) {
        btn.classList.add('active');
        btn.textContent = '✓ Select Notes';
        selectedNote = null;
    } else {
        btn.classList.remove('active');
        btn.textContent = '🔗 Connect';
        selectedNote = null;
        document.querySelectorAll('.note.selected').forEach(n => n.classList.remove('selected'));
    }
}

// Handle canvas click
function handleCanvasClick(e) {
    if (e.target === canvas || e.target.classList.contains('connections-svg')) {
        if (connectMode) {
            toggleConnectMode();
        }
    }
}

// Draw connection line
function drawConnection(svg, fromId, toId) {
    const fromNote = currentProject.notes.find(n => n.id === fromId);
    const toNote = currentProject.notes.find(n => n.id === toId);
    
    if (!fromNote || !toNote) return;
    
    const fromEl = canvas.querySelector(`.note[data-id="${fromId}"]`);
    const toEl = canvas.querySelector(`.note[data-id="${toId}"]`);
    
    if (!fromEl || !toEl) return;
    
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    
    const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - canvasRect.top;
    const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
    const y2 = toRect.top + toRect.height / 2 - canvasRect.top;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.classList.add('connection-line');
    
    svg.appendChild(line);
}

// Save current project
function saveCurrentProject() {
    if (!currentProject) return;
    
    const index = projects.findIndex(p => p.id === currentProject.id);
    if (index !== -1) {
        projects[index] = currentProject;
        saveProjects();
    }
}

// Start the app
init();
