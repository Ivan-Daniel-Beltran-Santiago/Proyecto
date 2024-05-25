import { Component, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-tag-manager',
  templateUrl: './tag-manager.component.html',
  styleUrls: ['./tag-manager.component.css'],
})
export class TagManagerComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  selectedTab: string = 'Editar etiqueta';
  popupWidth: number = 640;
  popupHeight: number = 460;
  isResizing: boolean = false;
  startX: number = 0;
  startY: number = 0;

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('resize-handle')) {
      this.isResizing = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      event.preventDefault();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) {
      return;
    }

    const deltaX = this.startX - event.clientX;
    const deltaY = this.startY - event.clientY;

    let newWidth = this.popupWidth + deltaX;
    let newHeight = this.popupHeight + deltaY;

    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    newWidth = Math.min(newWidth, maxWidth);
    newHeight = Math.min(newHeight, maxHeight);

    if (newWidth > 460 && newHeight > 400) {
      this.popupWidth = newWidth;
      this.popupHeight = newHeight;
    }

    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }

  closeTagManager() {
    this.close.emit();
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  isTabSelected(tabName: string): boolean {
    return this.selectedTab === tabName;
  }
}