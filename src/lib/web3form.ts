/**
 * Soumission client-side d'un formulaire vers l'API Web3Forms,
 * avec message de confirmation / d'erreur.
 */
export function bindWeb3Form(form: HTMLFormElement | null): void {
  if (!form) return;
  const status = form.querySelector<HTMLElement>('.form-status');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const accessKey = (form.elements.namedItem('access_key') as HTMLInputElement | null)?.value;
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      setStatus(
        'error',
        "Le formulaire n'est pas encore activé (clé Web3Forms manquante — voir src/config.ts).",
      );
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Envoi…';
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();

      if (result.success) {
        setStatus('success', 'Merci ! Votre message a bien été envoyé. Je vous réponds au plus vite.');
        form.reset();
      } else {
        setStatus('error', "L'envoi a échoué. Réessayez ou écrivez-moi directement par e-mail.");
      }
    } catch {
      setStatus('error', "L'envoi a échoué (problème de connexion). Réessayez ou écrivez-moi par e-mail.");
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = 'Envoyer';
      }
    }
  });

  function setStatus(state: 'success' | 'error', message: string) {
    if (!status) return;
    status.dataset.state = state;
    status.textContent = message;
  }
}
