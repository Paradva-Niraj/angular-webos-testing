import { Injectable } from '@angular/core';
import SpatialNavigation from 'spatial-navigation-js';

@Injectable({
  providedIn: 'root'
})
export class TvNavigationService {

  private initialized = false;
  private lastKeyTime = 0;
  private debounceTime = 90; // Prevents skipping (LG TVs fire double events)

  init() {
    if (this.initialized) return;
    this.initialized = true;

    /* --------------------------------------------
     * 1) Initialize Spatial Navigation
     * -------------------------------------------- */
    SpatialNavigation.init({
      straightOnly: true,
      rememberSource: true,
      restrict: 'self-first',
      defaultElement: '.focusable',
      enterTo: 'last-focused'
    });

    /* --------------------------------------------
     * 2) Register focusable elements
     * -------------------------------------------- */
    SpatialNavigation.add({
      selector: '.focusable'
    });

    SpatialNavigation.makeFocusable();

    /* --------------------------------------------
     * 3) First focus after DOM renders
     * -------------------------------------------- */
    setTimeout(() => {
      SpatialNavigation.focus('.focusable');
    }, 180);

    /* --------------------------------------------
     * 4) Key Handling with DEBOUNCE
     * -------------------------------------------- */
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const now = Date.now();

      // Prevent double skip (LG WebOS double fires keydown)
      if (event.keyCode !== 13 && now - this.lastKeyTime < this.debounceTime) {
        return;
      }

      this.lastKeyTime = now;

      switch (event.keyCode) {
        case 37: // LEFT
          SpatialNavigation.move('left');
          break;

        case 38: // UP
          SpatialNavigation.move('up');
          break;

        case 39: // RIGHT
          SpatialNavigation.move('right');
          break;

        case 40: // DOWN
          SpatialNavigation.move('down');
          break;

        case 13: // ENTER / OK
          this.handleEnter();
          break;
      }
    });
  }

  /* --------------------------------------------
   * ENTER key behavior (always fires click)
   * -------------------------------------------- */
  private handleEnter() {
    const focused = document.activeElement as HTMLElement;
    if (!focused) return;

    console.log("ENTER ON →", focused);

    // Simulate Angular click / routerLink
    focused.click();

    // Press visual effect
    focused.classList.add('pressed');
    setTimeout(() => focused.classList.remove('pressed'), 120);
  }

  /* --------------------------------------------
   * Call this on every route change
   * -------------------------------------------- */
  refresh() {
    SpatialNavigation.clear();
    SpatialNavigation.add({ selector: '.focusable' });
    SpatialNavigation.makeFocusable();

    // Small delay ensures layout fully rendered
    setTimeout(() => {
      SpatialNavigation.focus('.focusable');
    }, 120);
  }
}
