import { InfiniteCanvas } from './InfiniteCanvas';
import { saveLayout, loadLayout } from './layout';

const canvas = new InfiniteCanvas('viewport', 'canvas', 'add-box');

document.getElementById('save-layout')!.addEventListener('click', () => {
  const boxes = canvas.getBoxes();
  saveLayout(boxes);
  alert('Layout saved!');
});

document.getElementById('load-layout')!.addEventListener('click', () => {
  const data = loadLayout();
  canvas.loadBoxes(data);
});

document.getElementById('zoom-in')!.addEventListener('click', () => canvas.zoomIn());
document.getElementById('zoom-out')!.addEventListener('click', () => canvas.zoomOut());
