const overLay = document.getElementById('overlay');
const overlayPanel = document.querySelectorAll('.overlay');
const searchIcon = document.querySelectorAll('.search-icon');

function closeAllModals() {
    const boxes = ['logout-box', 'delete-box', 'notifBox', 'password-box'];
    boxes.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    if (overLay) overLay.style.display = 'none';
}

/* ─── Search overlay ─────────────────────────────────────── */
searchIcon.forEach(icon => {
    icon.addEventListener('click', () => {
        document.querySelector('.second-search').style.display = "flex";
        overLay.style.display = "flex";
        overlayPanel.forEach(panel => {
            panel.addEventListener('click', () => {
                document.querySelector('.second-search').style.display = "none";
                closeAllModals();
            });
        });
    });
});

/* ─── Profile: load, dropdown, avatar ─────────────────────── */
const profileTrigger  = document.getElementById('profileTrigger');
const profileDropdown = document.getElementById('profileDropdown');
const navAvatar       = document.getElementById('navAvatar');
const menuAvatar      = document.getElementById('menuAvatar');
const profileName     = document.getElementById('profileName');
const profileEmail    = document.getElementById('profileEmail');
const avatarInput     = document.getElementById('avatarInput');
const changeAvatarBtn = document.getElementById('changeAvatarBtn');

const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
    '<circle cx="20" cy="20" r="20" fill="#ffb870"/>' +
    '<circle cx="20" cy="15" r="7" fill="#990000"/>' +
    '<path d="M6 36c2-8 8-12 14-12s12 4 14 12" fill="#990000"/></svg>'
);

async function loadProfile() {
    try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) { window.location.href = '/html/login.html'; return; }
        const { user } = await res.json();

        const src = user.avatarUrl || DEFAULT_AVATAR;
        if (navAvatar) navAvatar.src = src;
        if (menuAvatar) menuAvatar.src = src;
        if (profileName) profileName.textContent = user.fullName || 'Account';
        if (profileEmail) profileEmail.textContent = user.email || '';
    } catch {
        window.location.href = '/html/login.html';
    }
}

function toggleDropdown(open) {
    if (!profileDropdown) return;
    const shouldOpen = (open !== undefined) ? open : !profileDropdown.classList.contains('open');
    profileDropdown.classList.toggle('open', shouldOpen);
}

if (profileTrigger) {
    profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });
}

document.addEventListener('click', (e) => {
    if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileTrigger) {
        toggleDropdown(false);
    }
});

if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        avatarInput?.click();
    });
}

if (avatarInput) {
    avatarInput.addEventListener('change', async () => {
        const file = avatarInput.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be under 2MB.');
            avatarInput.value = '';
            return;
        }

        const fd = new FormData();
        fd.append('avatar', file);

        try {
            const res = await fetch('/api/auth/avatar', {
                method: 'POST', credentials: 'include', body: fd
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || 'Upload failed.');
            if (navAvatar) navAvatar.src = data.avatarUrl;
            if (menuAvatar) menuAvatar.src = data.avatarUrl;
        } catch (err) {
            alert(err.message);
        } finally {
            avatarInput.value = '';
        }
    });
}

/* ─── Logout ──────────────────────────────────────────────── */
const logoutBtn = document.getElementById('logoutBtn');
const cancelButtons = document.querySelectorAll('.cancel-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDropdown(false);
        document.getElementById('logout-box').style.display = 'block';
        overLay.style.display = 'flex';
    });
}

cancelButtons.forEach(b => b.addEventListener('click', closeAllModals));
overlayPanel.forEach(b => b.addEventListener('click', closeAllModals));

/* ─── Confirm Logout (The "Yes" button) ───────────────────── */
const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Stop the link from navigating immediately
        
        try {
            // Tell the backend to clear the cookie session
            await fetch('/api/auth/logout', { 
                method: 'POST', 
                credentials: 'include' 
            });
        } finally {
            // Redirect to login page
            window.location.href = '/html/login.html';
        }
    });
}

/* ─── Delete account ──────────────────────────────────────── */
const deleteBtn      = document.getElementById('deleteAccountBtn');
const cancelDelete   = document.getElementById('cancelDelete');
const confirmDelete  = document.getElementById('confirmDelete');
const deletePassword = document.getElementById('deletePassword');
const deleteError    = document.getElementById('deleteError');

if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDropdown(false);
        deleteError.textContent = '';
        deletePassword.value = '';
        document.getElementById('delete-box').style.display = 'block';
        overLay.style.display = 'flex';
    });
}

if (cancelDelete) cancelDelete.addEventListener('click', closeAllModals);

if (confirmDelete) {
    confirmDelete.addEventListener('click', async () => {
        deleteError.textContent = '';
        const password = deletePassword.value;
        if (!password) { deleteError.textContent = 'Enter your password.'; return; }

        confirmDelete.disabled = true;
        confirmDelete.textContent = 'Deleting…';

        try {
            const res = await fetch('/api/auth/account', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || 'Delete failed.');
            window.location.href = '/html/login.html';
        } catch (err) {
            deleteError.textContent = err.message;
            confirmDelete.disabled = false;
            confirmDelete.textContent = 'Delete';
        }
    });
}

