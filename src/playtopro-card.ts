// Stand-alone custom Lovelace card for Home Assistant
// Build as a single ES module (dist/playtopro-card.js) and load as a resource.

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity } from "home-assistant-js-websocket";
import type { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers";
import { fireEvent } from "custom-card-helpers";

// --- Types -------------------------------------------------------------------

export interface PlayToProCardConfig extends LovelaceCardConfig {
  device_id: string;
}

export interface GroupConfig {
  name: string;
  icon: string;
  entity_id?: string;
  information?: string;
  entities: string[];
}

export interface PlayToProConfig {
  eco_mode_factor: string;
  eco_mode: string;
  zones: string[];
  groups: GroupConfig[];
}

interface ShowNotificationEventDetail {
  message: string;
  duration?: number;
}

// --- Hard-coded entity mapping (can be moved to user config later) -----------

const entityConfig: PlayToProConfig = {
  eco_mode_factor: "sensor.eco_mode_factor",
  eco_mode: "switch.eco_mode",
  zones: [
    "sensor.zone_01",
    "sensor.zone_02",
    "sensor.zone_03",
    "sensor.zone_04",
    "sensor.zone_05",
    "sensor.zone_06",
    "sensor.zone_07",
    "sensor.zone_08",
  ],
  groups: [
    {
      name: "Auto Mode",
      icon: "mdi:checkbox-marked-circle-auto-outline",
      entity_id: "switch.auto_mode",
      information:
        "Turn on to use the schedule set in the lichen play app, turn off to schedule using Home Assistant",
      entities: [
        "switch.zone_01_auto_mode",
        "switch.zone_02_auto_mode",
        "switch.zone_03_auto_mode",
        "switch.zone_04_auto_mode",
        "switch.zone_05_auto_mode",
        "switch.zone_06_auto_mode",
        "switch.zone_07_auto_mode",
        "switch.zone_08_auto_mode",
      ],
    },
    {
      name: "Eco Mode",
      icon: "mdi:leaf",
      entity_id: "switch.eco_mode",
      information:
        "Turn on eco mode to save water during cooler and wet weather",
      entities: [
        "switch.zone_01_eco_mode",
        "switch.zone_02_eco_mode",
        "switch.zone_03_eco_mode",
        "switch.zone_04_eco_mode",
        "switch.zone_05_eco_mode",
        "switch.zone_06_eco_mode",
        "switch.zone_07_eco_mode",
        "switch.zone_08_eco_mode",
      ],
    },
    {
      name: "Sleep Mode",
      icon: "mdi:sleep",
      entities: [
        "switch.zone_01_sleep_mode",
        "switch.zone_02_sleep_mode",
        "switch.zone_03_sleep_mode",
        "switch.zone_04_sleep_mode",
        "switch.zone_05_sleep_mode",
        "switch.zone_06_sleep_mode",
        "switch.zone_07_sleep_mode",
        "switch.zone_08_sleep_mode",
      ],
    },
    {
      name: "Manual Mode",
      icon: "mdi:run",
      entities: [
        "switch.zone_01_manual_mode",
        "switch.zone_02_manual_mode",
        "switch.zone_03_manual_mode",
        "switch.zone_04_manual_mode",
        "switch.zone_05_manual_mode",
        "switch.zone_06_manual_mode",
        "switch.zone_07_manual_mode",
        "switch.zone_08_manual_mode",
      ],
    },
  ],
};

// --- Card implementation -----------------------------------------------------

@customElement("playtopro-card")
export class PlaytoproCard extends LitElement {
  static styles = css`
    ha-card {
      padding: 16px;
    }
    .entity {
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    ha-icon {
      color: var(--primary-color);
      margin-left: 8px;
      vertical-align: middle;
    }
    @keyframes pulse {
      0% {
        opacity: 1;
      }
      30% {
        opacity: 0.4;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 1;
      }
    }
    ha-icon.pulsing {
      animation: pulse 2.5s infinite;
    }
    ha-icon.off {
      color: var(--disabled-text-color);
      opacity: 0.6;
    }
    ha-control-select ha-icon {
      vertical-align: middle;
      color: var(--primary-color);
    }
  `;

  // Home Assistant instance is assigned by Lovelace
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public config!: PlayToProCardConfig;

  @state() private _selectedGroup = 0;
  @state() private _deviceId?: string;
  @state() private _deviceEntities: any[] = [];
  @state() private _loading = true;

  public setConfig(config: PlayToProCardConfig): void {
    if (!config.device_id) {
      throw new Error("device_id is required");
    }
    this.config = config;
    this._deviceId = config.device_id;
    this._bootstrap();
  }

  // Initial fetch (device + entities)
  private async _bootstrap() {
    if (!this.hass || !this._deviceId) return;
    this._loading = true;

    try {
      // Load device registry
      const devices = await this.hass.callWS<any[]>({
        type: "config/device_registry/list",
      });
      const device = devices.find((d) => d.id === this._deviceId);
      if (!device) {
        // No device found—still render so user sees something
        this._deviceEntities = [];
        this._loading = false;
        this.requestUpdate();
        return;
      }

      // Load entity registry for that device
      const entities = await this.hass.callWS<any[]>({
        type: "config/entity_registry/list",
      });
      this._deviceEntities = entities.filter((e) => e.device_id === this._deviceId);
    } catch (_e) {
      // Non-admin or WS error
      this._deviceEntities = [];
    } finally {
      this._loading = false;
    }
  }

  // Switch between groups
  private _groupChanged(e: CustomEvent) {
    const n = Number(e.detail.value);
    if (!Number.isNaN(n)) this._selectedGroup = n;
  }

  private _entityClicked(e: Event) {
    const target = e.currentTarget as HTMLElement;
    const entityId = target.dataset.entityId;
    if (entityId) {
      fireEvent(this, "hass-more-info", { entityId });
    }
  }

  private _informationClicked = (e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const information = target.dataset.information?.trim();
    if (!information) return;

    // Unofficial, but commonly handled toast; see note in README.
    const evt = new CustomEvent<ShowNotificationEventDetail>("hass-notification", {
      detail: { message: information, duration: 8000 },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(evt);
  };

  private async _toggleEntity(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const entityId = target.dataset.entityId;
    if (!entityId) return;
    await this.hass.callService("switch", target.checked ? "turn_on" : "turn_off", {
      entity_id: entityId,
    });
  }

  private _getIconForState(value: string): string {
    // Your original mapping
    switch ((value ?? "").toLowerCase()) {
      case "true":
        return "mdi:sprinkler-variant";
      case "false":
        return "mdi:sprout";
      default:
        return "mdi:help-circle";
    }
  }

  // Render --------------------------------------------------------------------

  protected render() {
    if (this._loading) {
      return html`<ha-card><div>Loading entities…</div></ha-card>`;
    }

    const groupConfig: GroupConfig = entityConfig.groups[this._selectedGroup];
    const groupEntityState: HassEntity | undefined = groupConfig.entity_id
      ? this.hass.states[groupConfig.entity_id]
      : undefined;

    return html`
      <ha-card>
        <ha-control-select
          fixedMenuPosition
          naturalMenuWidth
          .value=${String(this._selectedGroup)}
          @value-changed=${this._groupChanged}
          .options=${entityConfig.groups.map((group, index) => ({
            value: String(index),
            icon: html`<ha-icon icon=${group.icon}></ha-icon>`,
          }))}
        >
        </ha-control-select>

        <div class="content">
          <div class="entity">
            <span>${groupConfig.name}</span>
            <div style="display:flex;align-items:center;">
              ${groupEntityState
                ? html`
                    <ha-switch
                      .checked=${groupEntityState.state === "on"}
                      data-entity-id=${groupConfig.entity_id ?? ""}
                      @change=${this._toggleEntity}
                    ></ha-switch>
                    <ha-icon
                      role="img"
                      aria-label="Information"
                      style="cursor:pointer"
                      icon="mdi:information"
                      data-information=${groupConfig.information ?? ""}
                      @click=${this._informationClicked}
                    ></ha-icon>
                  `
                : html``}
            </div>
          </div>

          ${entityConfig.zones.map((zoneId, index) => {
            const zoneEntity = this._deviceEntities.find((e) => e.entity_id === zoneId);
            if (!zoneEntity) return html``;

            const zoneState: HassEntity | undefined = this.hass.states[zoneId];

            const groupZoneId =
              entityConfig.groups[this._selectedGroup].entities[index];
            const groupZoneState: HassEntity | undefined =
              groupZoneId ? this.hass.states[groupZoneId] : undefined;

            if (!zoneState || !groupZoneId || !groupZoneState) return html``;

            return html`
              <div class="entity">
                <span
                  style="cursor:pointer"
                  @click=${this._entityClicked}
                  data-entity-id=${zoneId}
                >
                  ${zoneState.attributes.friendly_name ?? zoneId}
                </span>
                <div style="display:flex;align-items:center;">
                  <ha-switch
                    .checked=${groupZoneState.state === "on"}
                    .disabled=${groupEntityState?.state === "off"}
                    data-entity-id=${groupZoneId}
                    @change=${this._toggleEntity}
                  ></ha-switch>
                  <ha-icon
                    role="img"
                    aria-label="${(zoneState.attributes.friendly_name ?? zoneId)} is ${zoneState.state}"
                    icon=${this._getIconForState(zoneState.state)}
                  ></ha-icon>
                </div>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  // Optional: minimal editor (see editor file below)
  static async getConfigElement() {
    return document.createElement("playtopro-card-editor");
  }

  // Shows in the card picker in UI
  public static getStubConfig(): PlayToProCardConfig {
    return { type: "playtopro-card", device_id: "" };
  }

  // Grid sizing for sections view (optional), masonry size for classic
  public getCardSize(): number {
    return 2 + entityConfig.zones.length;
  }
}

// Register card metadata for the picker
declare global {
  interface HTMLElementTagNameMap {
    "playtopro-card": PlaytoproCard;
  }
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "playtopro-card",
  name: "PlayToPro Card",
  description: "Control PlayToPro zones/groups (Auto, Eco, Sleep, Manual).",
});