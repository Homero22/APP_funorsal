import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-ver-pdf',
  templateUrl: './ver-pdf.component.html',
  styleUrls: ['./ver-pdf.component.css']
})
export class VerPdfComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { pdfSrc: SafeResourceUrl }) { }

  ngOnInit() {
  }

}
