/**
 * ==========================================================================
 * DETEKTIF GRYA - LOGIKA APLIKASI FILATELI POS
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi ikon Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  const AudioEngine = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    playClick() {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    },
    playSnap() {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.06);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    },
    playUnlock() {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(320, t);
      osc1.frequency.exponentialRampToValueAtTime(80, t + 0.12);
      gain1.gain.setValueAtTime(0.35, t);
      gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.12);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(540, t + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(980, t + 0.3);
      gain2.gain.setValueAtTime(0.25, t + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.08);
      osc2.stop(t + 0.35);
    },
    playFanfare() {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + (idx * 0.1);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    },
    playStamp() {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    },
    playBuzzer() {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  };

  // --- STATE & STORAGE ---
  const STORAGE_KEYS = {
    USER_DATA: "grya_user_data",
    SUBMISSIONS: "grya_submissions",
    CUSTOM_CODE: "grya_custom_code",
    SHEET_URL: "grya_sheet_url",
    PRESET_URL: "grya_preset_url",
    ACCEPT_ANY: "grya_accept_any"
  };

  function getConfig() {
    return {
      correctCode: localStorage.getItem(STORAGE_KEYS.CUSTOM_CODE) || QUIZ_CONFIG.correctCode || "2134",
      sheetUrl: QUIZ_CONFIG.googleSheetScriptUrl || localStorage.getItem(STORAGE_KEYS.SHEET_URL) || "",
      presetUrl: localStorage.getItem(STORAGE_KEYS.PRESET_URL) || QUIZ_CONFIG.instagramPresetUrl || "https://bit.ly/preset-story-grya",
      acceptAny: localStorage.getItem(STORAGE_KEYS.ACCEPT_ANY) === "true",
      edition: QUIZ_CONFIG.edition || "Edisi Merdeka Punya Rumah"
    };
  }

  // Update preset link
  const linkPresetIg = document.getElementById("linkPresetIg");
  if (linkPresetIg) {
    linkPresetIg.href = getConfig().presetUrl;
  }

  // --- RESTORE DATA IDENTITAS DARI STORAGE ---
  const formElements = {
    fullName: document.getElementById("fullName"),
    nip: document.getElementById("nip"),
    orgUnit: document.getElementById("orgUnit"),
    workUnit: document.getElementById("workUnit"),
    whatsapp: document.getElementById("whatsapp"),
    instagram: document.getElementById("instagram")
  };

  try {
    const savedUserData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || "{}");
    if (savedUserData) {
      if (savedUserData.fullName && formElements.fullName) formElements.fullName.value = savedUserData.fullName;
      if (savedUserData.nip && formElements.nip) formElements.nip.value = savedUserData.nip;
      if (savedUserData.orgUnit && formElements.orgUnit) formElements.orgUnit.value = savedUserData.orgUnit;
      if (savedUserData.workUnit && formElements.workUnit) formElements.workUnit.value = savedUserData.workUnit;
      if (savedUserData.whatsapp && formElements.whatsapp) formElements.whatsapp.value = savedUserData.whatsapp;
      if (savedUserData.instagram && formElements.instagram) formElements.instagram.value = savedUserData.instagram;
    }
  } catch (err) {
    console.warn("Gagal membaca saved user data:", err);
  }

  // Auto-save data form setiap kali diketik
  Object.values(formElements).forEach(input => {
    if (!input) return;
    input.addEventListener("input", () => {
      const currentData = {
        fullName: formElements.fullName ? formElements.fullName.value.trim() : "",
        nip: formElements.nip ? formElements.nip.value.trim() : "",
        orgUnit: formElements.orgUnit ? formElements.orgUnit.value.trim() : "",
        workUnit: formElements.workUnit ? formElements.workUnit.value.trim() : "",
        whatsapp: formElements.whatsapp ? formElements.whatsapp.value.trim() : "",
        instagram: formElements.instagram ? formElements.instagram.value.trim() : ""
      };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(currentData));
    });
  });

  // --- UPLOAD BUKTI STORY INSTAGRAM ---
  const uploadDropzone = document.getElementById("uploadDropzone");
  const storyImageInput = document.getElementById("storyImageInput");
  const dropzoneEmpty = document.getElementById("dropzoneEmpty");
  const dropzonePreview = document.getElementById("dropzonePreview");
  const previewImg = document.getElementById("previewImg");
  const previewFileName = document.getElementById("previewFileName");
  const btnChangePhoto = document.getElementById("btnChangePhoto");

  let uploadedFile = null;

  if (uploadDropzone && storyImageInput) {
    uploadDropzone.addEventListener("click", (e) => {
      if (e.target !== btnChangePhoto && !btnChangePhoto.contains(e.target)) {
        storyImageInput.click();
      }
    });

    if (btnChangePhoto) {
      btnChangePhoto.addEventListener("click", (e) => {
        e.stopPropagation();
        storyImageInput.click();
      });
    }

    storyImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadedFile = file;
        if (previewFileName) previewFileName.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          if (previewImg) previewImg.src = event.target.result;
          if (dropzoneEmpty) dropzoneEmpty.style.display = "none";
          if (dropzonePreview) dropzonePreview.style.display = "flex";
          AudioEngine.playSnap();
          if (window.lucide) window.lucide.createIcons();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- 4-DIGIT TUMBLERS LOGIC ---
  const digitInputs = [
    document.getElementById("digit0"),
    document.getElementById("digit1"),
    document.getElementById("digit2"),
    document.getElementById("digit3")
  ];

  let currentActiveDigitIndex = 0;

  function updateTumblerState() {
    digitInputs.forEach((input) => {
      if (!input) return;
      const val = parseInt(input.value, 10);
      if (val >= 1 && val <= 4) {
        input.classList.add("valid");
      } else {
        input.classList.remove("valid");
      }
    });
  }

  // Input listener dengan auto-advance & pembatasan angka 1-4
  digitInputs.forEach((input, index) => {
    if (!input) return;
    input.addEventListener("focus", () => {
      currentActiveDigitIndex = index;
    });

    input.addEventListener("input", (e) => {
      const raw = e.target.value.replace(/[^1-4]/g, '');
      if (raw.length > 0) {
        input.value = raw.charAt(raw.length - 1);
        AudioEngine.playClick();
        updateTumblerState();
        if (index < 3 && digitInputs[index + 1]) {
          digitInputs[index + 1].focus();
        }
      } else {
        input.value = "";
        updateTumblerState();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "" && index > 0 && digitInputs[index - 1]) {
        digitInputs[index - 1].focus();
      }
    });
  });

  // Tombol Panah Naik / Turun (▲ / ▼)
  document.querySelectorAll(".dial-arrow-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-digit-index"), 10);
      const dir = parseInt(btn.getAttribute("data-dir"), 10);
      const input = digitInputs[idx];
      if (!input) return;

      let currentVal = parseInt(input.value, 10);
      if (isNaN(currentVal)) {
        currentVal = dir > 0 ? 1 : 4;
      } else {
        currentVal += dir;
        if (currentVal > 4) currentVal = 1;
        if (currentVal < 1) currentVal = 4;
      }

      input.value = currentVal;
      currentActiveDigitIndex = idx;
      AudioEngine.playClick();
      updateTumblerState();
    });
  });

  // Typewriter Quickpad (1, 2, 3, 4)
  document.querySelectorAll(".tw-key[data-val]").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-val");
      let targetInput = digitInputs[currentActiveDigitIndex];
      if (targetInput && targetInput.value !== "") {
        const emptyIdx = digitInputs.findIndex(inp => inp && inp.value === "");
        if (emptyIdx !== -1) {
          targetInput = digitInputs[emptyIdx];
          currentActiveDigitIndex = emptyIdx;
        }
      }

      if (targetInput) {
        targetInput.value = val;
        AudioEngine.playClick();
        updateTumblerState();

        if (currentActiveDigitIndex < 3 && digitInputs[currentActiveDigitIndex + 1]) {
          currentActiveDigitIndex++;
          digitInputs[currentActiveDigitIndex].focus();
        }
      }
    });
  });

  // Quickpad Backspace / Delete
  const padBackspace = document.getElementById("padBackspace");
  if (padBackspace) {
    padBackspace.addEventListener("click", () => {
      AudioEngine.playClick();
      let targetInput = digitInputs[currentActiveDigitIndex];
      if (targetInput && targetInput.value !== "") {
        targetInput.value = "";
      } else if (currentActiveDigitIndex > 0 && digitInputs[currentActiveDigitIndex - 1]) {
        currentActiveDigitIndex--;
        digitInputs[currentActiveDigitIndex].value = "";
        digitInputs[currentActiveDigitIndex].focus();
      }
      updateTumblerState();
    });
  }

  // --- SUBMISSION & VALIDATION ---
  const quizForm = document.getElementById("quizForm");
  const lockVisual = document.getElementById("lockVisual");
  const lockShackle = document.getElementById("lockShackle");
  const lockStatusText = document.getElementById("lockStatusText");
  const btnSubmit = document.getElementById("btnSubmit");

  // Modals
  const successModal = document.getElementById("successModal");
  const errorModal = document.getElementById("errorModal");
  const posterModal = document.getElementById("posterModal");
  const adminModal = document.getElementById("adminModal");
  const clueAccordion = document.getElementById("clueAccordion");

  // Form submit handler
  if (quizForm) {
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // 1. Cek apakah bukti foto story sudah diunggah
      if (!uploadedFile && (!storyImageInput || !storyImageInput.files || storyImageInput.files.length === 0)) {
        alert("Harap unggah tangkapan layar bukti story Instagram Anda terlebih dahulu!");
        if (uploadDropzone) uploadDropzone.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // 2. Ambil 4-digit kode
      const codeEntered = digitInputs.map(inp => inp ? inp.value.trim() : "").join("");
      if (codeEntered.length !== 4) {
        alert("Harap lengkapi ke-4 digit nomor rumah untuk program Bedah Rumah, FLPP, RUSUN, dan KPP!");
        const firstEmpty = digitInputs.find(inp => inp && inp.value.trim() === "");
        if (firstEmpty) firstEmpty.focus();
        return;
      }

      // 3. Cek Kunci Jawaban
      const config = getConfig();
      const isCodeCorrect = config.acceptAny || (codeEntered === config.correctCode);

      if (!isCodeCorrect) {
        // --- KODE SALAH ---
        AudioEngine.playBuzzer();
        if (lockVisual) {
          lockVisual.classList.remove("shake");
          void lockVisual.offsetWidth;
          lockVisual.classList.add("shake");
        }

        setTimeout(() => {
          if (errorModal) errorModal.style.display = "flex";
          if (window.lucide) window.lucide.createIcons();
        }, 400);

      } else {
        // --- KODE BENAR (VICTORY!) ---
        if (btnSubmit) btnSubmit.disabled = true;
        AudioEngine.playUnlock();

        // Animasi gembok terbuka
        if (lockShackle) lockShackle.classList.add("unlocked");
        const statusPillBg = document.getElementById("statusPillBg");
        if (statusPillBg) statusPillBg.classList.add("unlocked");
        if (lockStatusText) {
          lockStatusText.textContent = "TERBUKA";
          lockStatusText.setAttribute("fill", "#ffffff");
        }

        // Generate Ticket ID Unik (contoh: #GRYA-8241)
        const ticketId = `#GRYA-${Math.floor(1000 + Math.random() * 9000)}`;
        const nowStr = new Date().toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        // Siapkan payload data
        const payload = {
          timestamp: nowStr,
          ticketId: ticketId,
          fullName: formElements.fullName ? formElements.fullName.value.trim() : "",
          nip: formElements.nip ? formElements.nip.value.trim() : "",
          orgUnit: formElements.orgUnit ? formElements.orgUnit.value.trim() : "",
          workUnit: formElements.workUnit ? formElements.workUnit.value.trim() : "",
          whatsapp: formElements.whatsapp ? formElements.whatsapp.value.trim() : "",
          instagram: formElements.instagram ? formElements.instagram.value.trim() : "",
          storyUploaded: true,
          storyFileName: uploadedFile ? uploadedFile.name : "bukti-story.jpg",
          storyImageBase64: (previewImg && previewImg.src && previewImg.src.startsWith("data:")) ? previewImg.src : "",
          codeAnswer: codeEntered,
          status: "BENAR"
        };

        // Simpan ke arsip lokal
        saveSubmissionLocally(payload);

        // Jalankan kembang api confetti
        setTimeout(() => {
          triggerConfetti();
          AudioEngine.playFanfare();
        }, 300);

        // Buka modal kemenangan
        setTimeout(() => {
          displayVictory(payload);
          if (btnSubmit) btnSubmit.disabled = false;
        }, 800);

        // Kirim ke Google Sheets Webhook
        sendToGoogleSheets(payload);
      }
    });
  }

  // Multi-burst Confetti
  function triggerConfetti() {
    if (typeof confetti !== "function") return;
    const end = Date.now() + 1500;
    const colors = ['#b91c1c', '#1d4ed8', '#c28829', '#15803d', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  // Tampilkan data ke Lembar Prangko Souvenir
  function displayVictory(data) {
    const badgeTicketId = document.getElementById("badgeTicketId");
    if (badgeTicketId) badgeTicketId.textContent = data.ticketId;

    const badgeName = document.getElementById("badgeName");
    if (badgeName) badgeName.textContent = data.fullName.toUpperCase();

    const badgeNip = document.getElementById("badgeNip");
    if (badgeNip) badgeNip.textContent = data.nip;

    const badgeOrg = document.getElementById("badgeOrg");
    if (badgeOrg) badgeOrg.textContent = data.orgUnit;

    const badgeWork = document.getElementById("badgeWork");
    if (badgeWork) badgeWork.textContent = data.workUnit;

    const badgeWa = document.getElementById("badgeWa");
    if (badgeWa) badgeWa.textContent = data.whatsapp;
    
    const badgeIg = document.getElementById("badgeIg");
    if (badgeIg) badgeIg.textContent = data.instagram;

    const badgeTimestamp = document.getElementById("badgeTimestamp");
    if (badgeTimestamp) badgeTimestamp.textContent = `Diverifikasi: ${data.timestamp}`;

    // Digit boxes pada kartu lencana
    const badgeCodeBoxes = document.querySelectorAll("#badgeCode .code-stamp-box");
    const digits = data.codeAnswer.split("");
    badgeCodeBoxes.forEach((box, i) => {
      box.textContent = digits[i] || "-";
    });

    if (successModal) successModal.style.display = "flex";
    if (window.lucide) window.lucide.createIcons();

    // Animasi cap stempel basah
    const solvedStamp = document.getElementById("solvedStamp");
    if (solvedStamp) {
      solvedStamp.classList.remove("stamp-active");
      setTimeout(() => {
        AudioEngine.playStamp();
        solvedStamp.classList.add("stamp-active");
      }, 300);
    }
  }

  // Simpan data ke browser localStorage
  function saveSubmissionLocally(data) {
    try {
      const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || "[]");
      submissions.unshift(data);
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.warn("Gagal simpan submission lokal:", e);
    }
  }

  // Kirim data ke Google Sheets
  function sendToGoogleSheets(payload) {
    const syncStatus = document.getElementById("syncStatus");
    const config = getConfig();

    if (!config.sheetUrl) {
      if (syncStatus) {
        syncStatus.className = "sync-status success";
        syncStatus.innerHTML = `<i data-lucide="check-circle-2"></i> Tersimpan di arsip perangkat (Mode Demo).`;
        if (window.lucide) window.lucide.createIcons();
      }
      return;
    }

    if (syncStatus) {
      syncStatus.className = "sync-status";
      syncStatus.innerHTML = `<i data-lucide="loader" class="spin"></i> Mengirim ke Google Sheet panitia...`;
      if (window.lucide) window.lucide.createIcons();
    }

    fetch(config.sheetUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    })
    .then(() => {
      if (syncStatus) {
        syncStatus.className = "sync-status success";
        syncStatus.innerHTML = `<i data-lucide="check-circle-2"></i> Berhasil tercatat di Google Sheet panitia!`;
        if (window.lucide) window.lucide.createIcons();
      }
    })
    .catch((err) => {
      console.error("Gagal kirim ke Google Sheets:", err);
      if (syncStatus) {
        syncStatus.className = "sync-status";
        syncStatus.style.color = "#b45309";
        syncStatus.innerHTML = `<i data-lucide="alert-circle"></i> Tersimpan di arsip offline. Panitia dapat mengekspor dari admin.`;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // --- DOWNLOAD BADGE GAMBAR (html2canvas) ---
  const btnDownloadBadge = document.getElementById("btnDownloadBadge");
  if (btnDownloadBadge) {
    btnDownloadBadge.addEventListener("click", () => {
      const badgeElem = document.getElementById("detectiveBadge");
      if (!badgeElem || typeof html2canvas !== "function") return;

      const originalBtnText = btnDownloadBadge.innerHTML;
      btnDownloadBadge.innerHTML = `<i data-lucide="loader" class="spin"></i> Mencetak Prangko...`;
      if (window.lucide) window.lucide.createIcons();

      html2canvas(badgeElem, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
      }).then(canvas => {
        const link = document.createElement("a");
        const safeName = formElements.fullName ? formElements.fullName.value.trim().replace(/[^a-zA-Z0-9]/g, "-") : "Peserta";
        link.download = `Lembar-Prangko-Detektif-Grya-${safeName || 'Peserta'}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        btnDownloadBadge.innerHTML = `<i data-lucide="check"></i> Prangko Tersimpan!`;
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          btnDownloadBadge.innerHTML = originalBtnText;
          if (window.lucide) window.lucide.createIcons();
        }, 2000);
      }).catch(err => {
        console.error("Gagal render lencana:", err);
        btnDownloadBadge.innerHTML = originalBtnText;
        alert("Gagal mengunduh gambar lencana. Silakan screenshot layar ponsel Anda!");
      });
    });
  }

  // --- SHARE KE WHATSAPP ---
  const btnShareWa = document.getElementById("btnShareWa");
  if (btnShareWa) {
    btnShareWa.addEventListener("click", () => {
      const name = formElements.fullName ? formElements.fullName.value.trim() : "Saya";
      const ticketId = document.getElementById("badgeTicketId") ? document.getElementById("badgeTicketId").textContent : "#GRYA";
      const text = `🕵️‍♂️ *MISI KASUS DETEKTIF GRYA SELESAI!*\n\nHalo rekan-rekan! Saya (${name}) telah berhasil memecahkan teka-teki "Empat Pintu Satu Kode Rahasia" di majalah tim dengan ID Tiket ${ticketId}.\n\nSaya juga sudah share story ke @kementerianpkp! Yuk ikutan kuisnya dan menangkan hadiahnya! 🎁🔍`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  }

  // --- MODAL CONTROLS ---
  const btnCloseSuccess = document.getElementById("btnCloseSuccess");
  if (btnCloseSuccess) {
    btnCloseSuccess.addEventListener("click", () => {
      if (successModal) successModal.style.display = "none";
    });
  }

  const btnCloseError = document.getElementById("btnCloseError");
  if (btnCloseError) {
    btnCloseError.addEventListener("click", () => {
      if (errorModal) errorModal.style.display = "none";
    });
  }

  // Clue Accordion Toggle
  const btnToggleClues = document.getElementById("btnToggleClues");
  const btnCloseClues = document.getElementById("btnCloseClues");
  if (btnToggleClues && clueAccordion) {
    btnToggleClues.addEventListener("click", () => {
      const isHidden = clueAccordion.style.display === "none";
      clueAccordion.style.display = isHidden ? "block" : "none";
      if (isHidden) {
        clueAccordion.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }
  if (btnCloseClues && clueAccordion) {
    btnCloseClues.addEventListener("click", () => {
      clueAccordion.style.display = "none";
    });
  }

  // Poster Modal
  const btnOpenPoster = document.getElementById("btnOpenPoster");
  const btnClosePoster = document.getElementById("btnClosePoster");
  const btnResetZoom = document.getElementById("btnResetZoom");
  const posterZoomWrapper = document.getElementById("posterZoomWrapper");
  let currentZoom = 1;

  if (btnOpenPoster && posterModal) {
    btnOpenPoster.addEventListener("click", () => {
      posterModal.style.display = "flex";
      currentZoom = 1;
      if (posterZoomWrapper) posterZoomWrapper.style.transform = `scale(1)`;
      if (window.lucide) window.lucide.createIcons();
    });
  }
  if (btnClosePoster && posterModal) {
    btnClosePoster.addEventListener("click", () => {
      posterModal.style.display = "none";
    });
  }
  if (btnResetZoom && posterZoomWrapper) {
    btnResetZoom.addEventListener("click", () => {
      currentZoom = 1;
      posterZoomWrapper.style.transform = `scale(1)`;
    });
  }

  if (posterZoomWrapper) {
    posterZoomWrapper.addEventListener("click", () => {
      currentZoom = currentZoom === 1 ? 1.75 : 1;
      posterZoomWrapper.style.transform = `scale(${currentZoom})`;
    });
  }

  // --- SECRET ADMIN PANEL (Tap Logo 5x) ---
  let tapCount = 0;
  let tapTimer = null;
  const secretTrigger = document.getElementById("secretAdminTrigger");

  if (secretTrigger) {
    secretTrigger.addEventListener("click", () => {
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { tapCount = 0; }, 2500);

      if (tapCount >= 5) {
        tapCount = 0;
        openAdminModal();
      }
    });
  }

  function openAdminModal() {
    const config = getConfig();
    const adminCorrectCode = document.getElementById("adminCorrectCode");
    if (adminCorrectCode) adminCorrectCode.value = config.correctCode;

    const adminPresetUrl = document.getElementById("adminPresetUrl");
    if (adminPresetUrl) adminPresetUrl.value = config.presetUrl;

    const adminSheetUrl = document.getElementById("adminSheetUrl");
    if (adminSheetUrl) adminSheetUrl.value = config.sheetUrl;

    const adminAcceptAny = document.getElementById("adminAcceptAny");
    if (adminAcceptAny) adminAcceptAny.checked = config.acceptAny;

    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || "[]");
    const localSubmissionsCount = document.getElementById("localSubmissionsCount");
    if (localSubmissionsCount) localSubmissionsCount.textContent = submissions.length;

    if (adminModal) adminModal.style.display = "flex";
    if (window.lucide) window.lucide.createIcons();
  }

  const btnCloseAdmin = document.getElementById("btnCloseAdmin");
  if (btnCloseAdmin && adminModal) {
    btnCloseAdmin.addEventListener("click", () => {
      adminModal.style.display = "none";
    });
  }

  const btnSaveAdmin = document.getElementById("btnSaveAdmin");
  if (btnSaveAdmin) {
    btnSaveAdmin.addEventListener("click", () => {
      const adminCorrectCode = document.getElementById("adminCorrectCode");
      const adminPresetUrl = document.getElementById("adminPresetUrl");
      const adminSheetUrl = document.getElementById("adminSheetUrl");
      const adminAcceptAny = document.getElementById("adminAcceptAny");

      const newCode = adminCorrectCode ? adminCorrectCode.value.trim() : "";
      const newPreset = adminPresetUrl ? adminPresetUrl.value.trim() : "";
      const newUrl = adminSheetUrl ? adminSheetUrl.value.trim() : "";
      const acceptAny = adminAcceptAny ? adminAcceptAny.checked : false;

      if (newCode) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_CODE, newCode);
      }
      if (newPreset) {
        localStorage.setItem(STORAGE_KEYS.PRESET_URL, newPreset);
        if (linkPresetIg) linkPresetIg.href = newPreset;
      }
      localStorage.setItem(STORAGE_KEYS.SHEET_URL, newUrl);
      localStorage.setItem(STORAGE_KEYS.ACCEPT_ANY, acceptAny ? "true" : "false");

      alert("Pengaturan panitia berhasil disimpan!");
      if (adminModal) adminModal.style.display = "none";
    });
  }

  // Export CSV
  const btnExportCsv = document.getElementById("btnExportCsv");
  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", () => {
      const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || "[]");
      if (submissions.length === 0) {
        alert("Belum ada data jawaban yang tersimpan di browser.");
        return;
      }

      const headers = [
        "Timestamp", 
        "ID Tiket", 
        "Nama Lengkap", 
        "NIP", 
        "Unit Organisasi", 
        "Unit Kerja", 
        "Nomor WhatsApp", 
        "Akun Instagram", 
        "File Bukti Story",
        "Kode Jawaban", 
        "Status"
      ];
      
      const rows = submissions.map(s => [
        `"${s.timestamp || ''}"`,
        `"${s.ticketId || ''}"`,
        `"${s.fullName || ''}"`,
        `"${s.nip || ''}"`,
        `"${s.orgUnit || ''}"`,
        `"${s.workUnit || ''}"`,
        `"${s.whatsapp || ''}"`,
        `"${s.instagram || ''}"`,
        `"${s.storyFileName || 'Terunggah'}"`,
        `"${s.codeAnswer || ''}"`,
        `"${s.status || ''}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Jawaban-Detektif-Grya-${Date.now()}.csv`;
      link.click();
    });
  }

  // Clear Local Data
  const btnClearLocalData = document.getElementById("btnClearLocalData");
  if (btnClearLocalData) {
    btnClearLocalData.addEventListener("click", () => {
      if (confirm("Yakin ingin menghapus seluruh arsip jawaban peserta yang tersimpan di browser ini?")) {
        localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
        const localSubmissionsCount = document.getElementById("localSubmissionsCount");
        if (localSubmissionsCount) localSubmissionsCount.textContent = "0";
        alert("Cache jawaban berhasil dibersihkan.");
      }
    });
  }

  // Click outside modal backdrop to close (except success)
  [posterModal, errorModal, adminModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

});
