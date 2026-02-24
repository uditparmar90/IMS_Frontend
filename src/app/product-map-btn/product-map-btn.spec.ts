import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMapBtn } from './product-map-btn';

describe('ProductMapBtn', () => {
  let component: ProductMapBtn;
  let fixture: ComponentFixture<ProductMapBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMapBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMapBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
