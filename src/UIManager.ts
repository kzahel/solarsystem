import { SolarSystem } from './SolarSystem';

export class UIManager {
    private solarSystem: SolarSystem;
    private container: HTMLElement;

    constructor(solarSystem: SolarSystem) {
        this.solarSystem = solarSystem;
        this.container = document.createElement('div');
        this.container.id = 'ui-container';
        document.body.appendChild(this.container);

        this.setupStyles();
        this.createControls();
    }

    private setupStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            #ui-container {
                position: absolute;
                top: 20px;
                left: 20px;
                width: 300px;
                padding: 20px;
                background: rgba(20, 20, 30, 0.6);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: white;
                font-family: 'Inter', sans-serif;
                user-select: none;
                pointer-events: auto;
            }
            
            .control-group {
                margin-bottom: 15px;
            }
            
            label {
                display: block;
                margin-bottom: 5px;
                font-size: 12px;
                color: #aaa;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            input[type="range"] {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                height: 4px;
                border-radius: 2px;
                -webkit-appearance: none;
            }
            
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
            }

            .value-display {
                float: right;
                color: white;
            }
            
            h1 {
                font-size: 18px;
                margin-top: 0;
                margin-bottom: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 10px;
            }
            
            .instructions {
                font-size: 11px;
                color: #888;
                margin-top: 20px;
                line-height: 1.4;
            }

            .github-link {
                display: block;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                text-align: center;
                color: #aaa;
                text-decoration: none;
                font-size: 12px;
                transition: color 0.2s;
            }
            
            .github-link:hover {
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    private createControls() {
        this.container.innerHTML = `
            <h1>Solar System</h1>
            
            <div class="control-group">
                <label>Time Scale <span id="time-val" class="value-display">1 day/s</span></label>
                <input type="range" id="time-scale" min="-365" max="365" value="1" step="1">
            </div>

            <div class="control-group">
                <label>Min Planet Size <span id="size-val" class="value-display">0.5</span></label>
                <input type="range" id="min-size" min="0.1" max="5.0" value="0.5" step="0.1">
            </div>

            <div class="control-group">
                <label>
                    <input type="checkbox" id="toggle-labels" checked> Show Labels
                </label>
            </div>

            <div class="control-group">
                <label>
                    <input type="checkbox" id="toggle-constellations"> Show Constellations
                </label>
            </div>
            
            <div class="instructions">
                <b>Controls:</b><br>
                Click to capture mouse<br>
                WASD / Arrows to move<br>
                Q / E to Roll<br>
                Space / Shift to move Up/Down<br>
                ESC to release mouse
            </div>

            <a href="https://github.com/kzahel/solarsystem" target="_blank" class="github-link">
                <svg height="16" width="16" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 5px; fill: currentColor;">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                View Source
            </a>
        `;

        // Event Listeners
        const timeSlider = this.container.querySelector('#time-scale') as HTMLInputElement;
        const timeVal = this.container.querySelector('#time-val') as HTMLElement;

        timeSlider.addEventListener('input', (e) => {
            const val = parseFloat((e.target as HTMLInputElement).value);
            this.solarSystem.timeScale = val;
            timeVal.innerText = `${val} day/s`;
        });

        const sizeSlider = this.container.querySelector('#min-size') as HTMLInputElement;
        const sizeVal = this.container.querySelector('#size-val') as HTMLElement;

        sizeSlider.addEventListener('input', (e) => {
            const val = parseFloat((e.target as HTMLInputElement).value);
            this.solarSystem.minPlanetSize = val;
            sizeVal.innerText = val.toString();
        });

        const labelToggle = this.container.querySelector('#toggle-labels') as HTMLInputElement;
        labelToggle.addEventListener('change', (e) => {
            this.solarSystem.setLabelsVisible((e.target as HTMLInputElement).checked);
        });

        const constellationToggle = this.container.querySelector('#toggle-constellations') as HTMLInputElement;
        constellationToggle.addEventListener('change', (e) => {
            this.solarSystem.setConstellationsVisible((e.target as HTMLInputElement).checked);
        });
    }
}
