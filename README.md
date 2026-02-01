# PlayToPro Card

Custom Lovelace card for Home Assistant.

## Installation

### A) HACS (recommended)
1. Install HACS: https://hacs.xyz/  
2. Until this repo is in the default store, add it as a **Custom repository**:  
   HACS → **Frontend** → ⋮ → **Custom repositories** → URL: `https://github.com/playtopro/playtopro-card`, Type: **Plugin** → **Add**. Then **Download**.  
   > HACS supports custom repositories for plugins like lovelace cards.  
3. HACS places files under `/hacsfiles/...` and will typically **register the resource automatically**, so you can use the card immediately.

### B) Manual
1. Download `playtopro-card.js` from the latest GitHub Release and copy it to `config/www/`.  
2. Add a Lovelace **resource**:
   - UI: **Settings → Dashboards → (⋮) → Resources → Add resource**  
     URL: `/local/playtopro-card.js`, Type: **JavaScript Module**  
     > The Resources screen is visible when your user has **Advanced Mode** enabled.
   - Or YAML mode:
     ```yaml
     lovelace:
       resources:
         - url: /local/playtopro-card.js
           type: module
     ```

## Usage

```yaml
type: custom:playtopro-card
device_id: YOUR_DEVICE_ID