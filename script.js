// Menunggu semua konten halaman dimuat
document.addEventListener('DOMContentLoaded', () => {

    // === FUNGSI ADMIN LOGIN ===
    const mainTitle = document.getElementById('main-title');
    let clickCount = 0;
    let clickTimer = null;

    if (mainTitle) {
        mainTitle.addEventListener('click', () => {
            clickCount++;
            
            if (clickCount === 3) {
                // Tampilkan prompt password
                const password = prompt('Masukkan sandi admin:');
                
                if (password === 'mita123') {
                    // Berhasil Login
                    document.body.classList.remove('buyer-mode');
                    document.body.classList.add('admin-mode');
                    sessionStorage.setItem('isAdmin', 'true'); // Simpan status login
                } else if (password) {
                    // Gagal Login
                    alert('KAMU BUKAN ADMIN DARI WEB INI!');
                }
                
                // Reset hitungan
                clickCount = 0;
                clearTimeout(clickTimer);

            } else {
                // Reset hitungan jika jeda antar klik terlalu lama (misal 1 detik)
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 1000);
            }
        });
    }

    // === FUNGSI LOGOUT ===
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            document.body.classList.remove('admin-mode');
            document.body.classList.add('buyer-mode');
            sessionStorage.removeItem('isAdmin'); // Hapus status login
        });
    }

    // === MENJAGA STATUS LOGIN SAAT PINDAH HALAMAN ===
    if (sessionStorage.getItem('isAdmin') === 'true') {
        document.body.classList.remove('buyer-mode');
        document.body.classList.add('admin-mode');
    } else {
        document.body.classList.remove('admin-mode');
        document.body.classList.add('buyer-mode');
    }

    // === FUNGSI DOWNLOAD GAMBAR (PROTOTIPE) ===
    const downloadableImages = document.querySelectorAll('.downloadable-img');
    let pressTimer;

    downloadableImages.forEach(img => {
        // Saat mulai menekan (di HP)
        img.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                e.preventDefault(); // Hentikan aksi default
                handleDownload(img);
            }, 3000); // 3000ms = 3 detik
        });

        // Saat berhenti menekan (di HP)
        img.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });

        // Fallback untuk Desktop (tekan lama dengan mouse)
        img.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Hanya tombol kiri
                pressTimer = setTimeout(() => {
                    e.preventDefault();
                    handleDownload(img);
                }, 3000);
            }
        });

        img.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
        });
        
        // Hentikan jika mouse keluar dari gambar
        img.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
        });
    });

    function handleDownload(img) {
        // Ambil sandi palsu dari data-password di HTML
        const correctPassword = img.getAttribute('data-password');
        const userPassword = prompt('Masukkan sandi untuk mendownload:');

        if (userPassword === correctPassword) {
            alert('Sandi Benar! Download dimulai...');
            // INI ADALAH FUNGSI DOWNLOAD
            // Kita buat link palsu untuk men-trigger download
            const link = document.createElement('a');
            link.href = img.src; // Ambil sumber gambar
            link.download = img.alt || 'commission-done'; // Nama file
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } else if (userPassword) {
            alert('Sandi salah!');
        }
    }

    // === FUNGSI ADMIN DI HALAMAN COMMISSION (PROTOTIPE) ===
    const copyButtons = document.querySelectorAll('.copy-pass-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const passwordSpan = btn.parentElement.querySelector('.password-display');
            navigator.clipboard.writeText(passwordSpan.textContent)
                .then(() => alert('Sandi disalin: ' + passwordSpan.textContent))
                .catch(err => console.error('Gagal menyalin: ', err));
        });
    });

    const editButtons = document.querySelectorAll('.edit-pass-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const passwordSpan = btn.parentElement.querySelector('.password-display');
            const newPassword = prompt('Masukkan sandi baru (hanya visual):', passwordSpan.textContent);
            if (newPassword) {
                passwordSpan.textContent = newPassword;
                // Update juga data-password di gambar agar fungsi download tetap cocok
                const img = btn.closest('.gallery-item').querySelector('.downloadable-img');
                img.setAttribute('data-password', newPassword);
            }
        });
    });
});
