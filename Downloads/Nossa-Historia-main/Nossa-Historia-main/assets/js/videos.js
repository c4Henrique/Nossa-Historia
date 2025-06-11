document.addEventListener('DOMContentLoaded', () => {
    const videoCarousel = document.getElementById('videoCarousel');
    const prevVideoBtn = document.getElementById('prevVideo');
    const nextVideoBtn = document.getElementById('nextVideo');
    const openNewVideoModalBtn = document.getElementById('openNewVideoModal');
    const newVideoModal = document.getElementById('newVideoModal');
    const closeNewVideoModalBtn = document.getElementById('closeNewVideoModal');
    const cancelNewVideoBtn = document.getElementById('cancelNewVideo');
    const saveNewVideoBtn = document.getElementById('saveNewVideo');
    const videoTitleInput = document.getElementById('videoTitle');
    const videoUrlInput = document.getElementById('videoUrl');
    const videoLocalPathInput = document.getElementById('videoLocalPath');
    const videoTypeUrlRadio = document.getElementById('videoTypeUrl');
    const videoTypeLocalRadio = document.getElementById('videoTypeLocal');
    const videoUrlGroup = document.getElementById('videoUrlGroup');
    const videoLocalPathGroup = document.getElementById('videoLocalPathGroup');

    let videos = JSON.parse(localStorage.getItem('videos')) || [
        { id: 'v3', title: 'Nosso Vídeo Especial', type: 'local', src: 'assets/img/galeria/v3.mp4' } // Vídeo local v3.mp4
    ];
    let currentVideoIndex = 0;

    function renderVideos() {
        videoCarousel.innerHTML = '';
        if (videos.length === 0) {
            videoCarousel.innerHTML = '<p>Nenhum vídeo adicionado ainda. Adicione o primeiro!</p>';
            return;
        }

        const video = videos[currentVideoIndex];
        const videoElement = document.createElement('div');
        videoElement.className = 'video-item fade-in';

        let videoContent;
        if (video.type === 'local') {
            videoContent = `
                <video controls>
                    <source src="${video.src}" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            `;
        } else {
            videoContent = `
                <iframe src="${video.src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        }

        videoElement.innerHTML = `
            <h3>${video.title}</h3>
            <div class="video-wrapper">
                ${videoContent}
            </div>
            <button class="delete-video-button" data-id="${video.id}" title="Excluir Vídeo"><i class="fas fa-trash"></i></button>
        `;
        videoCarousel.appendChild(videoElement);

        // Adicionar event listener para o botão de exclusão
        videoElement.querySelector('.delete-video-button').addEventListener('click', (e) => {
            const videoIdToDelete = e.currentTarget.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este vídeo?')) {
                deleteVideo(videoIdToDelete);
            }
        });
    }

    function showNextVideo() {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        renderVideos();
    }

    function showPrevVideo() {
        currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
        renderVideos();
    }

    function deleteVideo(id) {
        videos = videos.filter(video => video.id !== id);
        localStorage.setItem('videos', JSON.stringify(videos));
        currentVideoIndex = 0; // Resetar para o primeiro vídeo após exclusão
        renderVideos();
    }

    function addVideo(title, src, type) {
        const newVideo = { id: `v${Date.now()}`, title, type, src };
        videos.push(newVideo);
        localStorage.setItem('videos', JSON.stringify(videos));
        currentVideoIndex = videos.length - 1; // Ir para o último vídeo adicionado
        renderVideos();
    }

    // Event Listeners do Modal
    openNewVideoModalBtn.addEventListener('click', () => {
        newVideoModal.style.display = 'flex'; // Usar flex para centralizar
    });

    closeNewVideoModalBtn.addEventListener('click', () => {
        newVideoModal.style.display = 'none';
        videoTitleInput.value = '';
        videoUrlInput.value = '';
        videoLocalPathInput.value = '';
        videoTypeUrlRadio.checked = true; // Resetar para URL
        videoUrlGroup.style.display = 'block';
        videoLocalPathGroup.style.display = 'none';
    });

    cancelNewVideoBtn.addEventListener('click', () => {
        newVideoModal.style.display = 'none';
        videoTitleInput.value = '';
        videoUrlInput.value = '';
        videoLocalPathInput.value = '';
        videoTypeUrlRadio.checked = true; // Resetar para URL
        videoUrlGroup.style.display = 'block';
        videoLocalPathGroup.style.display = 'none';
    });

    saveNewVideoBtn.addEventListener('click', () => {
        const title = videoTitleInput.value.trim();
        let src;
        let type;

        if (videoTypeUrlRadio.checked) {
            src = videoUrlInput.value.trim();
            type = 'url';
        } else {
            src = videoLocalPathInput.value.trim();
            type = 'local';
        }

        if (title && src) {
            addVideo(title, src, type);
            newVideoModal.style.display = 'none';
            videoTitleInput.value = '';
            videoUrlInput.value = '';
            videoLocalPathInput.value = '';
            videoTypeUrlRadio.checked = true; // Resetar para URL
            videoUrlGroup.style.display = 'block';
            videoLocalPathGroup.style.display = 'none';
        } else {
            alert('Por favor, preencha o título e o link/caminho do vídeo.');
        }
    });

    // Lógica para alternar campos de entrada com base no tipo de vídeo selecionado
    videoTypeUrlRadio.addEventListener('change', () => {
        videoUrlGroup.style.display = 'block';
        videoLocalPathGroup.style.display = 'none';
    });

    videoTypeLocalRadio.addEventListener('change', () => {
        videoUrlGroup.style.display = 'none';
        videoLocalPathGroup.style.display = 'block';
    });

    prevVideoBtn.addEventListener('click', showPrevVideo);
    nextVideoBtn.addEventListener('click', showNextVideo);

    // Renderizar vídeos ao carregar a página
    renderVideos();
}); 