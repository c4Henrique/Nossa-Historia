document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value;
        
        // Verifica se a senha está correta
        if (password === 'sophia') {
            // Remove a classe de erro se existir
            passwordInput.classList.remove('error');
            
            // Armazena o estado de login
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redireciona para a página principal
            window.location.href = 'index.html';
        } else {
            // Adiciona a classe de erro para animação
            passwordInput.classList.add('error');
            
            // Limpa o campo de senha
            passwordInput.value = '';
            
            // Remove a classe de erro após a animação
            setTimeout(() => {
                passwordInput.classList.remove('error');
            }, 500);
        }
    });

    // Verifica se já está logado
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }
}); 