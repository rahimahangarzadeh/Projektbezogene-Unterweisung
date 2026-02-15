// ============================================================
// PROJEKTBEZOGENE UNTERWEISUNG - JANNING GROUP
// script.js
// ============================================================

const WEBHOOK_URL = 'https://n8n.node.janning-it.de/webhook/368921c2-1f7c-4c9c-911e-713601dd76d5';
const FORM_TYPE = 'ProjektbezogeneUnterweisung';

// ============================================================
// VORLAGEN FÜR TÄTIGKEITEN
// ============================================================

const TEMPLATES = {
  magazin: {
    bauvorhaben: 'Magazin & Werkstatt - Wartungsarbeiten',
    projektname: 'Interne Wartung',
    arbeitgeber: 'Janning Tiefbau GmbH',
    firma: ['Janning Tiefbau']
  },
  rohrbau: {
    bauvorhaben: 'Rohrbauarbeiten',
    projektname: 'Rohrverlegung und -sanierung',
    arbeitgeber: 'Janning Rohrbau GmbH',
    firma: ['Janning Rohrbau']
  },
  tiefbau: {
    bauvorhaben: 'Tiefbauarbeiten',
    projektname: 'Straßen- und Kanalbau',
    arbeitgeber: 'Janning Tiefbau GmbH',
    firma: ['Janning Tiefbau']
  },
  horizontal: {
    bauvorhaben: 'Horizontalbohrung',
    projektname: 'Unterirdische Leitungsverlegung',
    arbeitgeber: 'Janning Bohrtechnik GmbH',
    firma: ['Janning Bohrtechnik']
  },
  fernwaerme: {
    bauvorhaben: 'Fernwärmeleitungen',
    projektname: 'Fernwärmenetz - Installation',
    arbeitgeber: 'Janning Rohrbau GmbH',
    firma: ['Janning Rohrbau']
  },
  glasfaser: {
    bauvorhaben: 'Glasfaserverlegung',
    projektname: 'Breitbandausbau',
    arbeitgeber: 'Janning Tiefbau GmbH',
    firma: ['Janning Tiefbau', 'Janning Bohrtechnik']
  }
};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initForm();
  initTemplateButtons();
  initNachunternehmerToggle();
  initMapModal();
  initEmployeeTable();
  initFormSubmit();
  registerServiceWorker();
});

// ============================================================
// FORM INITIALIZATION
// ============================================================

function initForm() {
  // Set current date/time
  const now = new Date();
  const dateInput = document.getElementById('datum');
  dateInput.value = formatDateTimeLocal(now);
  
  // Set default Baustelle address
  const baustelleInput = document.getElementById('baustelle');
  baustelleInput.value = 'J.-D.-Lauenstein-Str. 24, 49767 Twist';
}

function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// ============================================================
// TEMPLATE BUTTONS
// ============================================================

function initTemplateButtons() {
  const buttons = document.querySelectorAll('.template-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const templateKey = btn.dataset.template;
      applyTemplate(templateKey);
    });
  });
}

function applyTemplate(templateKey) {
  const template = TEMPLATES[templateKey];
  if (!template) return;

  // Apply text fields
  if (template.bauvorhaben) {
    document.getElementById('bauvorhaben').value = template.bauvorhaben;
  }
  if (template.projektname) {
    document.getElementById('projektname').value = template.projektname;
  }
  if (template.arbeitgeber) {
    document.getElementById('arbeitgeber').value = template.arbeitgeber;
  }

  // Apply firma checkboxes
  if (template.firma) {
    const checkboxes = document.querySelectorAll('input[name="firma"]');
    checkboxes.forEach(cb => {
      cb.checked = template.firma.includes(cb.value);
    });
  }

  // Visual feedback
  const allButtons = document.querySelectorAll('.template-btn');
  allButtons.forEach(b => b.style.opacity = '0.6');
  const clickedBtn = document.querySelector(`[data-template="${templateKey}"]`);
  if (clickedBtn) {
    clickedBtn.style.opacity = '1';
    setTimeout(() => {
      allButtons.forEach(b => b.style.opacity = '1');
    }, 1500);
  }
}

// ============================================================
// NACHUNTERNEHMER TOGGLE
// ============================================================

