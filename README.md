# PlayToPro Card

A custom Lovelace card for **Home Assistant** to view and control PlayToPro zones and group modes (Auto, Eco, Sleep, Manual).  
Single‑file build; works with **HACS** (Dashboard/Plugin) or **manual** resource.

---

## ✨ Features

- Zone list with friendly names and live state icon
- Group-mode header with switch and info popover (Auto/Eco/Sleep/Manual)
- Device‑bound (select your controller in the card editor)
- One JS file (`playtopro-card.js`)—fast to install/update

---

## 📦 Installation

### A) HACS (recommended)

1. Install HACS: https://hacs.xyz  
2. Until this repo is in the default store, add it as a **Custom repository**:  
   **HACS → Frontend → (⋮) → Custom repositories**  
   URL: `https://github.com/playtopro/playtopro-card`, Type: **Dashboard** → **Add**, then **Download**.
3. HACS installs under `/hacsfiles/...` and typically **registers the resource automatically**, so you can use the card right away.

### B) Manual

1. Download **`playtopro-card.js`** from the latest GitHub Release and copy it to `/config/www/`.
2. Add a Lovelace **Resource**:
   - **UI**: **Settings → Dashboards → (⋮) → Resources → Add resource**  
     URL: `/local/playtopro-card.js`, Type: **JavaScript Module**  
     > The **Resources** screen is shown when your user has **Advanced Mode** enabled.
   - **YAML mode**:
     ```yaml
     lovelace:
       resources:
         - url: /local/playtopro-card.js
           type: module
     ```

---

## 🧩 Usage

Minimal card config:

```yaml
type: custom:playtopro-card
device_id: YOUR_DEVICE_ID