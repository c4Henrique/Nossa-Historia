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

    // Adicionar event listener para os botões de exclusão usando delegação de eventos
    datesList.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const index = parseInt(target.getAttribute('data-index'));
        
        if (target.classList.contains('delete-idea')) {
            if (confirm('Tem certeza que deseja excluir esta data especial?')) {
                deleteDateIdea(index);
            }
        } else if (target.classList.contains('complete-date')) {
            toggleDateCompletion(index);
        }
    });
});

// Carregar ideias do localStorage
function loadDateIdeas() {
    const datesList = document.getElementById('dates-list');
    const ideas = JSON.parse(localStorage.getItem('dateIdeas')) || [];
    const completedDates = JSON.parse(localStorage.getItem('completedDates')) || [];

    datesList.innerHTML = ideas.map((idea, index) => `
        <div class="date-idea ${completedDates.includes(index) ? 'completed' : ''}" data-index="${index}">
            <p>${idea}</p>
            <div class="date-actions">
                <button class="complete-date" data-index="${index}" title="Marcar como realizado">
                    <i class="fas ${completedDates.includes(index) ? 'fa-check-circle' : 'fa-circle'}"></i>
                </button>
                <button class="delete-idea" data-index="${index}" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Adicionar event listeners para os botões
    datesList.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const index = parseInt(target.getAttribute('data-index'));
        
        if (target.classList.contains('delete-idea')) {
            if (confirm('Tem certeza que deseja excluir esta data especial?')) {
                deleteDateIdea(index);
            }
        } else if (target.classList.contains('complete-date')) {
            toggleDateCompletion(index);
        }
    });
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

// Função para alternar o estado de conclusão da data
function toggleDateCompletion(index) {
    const completedDates = JSON.parse(localStorage.getItem('completedDates')) || [];
    const dateIdea = document.querySelector(`.date-idea[data-index="${index}"]`);
    const completeButton = dateIdea.querySelector('.complete-date i');
    
    if (completedDates.includes(index)) {
        // Remover da lista de concluídos
        const newCompletedDates = completedDates.filter(i => i !== index);
        localStorage.setItem('completedDates', JSON.stringify(newCompletedDates));
        dateIdea.classList.remove('completed');
        completeButton.classList.remove('fa-check-circle');
        completeButton.classList.add('fa-circle');
    } else {
        // Adicionar à lista de concluídos
        completedDates.push(index);
        localStorage.setItem('completedDates', JSON.stringify(completedDates));
        dateIdea.classList.add('completed');
        completeButton.classList.remove('fa-circle');
        completeButton.classList.add('fa-check-circle');
    }
} 