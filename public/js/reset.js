const emailField = document.getElementById('email');
const submitBtn = document.getElementById('submit');
const emailAlert = document.getElementById('alert');

emailField.addEventListener('input', () => {
    if (emailField.value.length < 1) {
        return;
    }

    console.log(emailField.value);
    fetch(`/mails/${emailField.value}`)
    .then(resp => resp.json())
    .then(status => {
        if (!status.registered) {
            emailAlert.classList.remove('hidden');
            submitBtn.setAttribute('disabled', '');
        } else {
            emailAlert.classList.add('hidden');
            submitBtn.removeAttribute('disabled', '');
        }
    });
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('info-popup').classList.add('hidden');
});
