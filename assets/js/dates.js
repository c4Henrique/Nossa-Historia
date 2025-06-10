// Gerenciamento de ideias de dates
document.addEventListener('DOMContentLoaded', () => {
    const datesList = document.getElementById('dates-list');
    const newDateInput = document.getElementById('new-date-idea');
    const saveButton = document.getElementById('save-date-idea');

    // Carregar ideias salvas
    loadDateIdeas();

    // Adicionar nova ideia
    saveButton.addEventListener('click', () => {
        const idea = newDateInput.value.trim();
        if (idea) {
            saveDateIdea(idea);
            newDateInput.value = '';
        }
    });

    // Salvar ao pressionar Enter
    newDateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveButton.click();
        }
    });
});

// Carregar ideias do localStorage
function loadDateIdeas() {
    const datesList = document.getElementById('dates-list');
    const ideas = JSON.parse(localStorage.getItem('dateIdeas')) || [];

    datesList.innerHTML = ideas.map((idea, index) => `
        <div class="date-idea" data-index="${index}">
            <p>${idea}</p>
            <button class="delete-idea" onclick="deleteDateIdea(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Salvar nova ideia
function saveDateIdea(idea) {
    const ideas = JSON.parse(localStorage.getItem('dateIdeas')) || [];
    ideas.push(idea);
    localStorage.setItem('dateIdeas', JSON.stringify(ideas));
    loadDateIdeas();
}

// Deletar ideia
function deleteDateIdea(index) {
    const ideas = JSON.parse(localStorage.getItem('dateIdeas')) || [];
    ideas.splice(index, 1);
    localStorage.setItem('dateIdeas', JSON.stringify(ideas));
    loadDateIdeas();
} 