function initNachunternehmerToggle() {
  const jaRadio = document.getElementById('nachunternehmer_ja');
  const neinRadio = document.getElementById('nachunternehmer_nein');
  const subFields = document.getElementById('sub_fields');
  const subNameInput = document.getElementById('sub_name');
  const subMitarbeiterInput = document.getElementById('sub_mitarbeiter_anzahl');
  const subNameLabel = document.getElementById('sub_name_label');
  const subMitarbeiterLabel = document.getElementById('sub_mitarbeiter_label');

  jaRadio.addEventListener('change', () => {
    if (jaRadio.checked) {
      subFields.classList.remove('hidden');
      // Felder werden Pflichtfelder
      subNameInput.required = true;
      subMitarbeiterInput.required = true;
      subNameLabel.classList.add('required');
      subMitarbeiterLabel.classList.add('required');
    }
  });

  neinRadio.addEventListener('change', () => {
    if (neinRadio.checked) {
      subFields.classList.add('hidden');
      // Felder sind nicht mehr Pflichtfelder
      subNameInput.required = false;
      subMitarbeiterInput.required = false;
      subNameLabel.classList.remove('required');
      subMitarbeiterLabel.classList.remove('required');
      // Werte löschen
      subNameInput.value = '';
      subMitarbeiterInput.value = '';
    }
  });
}

// ============================================================
// EMPLOYEE TABLE
// ============================================================

let employeeRowCount = 3;

function initEmployeeTable() {
  const addBtn = document.getElementById('addEmployeeRow');
  const tableBody = document.getElementById('employeeTableBody');

  // Add row button
  addBtn.addEventListener('click', () => {
    employeeRowCount++;
    const newRow = createEmployeeRow(employeeRowCount);
    tableBody.appendChild(newRow);
    attachDeleteHandler(newRow);
  });

  // Attach delete handlers to existing rows
  const existingRows = tableBody.querySelectorAll('.employee-row');
  existingRows.forEach(row => attachDeleteHandler(row));

  // Set default dates for existing rows
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = tableBody.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) {
      input.value = today;
    }
  });
}

function createEmployeeRow(rowNum) {
  const row = document.createElement('tr');
  row.className = 'employee-row';
  row.dataset.row = rowNum;

  const today = new Date().toISOString().split('T')[0];

  row.innerHTML = `
    <td class="row-number">${rowNum}</td>
    <td><input type="text" class="table-input" name="employee_name_${rowNum}"></td>
    <td><input type="text" class="table-input" name="employee_task_${rowNum}"></td>
    <td><input type="date" class="table-input" name="employee_date_${rowNum}" value="${today}"></td>
    <td style="text-align: center;">
      <label class="check-item" style="justify-content: center; margin: 0;">
        <input type="checkbox" name="employee_subcontractor_${rowNum}">
        <span class="check-box"></span>
      </label>
    </td>
    <td class="signature-cell">
      <div class="signature-box"></div>
    </td>
    <td class="signature-cell">
      <div class="signature-box"></div>
    </td>
    <td>
      <button type="button" class="delete-row-btn" title="Zeile löschen">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </td>
  `;

  return row;
}

function attachDeleteHandler(row) {
  const deleteBtn = row.querySelector('.delete-row-btn');
  deleteBtn.addEventListener('click', () => {
    const tableBody = document.getElementById('employeeTableBody');
    const rows = tableBody.querySelectorAll('.employee-row');
    
    // Don't delete if it's the last row
    if (rows.length <= 1) {
      alert('Mindestens eine Zeile muss vorhanden sein.');
      return;
    }

    row.remove();
    renumberRows();
  });
}

function renumberRows() {
  const tableBody = document.getElementById('employeeTableBody');
  const rows = tableBody.querySelectorAll('.employee-row');
  
  rows.forEach((row, index) => {
    const newNum = index + 1;
    row.dataset.row = newNum;
    row.querySelector('.row-number').textContent = newNum;
    
    // Update input names
    const nameInput = row.querySelector('input[type="text"]:nth-of-type(1)');
    const taskInput = row.querySelector('input[type="text"]:nth-of-type(2)');
    const dateInput = row.querySelector('input[type="date"]');
    const subcontractorCheckbox = row.querySelector('input[type="checkbox"]');
    
    if (nameInput) nameInput.name = `employee_name_${newNum}`;
    if (taskInput) taskInput.name = `employee_task_${newNum}`;
    if (dateInput) dateInput.name = `employee_date_${newNum}`;
    if (subcontractorCheckbox) subcontractorCheckbox.name = `employee_subcontractor_${newNum}`;
  });
  
  employeeRowCount = rows.length;
}

