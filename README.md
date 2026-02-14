# Projektbezogene Unterweisung - Janning Group

Progressive Web App (PWA) für die Baustellenanmeldung BG BAU mit automatischer n8n-Integration.

## 📦 Dateien

- `index.html` - Hauptformular
- `style.css` - Janning Group Styling
- `script.js` - Frontend-Logik mit Vorlagen und Kartenintegration
- `manifest.json` - PWA-Konfiguration
- `service-worker.js` - Offline-Funktionalität
- `icon-192.png` - App-Icon (192x192)
- `icon-512.png` - App-Icon (512x512)
- `n8n-webhook-handler.js` - n8n Code Node zur Datenverarbeitung

## 🚀 GitHub Pages Installation

### 1. Repository erstellen
```bash
# Neues Repository auf GitHub erstellen
# Name: projektbezogene-unterweisung

# Dateien hochladen
git init
git add .
git commit -m "Initial commit: Projektbezogene Unterweisung PWA"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/projektbezogene-unterweisung.git
git push -u origin main
```

### 2. GitHub Pages aktivieren
1. Gehe zu **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → Ordner: **/ (root)**
4. Klicke auf **Save**

### 3. URL
Deine App ist verfügbar unter:
```
https://DEIN-USERNAME.github.io/projektbezogene-unterweisung/
```

## 📱 PWA auf Handy installieren

### Android (Chrome)
1. Öffne die Webseite in Chrome
2. Tippe auf das Menü (⋮)
3. Wähle **"Zum Startbildschirm hinzufügen"**
4. Bestätige den App-Namen
5. Die App erscheint als Icon auf dem Homescreen

### iOS (Safari)
1. Öffne die Webseite in Safari
2. Tippe auf das Teilen-Symbol (⎙)
3. Scrolle nach unten und wähle **"Zum Home-Bildschirm"**
4. Bestätige den App-Namen
5. Die App erscheint als Icon auf dem Homescreen

## 🔧 n8n Workflow einrichten

### 1. Webhook Node
- **Method**: POST
- **Path**: `/webhook/368921c2-1f7c-4c9c-911e-713601dd76d5`
- **Response Code**: 200

### 2. Code Node
1. Erstelle einen **Code** Node
2. Kopiere den Inhalt von `n8n-webhook-handler.js`
3. Füge den Code ein

### 3. Switch Node
- **Mode**: Expression
- **Value 1**: `{{ $json.processed.formular_typ }}`
- **Rules**:
  - Route 1: `ProjektbezogeneUnterweisung`
  - Route 2: [andere Formulare wenn vorhanden]

### 4. Email Node (nach Switch)
- **To**: `{{ $json.email.to }}`
- **CC**: `{{ $json.email.cc }}`
- **Subject**: `{{ $json.email.subject }}`
- **Email Type**: HTML
- **Text**: `{{ $json.email.body_html }}`

### 5. Optional: Datenbank/Sheets
Speichere Daten aus `{{ $json.processed }}` in Google Sheets oder Datenbank.

## ✨ Funktionen

### 🎯 Vorlagen für Tätigkeiten
Klicke auf eine Tätigkeit, um das Formular automatisch vorzufüllen:
- **Magazin & Werkstatt**
- **Rohrbauarbeiten**
- **Tiefbauarbeiten**
- **Horizontalbohrung**
- **Fernwärmeleitungen**
- **Glasfaser**

### 📋 Mitarbeiter-Tabelle
- Interaktive Tabelle mit Eingabefeldern
- **Zeilen hinzufügen** per Button
- **Zeilen löschen** per X-Button
- Platz für Unterschriften (60px hoch)
- Automatische Nummerierung
- Datum wird automatisch gesetzt
- **Drucken-Funktion** für Unterschriften vor Ort

### 🗺️ Kartenintegration
- Klicke auf "Karte öffnen"
- Suche nach Adresse oder klicke auf Karte
- Position wird automatisch gespeichert

### 📧 Automatische Zustellung
- Formular wird an n8n Webhook gesendet
- Email wird automatisch generiert und versendet
- Mitarbeiter-Tabelle als HTML-Tabelle in Email
- Alle Daten werden strukturiert übermittelt

### 🖨️ Druck-Funktion
- **Drucken-Button** zum Ausdrucken des Formulars
- Unterschriften-Boxen werden größer (80px)
- Optimiertes Print-Layout
- Perfekt für Unterschriften vor Ort

### 💾 Offline-Funktionalität
- PWA funktioniert auch ohne Internet
- Daten werden zwischengespeichert
- Synchronisierung bei Verbindung

## 📋 Formularfelder

### Pflichtfelder (*)
- Datum (automatisch)
- E-Mail-Adresse
- Name des Arbeitsverantwortlichen
- Firma (mind. eine)
- Baustelle (mit Karte)
- Arbeitgeber
- Mitarbeiter Anzahl
- Nachunternehmer (Ja/Nein)
- Fachkraft für Arbeitssicherheit
- Betriebsarzt
- Sicherheitsbeauftragter
- Ersthelfer

### Optionale Felder
- Auftragsnummer
- Bauvorhaben
- Projekt-Nr.
- Projektname
- Sub-Details (wenn Nachunternehmer = Ja)

### Mitarbeiter-Tabelle
Die Tabelle hat folgende Spalten:
- **Nr.** - Automatische Nummerierung
- **Name, Vorname** - Texteingabe
- **Tätigkeit / Fremdfirma** - Texteingabe
- **Datum** - Datumswahl (automatisch heutiges Datum)
- **Unterschrift Mitarbeiter** - Platz für handschriftliche Unterschrift (beim Ausdrucken)
- **Unterschrift Bauleiter** - Platz für handschriftliche Unterschrift (beim Ausdrucken)

Funktionen:
- ➕ **Zeile hinzufügen** - Button zum Hinzufügen weiterer Mitarbeiter
- ❌ **Zeile löschen** - X-Button zum Entfernen von Zeilen
- 🖨️ **Drucken** - Formular ausdrucken mit Platz für Unterschriften

## 🎨 Design

Das Formular nutzt das **Janning Group Corporate Design**:
- Farben: Schwarz (#1a1a18) und Orange (#e8610a)
- Schriftarten: Barlow & Barlow Condensed
- Responsive Design für Desktop und Mobile
- Industrial-Professional Look

## 🔒 Sicherheit

- HTTPS erforderlich für PWA-Installation
- Service Worker nur über HTTPS
- Daten werden verschlüsselt an n8n gesendet
- Keine lokale Speicherung sensibler Daten

## 🛠️ Anpassungen

### Webhook-URL ändern
In `script.js` Zeile 7:
```javascript
const WEBHOOK_URL = 'DEINE-N8N-URL';
```

### Vorlagen anpassen
In `script.js` ab Zeile 13:
```javascript
const TEMPLATES = {
  // Passe die Vorlagen an...
}
```

### Styling ändern
In `style.css`:
```css
:root {
  --accent: #e8610a; /* Orange */
  --header-bg: #1a1a18; /* Schwarz */
  /* ... weitere Farben ... */
}
```

## 📞 Support

Bei Fragen oder Problemen:
- **E-Mail**: sgu@janning-group.de
- **GitHub Issues**: Im Repository

## 📄 Lizenz

© 2026 Janning Group - Alle Rechte vorbehalten

---

**Erstellt von**: Rahim Ahangarzadeh  
**Version**: 1.0.0  
**Datum**: Februar 2026
