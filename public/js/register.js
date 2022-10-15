const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const emailField = document.getElementById('email');
const confirmPasswordField = document.getElementById('confirm-password');

usernameField.addEventListener('input', () => {
    const username = usernameField.value.toString();
    const taken = document.getElementById('takenmsg');

    if (username.length < 1) {
        return taken.classList.add('hidden');
    }

    fetch(`/users/${username}`)
        .then(resp => resp.json())
        .then(status => {
            if (status.taken) {
                taken.classList.remove('hidden');
                submit.setAttribute('disabled', '');
            } else {
                taken.classList.add('hidden');
                submit.removeAttribute('disabled', '');
            }
        });
    });
    
const submitBtn = document.getElementById('submit');
const popup = document.getElementById('info-popup');
    
confirmPasswordField.addEventListener('input', () => {
    const mismatch = document.getElementById('mismatch');
    const password = passwordField.value;
    if (confirmPasswordField.value !== password) {
        mismatch.classList.remove('hidden');
        submitBtn.setAttribute('disabled', '');
    } else {
        mismatch.classList.add('hidden');
        submitBtn.removeAttribute('disabled');
    }
});

const closeBtn = document.getElementById('close-modal');
closeBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
    popup.setAttribute('tabindex', '1');
});
