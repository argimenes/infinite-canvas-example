import { BoxData } from './types';

export class InfiniteCanvas {
  private viewport: HTMLElement;
  private canvas: HTMLElement;
  private addBoxBtn: HTMLElement;
  private translateX = 0;
  private translateY = 0;
  private scale = 1;
  private isPanning = false;
  private startPan = { x: 0, y: 0 };

  constructor(viewportId: string, canvasId: string, addBoxId: string) {
    this.viewport = document.getElementById(viewportId)!;
    this.canvas = document.getElementById(canvasId)!;
    this.addBoxBtn = document.getElementById(addBoxId)!;

    this.addBoxBtn.addEventListener('click', () => this.addBox());

    this.viewport.addEventListener('mousedown', this.onPanStart);
    window.addEventListener('mousemove', this.onPanMove);
    window.addEventListener('mouseup', this.onPanEnd);
    this.viewport.addEventListener('wheel', this.onWheel, { passive: false });

    this.updateTransform();
  }

  public getBoxes(): BoxData[] {
    return Array.from(this.canvas.querySelectorAll('.box')).map((el) => {
      const id = el.getAttribute('data-id')!;
      return {
        id,
        content: el.textContent || '',
        x: parseFloat(el.style.left),
        y: parseFloat(el.style.top),
      };
    });
  }

  public zoomIn() {
    this.applyZoom(1.1);
  }
  
  public zoomOut() {
    this.applyZoom(1 / 1.1);
  }
  
  private applyZoom(factor: number) {
    const rect = this.viewport.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const worldX = (centerX - this.translateX) / this.scale;
    const worldY = (centerY - this.translateY) / this.scale;
  
    this.scale *= factor;
    this.translateX = centerX - worldX * this.scale;
    this.translateY = centerY - worldY * this.scale;
  
    this.updateTransform();
  }
  

  public loadBoxes(boxes: BoxData[]) {
    for (const box of boxes) {
      const el = document.createElement('div');
      el.className = 'box';
      el.setAttribute('data-id', box.id);
      el.textContent = box.content;
      el.style.left = `${box.x}px`;
      el.style.top = `${box.y}px`;
      this.makeDraggable(el);
      this.canvas.appendChild(el);
    }
  }

  private updateTransform = () => {
    this.canvas.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  };

  private onPanStart = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('box')) return;
    this.isPanning = true;
    this.startPan = { x: e.clientX, y: e.clientY };
    this.viewport.style.cursor = 'grabbing';
  };

  private onPanMove = (e: MouseEvent) => {
    if (!this.isPanning) return;
    const dx = e.clientX - this.startPan.x;
    const dy = e.clientY - this.startPan.y;
    this.translateX += dx;
    this.translateY += dy;
    this.startPan = { x: e.clientX, y: e.clientY };
    this.updateTransform();
  };

  private onPanEnd = () => {
    this.isPanning = false;
    this.viewport.style.cursor = 'grab';
  };

  private onWheel = (e: WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const zoomFactor = 1.1;
    const rect = this.viewport.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const worldX = (offsetX - this.translateX) / this.scale;
    const worldY = (offsetY - this.translateY) / this.scale;

    this.scale *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
    this.translateX = offsetX - worldX * this.scale;
    this.translateY = offsetY - worldY * this.scale;

    this.updateTransform();
  };

  private addBox() {
    const id = `box-${Date.now()}`;
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = 'Drag Me!';
    box.setAttribute('data-id', id);

    const x = Math.random() * 1000;
    const y = Math.random() * 1000;
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;

    this.makeDraggable(box);
    this.canvas.appendChild(box);
  }

  private makeDraggable(el: HTMLDivElement) {
    let isDragging = false;
    let startX = 0, startY = 0, origX = 0, origY = 0;

    el.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origX = parseFloat(el.style.left);
      origY = parseFloat(el.style.top);
      document.body.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - startX) / this.scale;
      const dy = (e.clientY - startY) / this.scale;
      el.style.left = `${origX + dx}px`;
      el.style.top = `${origY + dy}px`;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.cursor = '';
    });
  }
}
