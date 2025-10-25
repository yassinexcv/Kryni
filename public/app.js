const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerResult = document.getElementById('register-result');
const loginResult = document.getElementById('login-result');
const userInfoSection = document.getElementById('user-info');
const userJson = document.getElementById('user-json');
const messageTemplate = document.getElementById('message-template');

const API_BASE = '/auth';

const buildMessage = (text, type = 'success') => {
  const fragment = messageTemplate.content.cloneNode(true);
  const wrapper = fragment.querySelector('.message');
  const span = fragment.querySelector('.message-text');
  if (type === 'error') {
    wrapper.classList.add('error');
  }
  span.textContent = text;
  return fragment;
};

const renderResult = (container, text, type = 'success') => {
  container.replaceChildren();
  if (!text) return;
  container.appendChild(buildMessage(text, type));
};

const renderUser = (payload) => {
  if (!payload) {
    userInfoSection.hidden = true;
    userJson.textContent = '';
    return;
  }

  const { user, token } = payload;
  userInfoSection.hidden = false;
  userJson.textContent = JSON.stringify(
    {
      user,
      token,
    },
    null,
    2,
  );
};

const parseError = async (response) => {
  try {
    const data = await response.clone().json();
    if (data?.message) return data.message;
    if (Array.isArray(data?.errors)) {
      return data.errors.map((err) => err.msg).join('\n');
    }
  } catch (error) {
    /* ignore parse failures */
  }
  return `Request failed with status ${response.status}`;
};

const submitHandler = (form, { endpoint, resultContainer }) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    renderResult(resultContainer, '');
    renderUser(null);

    try {
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const data = await response.json();
      renderResult(resultContainer, 'Success!');
      renderUser(data);
      form.reset();
    } catch (error) {
      renderResult(resultContainer, error.message || 'Unexpected error', 'error');
    }
  });
};

if (registerForm) {
  submitHandler(registerForm, { endpoint: 'register', resultContainer: registerResult });
}

if (loginForm) {
  submitHandler(loginForm, { endpoint: 'login', resultContainer: loginResult });
}
