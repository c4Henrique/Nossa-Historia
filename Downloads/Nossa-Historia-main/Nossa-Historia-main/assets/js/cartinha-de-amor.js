document.addEventListener('DOMContentLoaded', () => {
    const loveLettersContainer = document.getElementById('loveLettersContainer');
    const openNewLetterModalButton = document.getElementById('openNewLetterModal');
    const newLetterModal = document.getElementById('newLetterModal');
    const closeNewLetterModal = document.getElementById('closeNewLetterModal');
    const saveNewLetterButton = document.getElementById('saveNewLetterButton');
    const newLetterTitleInput = document.getElementById('newLetterTitle');
    const newLetterContentInput = document.getElementById('newLetterContent');

    let loveLetters = JSON.parse(localStorage.getItem('loveLetters')) || [];

    function renderLoveLetters() {
        loveLettersContainer.innerHTML = '';
        loveLetters.forEach((letter, index) => {
            const letterCard = document.createElement('div');
            letterCard.className = 'love-letter-card card';
            letterCard.setAttribute('data-id', letter.id);
            letterCard.innerHTML = `
                <h3>${letter.title}</h3>
                <p>${letter.content}</p>
                <button class="delete-letter-button"><i class="fas fa-times"></i></button>
            `;
            loveLettersContainer.prepend(letterCard); // Adiciona no topo

            // Forçar reflow para a animação de fade-in
            void letterCard.offsetWidth;
            letterCard.classList.add('show');
        });
    }

    function saveLoveLetters() {
        localStorage.setItem('loveLetters', JSON.stringify(loveLetters));
    }

    function addNewLetter(title, content) {
        const newLetter = {
            id: Date.now(),
            title: title,
            content: content
        };
        loveLetters.unshift(newLetter); // Adiciona no início do array
        saveLoveLetters();
        renderLoveLetters();
    }

    function deleteLoveLetter(id) {
        loveLetters = loveLetters.filter(letter => letter.id !== id);
        saveLoveLetters();
        renderLoveLetters();
    }

    // Event Listeners
    openNewLetterModalButton.addEventListener('click', () => {
        newLetterModal.classList.add('show');
    });

    closeNewLetterModal.addEventListener('click', () => {
        newLetterModal.classList.remove('show');
        newLetterTitleInput.value = '';
        newLetterContentInput.value = '';
    });

    newLetterModal.addEventListener('click', (event) => {
        if (event.target === newLetterModal) {
            newLetterModal.classList.remove('show');
            newLetterTitleInput.value = '';
            newLetterContentInput.value = '';
        }
    });

    saveNewLetterButton.addEventListener('click', () => {
        const title = newLetterTitleInput.value.trim();
        const content = newLetterContentInput.value.trim();

        if (title && content) {
            addNewLetter(title, content);
            newLetterModal.classList.remove('show');
            newLetterTitleInput.value = '';
            newLetterContentInput.value = '';
        } else {
            alert('Por favor, preencha o título e o conteúdo da carta.');
        }
    });

    loveLettersContainer.addEventListener('click', (event) => {
        if (event.target.closest('.delete-letter-button')) {
            const letterCard = event.target.closest('.love-letter-card');
            const letterId = parseInt(letterCard.getAttribute('data-id'));
            if (confirm('Tem certeza que deseja excluir esta carta de amor?')) {
                deleteLoveLetter(letterId);
            }
        }
    });

    // Renderiza as cartas ao carregar a página
    renderLoveLetters();
}); 