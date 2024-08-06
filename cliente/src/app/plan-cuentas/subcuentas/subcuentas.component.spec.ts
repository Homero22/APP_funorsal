/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubcuentasComponent } from './subcuentas.component';

describe('SubcuentasComponent', () => {
  let component: SubcuentasComponent;
  let fixture: ComponentFixture<SubcuentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcuentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