/* ─── Notifications ───────────────────────────────────────── */
const notifCount    = document.getElementById('notifCount');
const openNotifBtn  = document.getElementById('openNotificationsBtn');
const notifBox      = document.getElementById('notifBox');
const notifList     = document.getElementById('notifList');
const closeNotifBtn = document.getElementById('closeNotifBtn');
const markAllReadBtn= document.getElementById('markAllReadBtn');

let unreadCount = 0;

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

function updateNotifBadge(count) {
    unreadCount = count;
    if (count > 0) {
        if (notifCount) {
            notifCount.textContent = count > 99 ? '99+' : count;
            notifCount.style.display = 'inline-block';
        }
        if (!document.querySelector('.profile-trigger .trigger-dot')) {
            const dot = document.createElement('span');
            dot.className = 'trigger-dot';
            profileTrigger.appendChild(dot);
        }
    } else {
        if (notifCount) notifCount.style.display = 'none';
        document.querySelector('.profile-trigger .trigger-dot')?.remove();
    }
}

function renderNotifications(items) {
    if (!items || items.length === 0) {
        notifList.innerHTML = '<p class="notif-empty">No notifications yet.</p>';
        return;
    }
    notifList.innerHTML = items.map(n => `
        <a class="notif-item ${n.type} ${n.read ? '' : 'unread'}" href="${n.link ? '/' + n.link : '#'}" data-id="${n._id}">
            <div class="notif-icon"><i class="fa ${n.type === 'order' ? 'fa-box-open' : n.type === 'promo' ? 'fa-tag' : 'fa-bell'}"></i></div>
            <div class="notif-body">
                <strong>${n.title}</strong>
                <p>${n.message}</p>
                <small>${timeAgo(n.createdAt)}</small>
            </div>
        </a>
    `).join('');

    notifList.querySelectorAll('.notif-item').forEach(el => {
        el.addEventListener('click', async (e) => {
            const id = el.dataset.id;
            if (el.classList.contains('unread')) {
                el.classList.remove('unread');
                updateNotifBadge(Math.max(0, unreadCount - 1));
                try {
                    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH', credentials: 'include' });
                } catch {}
            }
            if (!el.getAttribute('href') || el.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
}

async function loadNotifications(showPanel = false) {
    try {
        const res = await fetch('/api/notifications', { credentials: 'include' });
        if (!res.ok) return;
        const { notifications, unread } = await res.json();
        updateNotifBadge(unread);
        if (showPanel) {
            renderNotifications(notifications);
            notifBox.style.display = 'flex';
            overLay.style.display = 'flex';
        }
    } catch {}
}

if (openNotifBtn) {
    openNotifBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDropdown(false);
        loadNotifications(true);
    });
}

if (closeNotifBtn) closeNotifBtn.addEventListener('click', closeAllModals);

if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', async () => {
        await fetch('/api/notifications/read-all', { method: 'POST', credentials: 'include' });
        notifList.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
        updateNotifBadge(0);
    });
}

/* ─── Change Password ─────────────────────────────────────── */
const openPasswordBtn = document.getElementById('openPasswordBtn');
const passwordBox     = document.getElementById('password-box');
const cancelPassword  = document.getElementById('cancelPassword');
const submitPassword  = document.getElementById('submitPassword');
const currentPassword = document.getElementById('currentPassword');
const newPassword     = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const passwordError   = document.getElementById('passwordError');
const passwordSuccess = document.getElementById('passwordSuccess');

if (openPasswordBtn) {
    openPasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDropdown(false);
        passwordError.textContent = '';
        passwordSuccess.textContent = '';
        currentPassword.value = newPassword.value = confirmPassword.value = '';
        passwordBox.style.display = 'block';
        overLay.style.display = 'flex';
    });
}

if (cancelPassword) cancelPassword.addEventListener('click', closeAllModals);

if (submitPassword) {
    submitPassword.addEventListener('click', async () => {
        passwordError.textContent = '';
        passwordSuccess.textContent = '';

        if (!currentPassword.value || !newPassword.value) {
            passwordError.textContent = 'Please fill in every field.';
            return;
        }
        if (newPassword.value.length < 8) {
            passwordError.textContent = 'New password must be at least 8 characters.';
            return;
        }
        if (newPassword.value !== confirmPassword.value) {
            passwordError.textContent = 'New passwords do not match.';
            return;
        }

        submitPassword.disabled = true;
        submitPassword.textContent = 'Updating…';

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: currentPassword.value,
                    newPassword: newPassword.value
                })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || 'Update failed.');

            passwordSuccess.textContent = 'Password updated ✅';
            currentPassword.value = newPassword.value = confirmPassword.value = '';
            setTimeout(closeAllModals, 1500);
        } catch (err) {
            passwordError.textContent = err.message;
        } finally {
            submitPassword.disabled = false;
            submitPassword.textContent = 'Update';
        }
    });
}

/* ─── Initial load ────────────────────────────────────────── */
loadProfile();
loadNotifications(false);   // silent badge check