// ============================================================
// MAP MODAL & LEAFLET
// ============================================================

let map = null;
let marker = null;
let selectedLocation = null;

function initMapModal() {
  const openBtn = document.getElementById('openMapBtn');
  const closeBtn = document.getElementById('closeMapBtn');
  const modal = document.getElementById('mapModal');
  const confirmBtn = document.getElementById('confirmLocationBtn');
  const searchBtn = document.getElementById('mapSearchBtn');
  const searchInput = document.getElementById('mapSearchInput');

  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    if (!map) {
      initLeafletMap();
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  confirmBtn.addEventListener('click', () => {
    if (selectedLocation) {
      document.getElementById('baustelle').value = selectedLocation.address;
      document.getElementById('baustelle_lat').value = selectedLocation.lat;
      document.getElementById('baustelle_lng').value = selectedLocation.lng;
      modal.classList.add('hidden');
    }
  });

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      searchAddress(query);
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBtn.click();
    }
  });
}

function initLeafletMap() {
  // Initialize map centered on Germany
  map = L.map('leafletMap').setView([52.52, 10.4], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Click to select location
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    setMarker(lat, lng);
    reverseGeocode(lat, lng);
  });

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
}

function setMarker(lat, lng) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker([lat, lng]).addTo(map);
  selectedLocation = { lat, lng, address: '' };
}

async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await response.json();
    if (data && data.display_name) {
      selectedLocation.address = data.display_name;
      document.getElementById('selectedAddr').textContent = data.display_name;
      document.getElementById('selectedAddr').classList.add('has-addr');
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    selectedLocation.address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    document.getElementById('selectedAddr').textContent = selectedLocation.address;
    document.getElementById('selectedAddr').classList.add('has-addr');
  }
}

async function searchAddress(query) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
    const data = await response.json();
    if (data && data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      map.setView([lat, lng], 14);
      setMarker(lat, lng);
      selectedLocation.address = result.display_name;
      document.getElementById('selectedAddr').textContent = result.display_name;
      document.getElementById('selectedAddr').classList.add('has-addr');
    } else {
      alert('Adresse nicht gefunden. Bitte versuchen Sie es erneut.');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    alert('Fehler bei der Adresssuche.');
  }
}

// ============================================================
// FORM SUBMISSION
// ============================================================

function initFormSubmit() {
  const form = document.getElementById('mainForm');
  form.addEventListener('submit', handleSubmit);

  // Print button
  const printBtn = document.getElementById('printBtn');
  printBtn.addEventListener('click', () => {
    window.print();
  });
}

async function handleSubmit(e) {
  e.preventDefault();

  // Clear previous messages
  const messageEl = document.getElementById('formMessage');
  messageEl.classList.add('hidden');
  messageEl.textContent = '';

  // Validate required fields
  if (!validateForm()) {
    showMessage('Bitte füllen Sie alle Pflichtfelder (*) aus.', 'error');
    return;
  }

  // Collect form data
  const formData = collectFormData();

  // Submit to webhook
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="spinner"></span>
    Wird gesendet...
  `;

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      showMessage('Formular erfolgreich übermittelt!', 'success');
      // Reset form after 2 seconds
      setTimeout(() => {
        document.getElementById('mainForm').reset();
        initForm();
      }, 2000);
    } else {
      throw new Error('Server responded with error');
    }
  } catch (error) {
    console.error('Submission error:', error);
    showMessage('Fehler beim Absenden. Bitte versuchen Sie es erneut.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 11 12 14 22 4"></polyline>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
      Formular absenden
    `;
  }
}

