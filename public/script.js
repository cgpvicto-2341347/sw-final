const API_URL = 'https://sw-final.onrender.com/api';

        function togglePassword(inputId, btn) {
            const input = document.getElementById(inputId);
            if (input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        }

        function showMessage(id, text, type) {
            const el = document.getElementById(id);
            el.textContent = text;
            el.className = `message ${type}`;
            el.style.display = 'block';
        }

        async function creerBibliotheque() {
            const nom = document.getElementById('create-nom').value.trim();
            const courriel = document.getElementById('create-courriel').value.trim();
            const password = document.getElementById('create-password').value;

            if (!nom || !courriel || !password) {
                showMessage('create-message', 'Veuillez remplir tous les champs.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/bibliotheques`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nom, courriel, password })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('create-message', `Bibliothèque créée ! Clé API : ${data.cle_api}`, 'success');
                } else {
                    showMessage('create-message', data.erreur || 'Une erreur est survenue.', 'error');
                }
            } catch (err) {
                showMessage('create-message', 'Impossible de contacter le serveur.', 'error');
            }
        }

        async function recupererCleApi() {
            const courriel = document.getElementById('get-courriel').value.trim();
            const password = document.getElementById('get-password').value;
            const regenerer = document.getElementById('regenerer').checked;

            if (!courriel || !password) {
                showMessage('get-message', 'Veuillez remplir tous les champs.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/bibliotheques/cle-api`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courriel, password, regenerer })
                });

                const data = await response.json();

                if (response.ok) {
                    const msg = regenerer ? 'Nouvelle clé API générée !' : 'Clé API récupérée !';
                    showMessage('get-message', msg, 'success');
                    const cleEl = document.getElementById('cle-api-result');
                    cleEl.textContent = data.cle_api;
                    cleEl.style.display = 'block';
                } else {
                    showMessage('get-message', data.erreur || 'Une erreur est survenue.', 'error');
                    document.getElementById('cle-api-result').style.display = 'none';
                }
            } catch (err) {
                showMessage('get-message', 'Impossible de contacter le serveur.', 'error');
            }
        }