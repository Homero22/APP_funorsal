import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit{
  sizeClass: string;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { size: string,contentType:string,tituloModal:string }
  ) {
    this.sizeClass = this.getSizeClass(data.size);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  private getSizeClass(size: string): string {
    return size === 'large' ? 'modal-large' : 'modal-small';
  }

  ngOnInit() {

  }
}