function validateForm() {
  const requiredFields = document.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    field.classList.remove('invalid');
    
    if (field.type === 'checkbox' || field.type === 'radio') {
      const name = field.name;
      const group = document.querySelectorAll(`[name="${name}"]`);
      const hasChecked = Array.from(group).some(el => el.checked);
      if (!hasChecked && name === 'firma') {
        isValid = false;
        group.forEach(el => {
          const parent = el.closest('.checkbox-group') || el.closest('.radio-group');
          if (parent) parent.style.outline = '2px solid #e83a3a';
        });
      }
    } else if (!field.value.trim()) {
      field.classList.add('invalid');
      isValid = false;
    }
  });

  return isValid;
}

function collectFormData() {
  const data = {
    formular_typ: FORM_TYPE,
    datum: document.getElementById('datum').value,
    email: document.getElementById('email').value,
    arbeitsverantwortlicher: document.getElementById('arbeitsverantwortlicher').value,
    firma: getCheckedValues('firma'),
    baustelle: document.getElementById('baustelle').value,
    baustelle_lat: document.getElementById('baustelle_lat').value,
    baustelle_lng: document.getElementById('baustelle_lng').value,
    arbeitgeber: document.getElementById('arbeitgeber').value,
    auftragsnummer: document.getElementById('auftragsnummer').value,
    bauvorhaben: document.getElementById('bauvorhaben').value,
    projekt_nr: document.getElementById('projekt_nr').value,
    projektname: document.getElementById('projektname').value,
    mitarbeiter_anzahl: document.getElementById('mitarbeiter_anzahl').value,
    nachunternehmer: getRadioValue('nachunternehmer'),
    sub_name: document.getElementById('sub_name').value,
    sub_mitarbeiter_anzahl: document.getElementById('sub_mitarbeiter_anzahl').value,
    fachkraft: document.getElementById('fachkraft').value,
    betriebsarzt: document.getElementById('betriebsarzt').value,
    sicherheitsbeauftragter: document.getElementById('sicherheitsbeauftragter').value,
    ersthelfer: document.getElementById('ersthelfer').value,
    mitarbeiter_liste: collectEmployeeTableData()
  };

  return data;
}

function collectEmployeeTableData() {
  const tableBody = document.getElementById('employeeTableBody');
  const rows = tableBody.querySelectorAll('.employee-row');
  const employees = [];

  rows.forEach((row, index) => {
    const rowNum = index + 1;
    const nameInput = row.querySelector(`input[name="employee_name_${rowNum}"]`);
    const taskInput = row.querySelector(`input[name="employee_task_${rowNum}"]`);
    const dateInput = row.querySelector(`input[name="employee_date_${rowNum}"]`);
    const subcontractorCheckbox = row.querySelector(`input[name="employee_subcontractor_${rowNum}"]`);

    const name = nameInput ? nameInput.value.trim() : '';
    const task = taskInput ? taskInput.value.trim() : '';
    const date = dateInput ? dateInput.value : '';
    const isSubcontractor = subcontractorCheckbox ? subcontractorCheckbox.checked : false;

    // Only add if at least name is filled
    if (name) {
      employees.push({
        nr: rowNum,
        name: name,
        task: task,
        date: date,
        isSubcontractor: isSubcontractor
      });
    }
  });

  return employees;
}

function getCheckedValues(name) {
  const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
  return Array.from(checkboxes).map(cb => cb.value);
}

function getRadioValue(name) {
  const radio = document.querySelector(`input[name="${name}"]:checked`);
  return radio ? radio.value : '';
}

function showMessage(text, type) {
  const messageEl = document.getElementById('formMessage');
  messageEl.textContent = text;
  messageEl.className = `form-message ${type}`;
  messageEl.classList.remove('hidden');
  messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================================
// SERVICE WORKER REGISTRATION
// ============================================================

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  }
}

// ============================================================
// AUTO-HIDE HEADER ON SCROLL
// ============================================================
let lastScrollTop = 0;
let scrollThreshold = 100; // Erst nach 100px scrollen reagieren
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Nur reagieren wenn genug gescrollt wurde
  if (Math.abs(scrollTop - lastScrollTop) < 5) return;
  
  if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
    // Runterscrollen - Header verstecken
    header.classList.add('header-hidden');
  } else {
    // Hochscrollen - Header zeigen
    header.classList.remove('header-hidden');
  }
  
  lastScrollTop = scrollTop;
});
