/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VerPdfComponent } from './ver-pdf.component';

describe('VerPdfComponent', () => {
  let component: VerPdfComponent;
  let fixture: ComponentFixture<VerPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
