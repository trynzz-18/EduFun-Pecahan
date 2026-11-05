# EduFun — Petualangan Pecahan

Website pembelajaran pecahan interaktif untuk siswa sekolah dasar. Dibangun menggunakan HTML, CSS, dan JavaScript murni sehingga dapat dipublikasikan melalui GitHub Pages.

## Fitur
- Dashboard ringkasan belajar
- 6 materi dasar pecahan
- Studio visual pecahan interaktif
- Permainan tebak bagian yang diarsir
- Kuis 5 pertanyaan dengan penilaian otomatis
- Profil siswa
- Penyimpanan progres menggunakan LocalStorage
- Tampilan responsif untuk laptop dan ponsel

## Menjalankan di komputer
Cara paling mudah:
1. Ekstrak ZIP.
2. Buka folder `edufun-pecahan`.
3. Klik dua kali `index.html`, atau buka folder menggunakan VS Code lalu jalankan dengan ekstensi Live Server.

## Publikasi melalui GitHub Pages
1. Buat repository baru di GitHub, misalnya `edufun-pecahan`.
2. Upload seluruh isi folder proyek (index.html, css, js, README.md) ke repository. Jangan mengunggah folder ZIP saja.
3. Buka **Settings → Pages**.
4. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
6. Tunggu proses publikasi. GitHub akan menampilkan alamat website pada halaman Pages.

## Catatan penting
- Website ini merupakan versi demo frontend statis.
- LocalStorage menyimpan nama, bintang, materi selesai, dan riwayat kuis pada browser/perangkat masing-masing. Data tidak otomatis terkirim ke guru atau tersinkron antarperangkat.
- Tidak membutuhkan instalasi framework atau proses build.
- Jika ingin data seluruh siswa terkumpul, perlu ditambahkan backend/database pada tahap berikutnya.
