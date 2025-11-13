export function mensagem(msg) {
    const modalMessage = document.getElementById('modalMsg');
    modalMessage.querySelector('.modal-body').textContent = msg;
    console.log(modalMessage.querySelector('.modal-body').textContent);
    const modalMsg = new bootstrap.Modal(modalMessage);
    modalMsg.show();
}

window.mensagem = mensagem;