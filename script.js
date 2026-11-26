document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 0. DATA & FUNGSI BANTUAN
  // ==========================================

  // Daftar minuman untuk tabel "Daftar Harga Minuman".
  // Tambah / ubah minuman cukup di sini, tabel akan menyesuaikan otomatis.
  const DAFTAR_MINUMAN = [
    { nama: "Americano", keterangan: "Espresso + air", harga: 20000 },
    { nama: "Espresso", keterangan: "Single shot", harga: 15000 },
    { nama: "Double Shot Espresso", keterangan: "Dua shot espresso", harga: 18000 },
    { nama: "Cappuccino", keterangan: "Espresso, susu, foam tebal", harga: 24000 },
    { nama: "Cafe Latte", keterangan: "Espresso + susu segar", harga: 25000 },
    { nama: "Kopi Susu Gula Aren", keterangan: "Kopi susu manis gula aren", harga: 22000 },
    { nama: "Caramel Macchiato", keterangan: "Vanila, espresso, karamel", harga: 27000 },
    { nama: "Mocha Latte", keterangan: "Espresso + cokelat", harga: 27000 },
    { nama: "Vietnam Drip", keterangan: "Robusta + susu kental manis", harga: 20000 },
    { nama: "Manual Brew V60", keterangan: "Single origin Nusantara", harga: 28000 },
    { nama: "Matcha Latte", keterangan: "Non coffee", harga: 26000 },
    { nama: "Chocolate", keterangan: "Non coffee", harga: 23000 }
  ];

  const PILIHAN_SUHU = ["Ice", "Hot"];

  const formatRupiah = (angka) => `Rp ${Number(angka).toLocaleString("id-ID")}`;

  // Mencegah teks dari input pengguna dibaca sebagai HTML
  const escapeHtml = (teks) =>
    String(teks).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const bacaStorage = (kunci) => {
    try {
      return JSON.parse(localStorage.getItem(kunci)) || [];
    } catch (e) {
      return [];
    }
  };
  const simpanStorage = (kunci, data) => {
    try {
      localStorage.setItem(kunci, JSON.stringify(data));
    } catch (e) {
      /* abaikan jika storage tidak tersedia */
    }
  };

  // ==========================================
  // 1. NAVBAR: semua link berfungsi
  // ==========================================
  const navbarCollapseEl = document.getElementById("navbarUtama");
  const navLinks = document.querySelectorAll('#navbarUtama a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Tandai link aktif
      document.querySelectorAll("#navbarUtama .nav-link").forEach((l) => l.classList.remove("active"));
      const navTarget = document.querySelector(`#navbarUtama .nav-link[href="${link.getAttribute("href")}"]`);
      if (navTarget) navTarget.classList.add("active");

      // Tutup menu hamburger di layar HP setelah link diklik
      if (navbarCollapseEl.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl).hide();
      }
    });
  });

  // ==========================================
  // 2. TABEL DAFTAR HARGA MINUMAN
  // ==========================================
  const tbodyHarga = document.getElementById("tbody-harga");

  DAFTAR_MINUMAN.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.className = "baris-minuman";
    tr.dataset.nama = item.nama;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>
        <div class="fw-semibold">${escapeHtml(item.nama)}</div>
        <small class="text-muted">${escapeHtml(item.keterangan)}</small>
      </td>
      <td class="fw-bold text-nowrap">${formatRupiah(item.harga)}</td>
      <td class="text-end">
        <button type="button" class="btn btn-gold btn-sm pesan-sekarang text-nowrap"
                data-nama="${escapeHtml(item.nama)}" data-harga="${item.harga}">
          Pesan Sekarang
        </button>
      </td>
    `;
    tbodyHarga.appendChild(tr);
  });

  // ==========================================
  // 3. SEARCH MENU (card + tabel harga)
  // ==========================================
  const formSearch = document.getElementById("form-search");
  const inputSearch = document.getElementById("input-search");
  const menuItems = document.querySelectorAll(".menu-item");
  const barisMinuman = document.querySelectorAll(".baris-minuman");
  const searchStatus = document.getElementById("search-status");

  function filterMenu() {
    const kataKunci = inputSearch.value.toLowerCase().trim();
    let jumlahTampil = 0;

    menuItems.forEach((item) => {
      const cocok = item.textContent.toLowerCase().includes(kataKunci);
      item.style.display = cocok ? "" : "none";
      if (cocok) jumlahTampil++;
    });

    barisMinuman.forEach((baris) => {
      baris.style.display = baris.textContent.toLowerCase().includes(kataKunci) ? "" : "none";
    });

    searchStatus.textContent = kataKunci
      ? `Menampilkan ${jumlahTampil} dari ${menuItems.length} menu`
      : `Menampilkan ${menuItems.length} menu`;
  }

  inputSearch.addEventListener("input", filterMenu);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    filterMenu();
    document.getElementById("menu-kopi").scrollIntoView({ behavior: "smooth" });
    if (navbarCollapseEl.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl).hide();
    }
  });

  // ==========================================
  // 4. MODAL TENTANG KOPI (DROPDOWN)
  // ==========================================
  const modalTentang = document.getElementById("modalTentangKopi");
  const judulModalKopi = document.getElementById("judulModalKopi");
  const isiModalKopi = document.getElementById("isiModalKopi");

  const dataTentangKopi = {
    "Filosofi Kami":
      "Nav Bar lahir dari kecintaan terhadap ekstraksi espresso murni. Setiap cangkir diracik dengan takaran presisi untuk menghadirkan keseimbangan rasa pahit cokelat gelap, sedikit keasaman buah, dan aroma karamel yang elegan.",
    "Biji Kopi Nusantara":
      "Kami bekerja sama langsung dengan petani kopi lokal untuk menghadirkan biji Arabika dan Robusta pilihan yang disangrai segar setiap minggu demi menjaga kualitas rasa terbaik di setiap seduhan."
  };

  modalTentang.addEventListener("show.bs.modal", (event) => {
    const tombol = event.relatedTarget;
    const topik = tombol ? tombol.getAttribute("data-topik") : "";
    judulModalKopi.textContent = topik || "Tentang Nav Bar";
    isiModalKopi.textContent = dataTentangKopi[topik] || "Informasi seputar kopi kami.";
  });

  // ==========================================
  // 5. KERANJANG PESANAN (LocalStorage)
  // ==========================================
  let pesanan = bacaStorage("blackcup_pesanan");
  const badgeJumlah = document.getElementById("badge-jumlah");
  const listPesanan = document.getElementById("list-pesanan");
  const totalHargaEl = document.getElementById("total-harga");
  const pesanKeranjang = document.getElementById("pesan-keranjang");
  const offcanvasPesananEl = document.getElementById("offcanvasPesanan");

  function simpanDanRenderPesanan() {
    simpanStorage("blackcup_pesanan", pesanan);
    badgeJumlah.textContent = pesanan.length;
    listPesanan.innerHTML = "";

    let total = 0;

    if (pesanan.length === 0) {
      listPesanan.innerHTML = `<li class="list-group-item bg-transparent text-secondary text-center py-4">Belum ada menu yang dipilih.</li>`;
    } else {
      pesanKeranjang.classList.add("d-none");
      pesanan.forEach((item, index) => {
        total += item.harga;
        const li = document.createElement("li");
        li.className = "list-group-item bg-transparent text-light d-flex justify-content-between align-items-center border-secondary";
        li.innerHTML = `
          <div>
            <div class="fw-semibold">${escapeHtml(item.nama)}</div>
            <small class="text-warning">${formatRupiah(item.harga)}</small>
          </div>
          <button class="btn btn-sm btn-outline-danger hapus-item" data-index="${index}">Hapus</button>
        `;
        listPesanan.appendChild(li);
      });
    }

    totalHargaEl.textContent = formatRupiah(total);
  }

  // Hapus satu item (event delegation)
  listPesanan.addEventListener("click", (e) => {
    const btn = e.target.closest(".hapus-item");
    if (!btn) return;
    pesanan.splice(Number(btn.dataset.index), 1);
    simpanDanRenderPesanan();
  });

  // Tombol "Pilih Menu" pada card → masuk keranjang
  document.querySelectorAll(".tambah-pesanan").forEach((btn) => {
    btn.addEventListener("click", () => {
      pesanan.push({ nama: btn.dataset.nama, harga: parseInt(btn.dataset.harga, 10) });
      simpanDanRenderPesanan();

      const teksAsli = btn.textContent;
      btn.textContent = "Tersimpan ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = teksAsli;
        btn.disabled = false;
      }, 900);
    });
  });

  document.getElementById("btn-hapus-semua").addEventListener("click", () => {
    pesanan = [];
    simpanDanRenderPesanan();
  });

  // "Konfirmasi Pesanan" → buka form pemesanan berisi isi keranjang
  document.getElementById("btn-checkout").addEventListener("click", () => {
    if (pesanan.length === 0) {
      pesanKeranjang.classList.remove("d-none");
      return;
    }

    // Gabungkan menu yang sama menjadi satu baris dengan jumlah
    const digabung = [];
    pesanan.forEach((p) => {
      const ada = digabung.find((d) => d.nama === p.nama);
      if (ada) ada.jumlah++;
      else digabung.push({ nama: p.nama, harga: p.harga, jumlah: 1 });
    });

    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasPesananEl);
    offcanvasPesananEl.addEventListener("hidden.bs.offcanvas", () => bukaFormPesan(digabung, "keranjang"), { once: true });
    offcanvas.hide();
  });

  simpanDanRenderPesanan();

  // ==========================================
  // 6. FORM PEMESANAN & INVOICE
  // ==========================================
  const modalPesanEl = document.getElementById("modalPesan");
  const modalInvoiceEl = document.getElementById("modalInvoice");
  const modalPesan = bootstrap.Modal.getOrCreateInstance(modalPesanEl);
  const modalInvoice = bootstrap.Modal.getOrCreateInstance(modalInvoiceEl);
  const formPesan = document.getElementById("form-pesan");
  const orderItemsEl = document.getElementById("order-items");
  const orderTotalEl = document.getElementById("order-total");
  const invoicePrintEl = document.getElementById("invoice-print");

  let itemFormAktif = [];
  let sumberPesanan = "langsung"; // "langsung" (Pesan Sekarang) atau "keranjang"

  const tanggalHariIni = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  function hitungTotalForm() {
    let total = 0;
    orderItemsEl.querySelectorAll("tr").forEach((tr, i) => {
      const jumlah = Math.max(1, parseInt(tr.querySelector(".input-jumlah").value, 10) || 1);
      const subtotal = itemFormAktif[i].harga * jumlah;
      tr.querySelector(".subtotal").textContent = formatRupiah(subtotal);
      total += subtotal;
    });
    orderTotalEl.textContent = formatRupiah(total);
  }

  function bukaFormPesan(items, sumber) {
    itemFormAktif = items;
    sumberPesanan = sumber;

    formPesan.reset();
    formPesan.classList.remove("was-validated");
    document.getElementById("order-tanggal").value = tanggalHariIni();

    orderItemsEl.innerHTML = "";
    items.forEach((item, i) => {
      const opsiSuhu = PILIHAN_SUHU.map((s) => `<option value="${s}">${s}</option>`).join("");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="fw-semibold">${escapeHtml(item.nama)}</div>
          <small class="text-gold">${formatRupiah(item.harga)}</small>
        </td>
        <td>
          <select class="form-select form-select-sm custom-input input-suhu" id="suhu-${i}" required aria-label="Menu pilihan ${escapeHtml(item.nama)}">
            <option value="" selected disabled>-- Pilih --</option>
            ${opsiSuhu}
          </select>
          <div class="invalid-feedback">Pilih Ice / Hot.</div>
        </td>
        <td>
          <input type="number" class="form-control form-control-sm custom-input input-jumlah" min="1" max="50" value="${item.jumlah || 1}" required aria-label="Jumlah">
        </td>
        <td class="text-end subtotal text-nowrap"></td>
      `;
      orderItemsEl.appendChild(tr);
    });

    hitungTotalForm();
    modalPesan.show();
  }

  orderItemsEl.addEventListener("input", hitungTotalForm);

  // Semua tombol "Pesan Sekarang" (tabel + featured card)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".pesan-sekarang");
    if (!btn) return;
    bukaFormPesan([{ nama: btn.dataset.nama, harga: parseInt(btn.dataset.harga, 10), jumlah: 1 }], "langsung");
  });

  function buatNomorInvoice() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const acak = Math.floor(Math.random() * 9000 + 1000);
    return `INV-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${acak}`;
  }

  function renderInvoice(inv) {
    const baris = inv.items
      .map(
        (it, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(it.nama)}</td>
          <td><span class="badge ${it.suhu === "Ice" ? "bg-info text-dark" : "bg-danger"}">${escapeHtml(it.suhu)}</span></td>
          <td class="text-center">${it.jumlah}</td>
          <td class="text-end">${formatRupiah(it.harga)}</td>
          <td class="text-end">${formatRupiah(it.harga * it.jumlah)}</td>
        </tr>`
      )
      .join("");

    const tanggalTampil = new Date(inv.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    });

    invoicePrintEl.innerHTML = `
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <h4 class="invoice-brand mb-0">Nav Bar</h4>
          <small class="text-muted">Coffee &amp; Brew</small>
        </div>
        <div class="text-end">
          <div class="fw-bold">INVOICE</div>
          <div class="small">${escapeHtml(inv.nomor)}</div>
          <div class="small text-muted">Dibuat: ${escapeHtml(inv.dibuat)}</div>
        </div>
      </div>
      <hr>
      <div class="row g-3 mb-3 small">
        <div class="col-sm-6">
          <div class="invoice-label">Data Pemesanan</div>
          <div>Tanggal: <strong>${escapeHtml(tanggalTampil)}</strong></div>
          <div>Jenis: <strong>${escapeHtml(inv.metode)}</strong></div>
        </div>
        <div class="col-sm-6">
          <div class="invoice-label">Data Pembeli</div>
          <div>Nama: <strong>${escapeHtml(inv.nama)}</strong></div>
          <div>No. Telepon: <strong>${escapeHtml(inv.telepon)}</strong></div>
          ${inv.alamat ? `<div>Alamat/Meja: <strong>${escapeHtml(inv.alamat)}</strong></div>` : ""}
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-sm table-bordered align-middle mb-2">
          <thead class="table-light">
            <tr>
              <th>No</th><th>Menu</th><th>Pilihan</th><th class="text-center">Qty</th>
              <th class="text-end">Harga</th><th class="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>${baris}</tbody>
          <tfoot>
            <tr>
              <th colspan="5" class="text-end">TOTAL</th>
              <th class="text-end">${formatRupiah(inv.total)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
      ${inv.catatan ? `<div class="small mb-2"><span class="invoice-label">Catatan:</span> ${escapeHtml(inv.catatan)}</div>` : ""}
      <p class="text-center small text-muted mb-0 mt-3">Terima kasih telah memesan di Nav Bar ☕</p>
    `;
  }

  formPesan.addEventListener("submit", (e) => {
    e.preventDefault();
    formPesan.classList.add("was-validated");
    if (!formPesan.checkValidity()) {
      const salah = formPesan.querySelector(":invalid");
      if (salah) salah.focus();
      return;
    }

    const items = [];
    orderItemsEl.querySelectorAll("tr").forEach((tr, i) => {
      items.push({
        nama: itemFormAktif[i].nama,
        harga: itemFormAktif[i].harga,
        suhu: tr.querySelector(".input-suhu").value,
        jumlah: Math.max(1, parseInt(tr.querySelector(".input-jumlah").value, 10) || 1)
      });
    });

    const invoice = {
      nomor: buatNomorInvoice(),
      dibuat: new Date().toLocaleString("id-ID"),
      tanggal: document.getElementById("order-tanggal").value,
      metode: document.getElementById("order-metode").value,
      nama: document.getElementById("order-nama").value.trim(),
      alamat: document.getElementById("order-alamat").value.trim(),
      telepon: document.getElementById("order-telepon").value.trim(),
      catatan: document.getElementById("order-catatan").value.trim(),
      items,
      total: items.reduce((t, it) => t + it.harga * it.jumlah, 0)
    };

    // Simpan ke riwayat invoice
    const riwayat = bacaStorage("blackcup_invoice");
    riwayat.unshift(invoice);
    simpanStorage("blackcup_invoice", riwayat);

    // Jika berasal dari keranjang, kosongkan keranjang
    if (sumberPesanan === "keranjang") {
      pesanan = [];
      simpanDanRenderPesanan();
    }

    renderInvoice(invoice);
    modalPesanEl.addEventListener("hidden.bs.modal", () => modalInvoice.show(), { once: true });
    modalPesan.hide();
  });

  document.getElementById("btn-print-invoice").addEventListener("click", () => window.print());

  // ==========================================
  // 7. RIWAYAT INVOICE (DROPDOWN)
  // ==========================================
  const modalRiwayatEl = document.getElementById("modalRiwayat");
  const listRiwayat = document.getElementById("list-riwayat");

  function renderRiwayat() {
    const riwayat = bacaStorage("blackcup_invoice");
    listRiwayat.innerHTML = "";
    if (riwayat.length === 0) {
      listRiwayat.innerHTML = `<li class="list-group-item bg-transparent text-secondary">Belum ada invoice.</li>`;
      return;
    }
    riwayat.forEach((inv, i) => {
      const li = document.createElement("li");
      li.className = "list-group-item bg-transparent text-light border-secondary d-flex justify-content-between align-items-center gap-2";
      li.innerHTML = `
        <div>
          <div class="fw-semibold">${escapeHtml(inv.nomor)}</div>
          <small class="text-muted-light">${escapeHtml(inv.nama)} · ${formatRupiah(inv.total)}</small>
        </div>
        <button class="btn btn-sm btn-gold-outline lihat-invoice" data-index="${i}">Lihat</button>
      `;
      listRiwayat.appendChild(li);
    });
  }

  modalRiwayatEl.addEventListener("show.bs.modal", renderRiwayat);

  listRiwayat.addEventListener("click", (e) => {
    const btn = e.target.closest(".lihat-invoice");
    if (!btn) return;
    const inv = bacaStorage("blackcup_invoice")[Number(btn.dataset.index)];
    if (!inv) return;
    renderInvoice(inv);
    modalRiwayatEl.addEventListener("hidden.bs.modal", () => modalInvoice.show(), { once: true });
    bootstrap.Modal.getOrCreateInstance(modalRiwayatEl).hide();
  });

  document.getElementById("btn-hapus-riwayat").addEventListener("click", () => {
    simpanStorage("blackcup_invoice", []);
    renderRiwayat();
  });

  // ==========================================
  // 8. REQUEST MENU (DROPDOWN, LocalStorage)
  // ==========================================
  let daftarRequest = bacaStorage("blackcup_request");
  const formRequest = document.getElementById("form-request");
  const ulRequest = document.getElementById("daftar-request");

  function renderRequest() {
    ulRequest.innerHTML = "";
    if (daftarRequest.length === 0) {
      ulRequest.innerHTML = `<li class="list-group-item bg-transparent text-secondary">Belum ada request tersimpan.</li>`;
      return;
    }
    daftarRequest.forEach((req) => {
      const li = document.createElement("li");
      li.className = "list-group-item bg-transparent text-light border-secondary";
      li.innerHTML = `<strong>${escapeHtml(req.nama)}:</strong> ${escapeHtml(req.catatan)}`;
      ulRequest.appendChild(li);
    });
  }

  formRequest.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("nama-pengirim").value.trim();
    const catatan = document.getElementById("isi-request").value.trim();

    if (nama && catatan) {
      daftarRequest.unshift({ nama, catatan });
      simpanStorage("blackcup_request", daftarRequest);
      formRequest.reset();
      renderRequest();
    }
  });

  renderRequest();
});
