import { BoxData } from './types';

const STORAGE_KEY = 'infinite-canvas-layout';

export function saveLayout(boxes: BoxData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boxes));
}

export function loadLayout(): BoxData[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
