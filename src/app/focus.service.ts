import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FocusService {

  constructor() {
    window.addEventListener('keydown', (e) => this.handleKey(e));
  }

  handleKey(e: KeyboardEvent) {
    const key = e.keyCode;

    if (key === 37) this.moveHorizontal(-1); // LEFT
    if (key === 39) this.moveHorizontal(1);  // RIGHT
    if (key === 38) this.moveVertical(-1);   // UP
    if (key === 40) this.moveVertical(1);    // DOWN
  }

  getFocusable() {
    return Array.from(document.querySelectorAll('.focusable')) as HTMLElement[];
  }

  getCurrent() {
    return document.activeElement as HTMLElement;
  }

  moveHorizontal(direction: number) {
    const current = this.getCurrent();
    const row = Number(current.getAttribute('data-row'));

    const all = this.getFocusable()
      .filter(el => Number(el.getAttribute('data-row')) === row);

    const index = all.indexOf(current);
    const next = all[index + direction];

    if (next) next.focus();
  }

  moveVertical(direction: number) {
    const current = this.getCurrent();
    const row = Number(current.getAttribute('data-row'));

    const nextRow = row + direction;

    const columnIndex = Array
      .from(document.querySelectorAll(`[data-row="${row}"]`))
      .indexOf(current);

    const nextRowItems = Array
      .from(document.querySelectorAll(`[data-row="${nextRow}"]`)) as HTMLElement[];

    if (nextRowItems.length === 0) return;

    const target = nextRowItems[columnIndex] || nextRowItems[nextRowItems.length - 1];
    target.focus();
  }
}
