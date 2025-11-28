import './style.css';
import { SceneManager } from './SceneManager';

const appElement = document.querySelector<HTMLElement>('#app');

if (!appElement) {
  console.error('Root element #app not found');
} else {
  let canvas: HTMLCanvasElement;

  if (appElement.tagName === 'CANVAS') {
    canvas = appElement as HTMLCanvasElement;
  } else {
    // Create canvas if #app is a container (e.g. div)
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'scene-canvas';
    newCanvas.style.display = 'block';
    newCanvas.style.width = '100%';
    newCanvas.style.height = '100%';

    // Clear existing content and append canvas
    appElement.innerHTML = '';
    appElement.appendChild(newCanvas);
    canvas = newCanvas;
  }

  new SceneManager(canvas);
}
