import { LitElement, html, nothing, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";
import type { PlayToProCardConfig } from "../playtopro-card";

// Optional: a minimal local type for the device filter
type DeviceRegistryEntryLite = {
  id: string;
  model?: string;
  name?: string;
  manufacturer?: string;
};

@customElement("playtopro-card-editor")
export class PlayToProCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config?: PlayToProCardConfig;

  static styles = css`
    .card-config {
      display: grid;
      gap: 12px;
      padding: 8px 0;
    }
  `;

  public setConfig(config: PlayToProCardConfig): void {
    this.config = config;
  }

  // Only show devices whose model matches your controller
  private _deviceFilter = (device: DeviceRegistryEntryLite): boolean =>
    (device?.model ?? "").toLowerCase() === "lichen play";

  protected render() {
    if (!this.config) return nothing;

    return html`
      <div class="card-config">
        <!-- <ha-device-picker> is provided by HA at runtime; no import needed -->
        <ha-device-picker
          .hass=${this.hass}
          .value=${this.config.device_id}
          .deviceFilter=${this._deviceFilter}
          @value-changed=${this._deviceChanged}
        ></ha-device-picker>
      </div>
    `;
  }

  private _deviceChanged = (ev: CustomEvent<{ value?: string }>) => {
    const deviceId = ev.detail?.value ?? "";
    this.config = { ...(this.config ?? { type: "playtopro-card" }), device_id: deviceId };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
      })
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "playtopro-card-editor": PlayToProCardEditor;
  }
}