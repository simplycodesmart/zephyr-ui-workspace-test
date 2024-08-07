import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, ErrorHandler } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { ZepIcon } from './zep-icon';
import { ZepIconService } from './zep-icon.service';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

const mockSvgContent = '<svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="blue"/></svg>';

@Component({
  template: `<zep-icon [className]="font" icon="home"></zep-icon>`,
  standalone: true,
  imports: [ZepIcon],
})
class ZepIconWithFont {
  font = '';
}

@Component({
  template: `<zep-icon aria-hidden="false"></zep-icon>`,
  standalone: true,
  imports: [ZepIcon],
})
class ZepIconTestWithAriaHiddenFalse {}

@Component({
  template: `<zep-icon [size]="size">home</zep-icon>`,
  standalone: true,
  imports: [ZepIcon],
})
class ZepIconWithSize {
  size = 24;
}

@Component({
  template: `<zep-icon [color]="iconColor" [icon]="icon"></zep-icon>`,
  standalone: true,
  imports: [ZepIcon],
})
class ZepIconWithColor {
  iconColor = 'primary';
  icon = '';
}

describe('ZepIcon', () => {
  let component: ZepIcon;
  let fixture: ComponentFixture<ZepIcon>;
  let errorHandler: jasmine.SpyObj<ErrorHandler>;
  let mockZepIconService: jasmine.SpyObj<ZepIconService>;
  let mockSanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    errorHandler = jasmine.createSpyObj('errorHandler', ['handleError']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ZepIcon],
      providers: [
        { provide: ErrorHandler, useValue: errorHandler },
        {
          provide: DomSanitizer,
          useValue: jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']),
        },
        {
          provide: ZepIconService,
          useValue: jasmine.createSpyObj('ZepIconService', ['loadSvgFile']),
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ZepIcon);
    component = fixture.componentInstance;
    mockSanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    mockZepIconService = TestBed.inject(ZepIconService) as jasmine.SpyObj<ZepIconService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the correct role', () => {
    const icon = fixture.debugElement.nativeElement;
    expect(icon.getAttribute('role')).toBe('img');
  });

  it('should include notranslate class by default', () => {
    const matIconElement = fixture.debugElement.nativeElement;
    expect(matIconElement.classList.contains('notranslate'))
      .withContext('Expected the zep-icon element to include the notranslate class')
      .toBeTruthy();
  });

  it('should mark mat-icon as aria-hidden by default', () => {
    const iconElement = fixture.debugElement.nativeElement;
    expect(iconElement.getAttribute('aria-hidden'))
      .withContext('Expected the zep-icon element has aria-hidden="true" by default')
      .toBe('true');
  });

  it('should not override a user-provided aria-hidden attribute', () => {
    const fixture = TestBed.createComponent(ZepIconTestWithAriaHiddenFalse);
    const iconElement = fixture.debugElement.nativeElement.querySelector('.zep-icon');
    expect(iconElement.getAttribute('aria-hidden'))
      .withContext('Expected the zep-icon element has the user-provided aria-hidden value')
      .toBe('false');
  });

  it('should apply class deafault color attribute', () => {
    const fixture = TestBed.createComponent(ZepIconWithColor);
    const testComponent = fixture.componentInstance;
    testComponent.icon = 'home';
    const iconElement = fixture.debugElement.nativeElement.querySelector('.zep-icon');
    fixture.detectChanges();
    expect(iconElement.className.split(' ').sort()).toEqual([
      'material-icons',
      'notranslate',
      'zep-icon',
      'zep-primary',
    ]);
  });

  it('should apply class based on color attribute', () => {
    const fixture = TestBed.createComponent(ZepIconWithColor);
    const testComponent = fixture.componentInstance;
    testComponent.iconColor = 'accent';
    testComponent.icon = 'home';
    const iconElement = fixture.debugElement.nativeElement.querySelector('.zep-icon');
    fixture.detectChanges();
    expect(iconElement.className.split(' ').sort()).toEqual([
      'material-icons',
      'notranslate',
      'zep-accent',
      'zep-icon',
    ]);
  });

  it('should set font-size default', () => {
    const fixture = TestBed.createComponent(ZepIconWithSize);
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.zep-icon');
    const computedStyle = window.getComputedStyle(iconElement);
    expect(computedStyle.fontSize).toBe(`${24}px`);
  });

  it('should set font-size based on size input', () => {
    const sizes = [16, 24, 32];
    const fixture = TestBed.createComponent(ZepIconWithSize);
    for (const size of sizes) {
      fixture.componentInstance.size = size;
      fixture.detectChanges();
      const iconElement = fixture.nativeElement.querySelector('.zep-icon');
      const computedStyle = window.getComputedStyle(iconElement);
      expect(computedStyle.fontSize).toBe(`${size}px`);
    }
  });

  it('should set font class default material', () => {
    const fixture = TestBed.createComponent(ZepIconWithColor);
    fixture.componentInstance.icon = 'home';
    fixture.detectChanges();
    const iconElement = fixture.debugElement.nativeElement.querySelector('.zep-icon');
    expect(iconElement).toBeTruthy();
    expect(iconElement.classList).toContain('material-icons');
  });

  it('should set font class based on font input', () => {
    const fixture = TestBed.createComponent(ZepIconWithFont);
    const fonts = ['material-icons', 'fa-solid', 'custom-font'];
    for (const font of fonts) {
      fixture.componentInstance.font = font;
      fixture.detectChanges();
      const iconElement = fixture.nativeElement.querySelector('.zep-icon');
      expect(iconElement.classList).toContain(font);
    }
  });

  it('should render icon content based on icon input', () => {
    const icons = ['home', 'settings', 'check'];
    for (const icon of icons) {
      fixture.componentRef.setInput('icon', icon);
      fixture.detectChanges();
      const iconElement = fixture.nativeElement;
      expect(iconElement.textContent).toBe(icon);
    }
  });

  it('should set aria-label attribute defaut', () => {
    fixture.detectChanges();
    const iconElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-label')).toBe('icon');
  });

  it('should set aria-label attribute based on ariaLabel input', () => {
    const labels = ['Home Icon', 'Settings Icon', 'Check Icon'];
    for (const label of labels) {
      fixture.componentRef.setInput('ariaLabel', label);
      fixture.detectChanges();
      const iconElement = fixture.nativeElement;
      expect(iconElement.getAttribute('aria-label')).toBe(label);
    }
  });

  it('should warn for invalid size', () => {
    spyOn(console, 'warn');
    fixture.componentRef.setInput('size', -10);
    fixture.detectChanges();
    expect(console.warn).toHaveBeenCalledWith('Invalid size provided for zep-icon. Size must be a positive number.');
  });

  it('should warn for invalid  icon ', () => {
    fixture.componentRef.setInput('icon', '');
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.textContent).toBe('No icon provided');
    expect(element.classList).toContain('zep-icon-empty');
  });

  it('should set ariaLabel correctly', () => {
    fixture.componentRef.setInput('ariaLabel', 'custom label');
    expect(component.ariaLabel()).toBe('custom label');
  });

  it('should set default aria-hidden attribute', () => {
    const element = fixture.nativeElement;
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render icon element with class', () => {
    fixture.componentRef.setInput('className', 'fa');
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.classList.contains('fa')).toBe(true);
  });

  it('should update  class on className change', () => {
    const element = fixture.nativeElement;
    fixture.componentRef.setInput('icon', 'home');
    fixture.componentRef.setInput('className', 'fa');
    fixture.detectChanges();
    expect(element.classList.contains('fa')).toBe(true);
    fixture.componentRef.setInput('className', 'mdi');
    fixture.detectChanges();
    expect(element.classList.contains('fa')).toBe(false);
    expect(element.classList.contains('mdi')).toBe(true);
  });

  describe('when icon is provided as inline SVG', () => {
    it('should set innerHTML with sanitized svg content', async () => {
      fixture.componentRef.setInput('icon', '<svg><path d="M10 20... /></svg>');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('<svg><path d="M10 20... /></svg>');
    });

    it('should remove font class', () => {
      fixture.componentRef.setInput('className', 'fa');
      fixture.detectChanges();
      const element = fixture.nativeElement;
      expect(element.classList.contains('fa')).toBe(true);
      fixture.componentRef.setInput('icon', '<svg><path d="M10 20... /></svg>');
      fixture.detectChanges();
      expect(element.classList.contains('fa')).toBe(false);
    });
  });

  describe('when icon is provided as file SVG', () => {
    let httpMock: HttpTestingController;
    beforeEach(() => {
      httpMock = TestBed.inject(HttpTestingController);
    });
    afterEach(() => {
      httpMock.verify();
    });
    it('should handle SVG loading sucess', fakeAsync(() => {
      const mockUrl = 'test.svg';
      mockZepIconService.loadSvgFile.and.returnValue(of(mockSvgContent));
      fixture.componentRef.setInput('icon', mockUrl);
      fixture.detectChanges();
      tick();
      const req = httpMock.expectOne(mockUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockSvgContent);
      expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(mockSvgContent);
    }));

    it('should handle SVG loading error', fakeAsync(() => {
      const mockUrl = 'test.svg';
      const mockErrorMessage = 'Error loading SVG';
      mockZepIconService.loadSvgFile.and.returnValue(throwError(() => mockErrorMessage));
      fixture.componentRef.setInput('icon', mockUrl);
      fixture.detectChanges();
      tick();
      const req = httpMock.expectOne(mockUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockErrorMessage, { status: 404, statusText: 'Not Found' });
      const element = fixture.nativeElement;
      expect(element.textContent.trim()).toBe('Error loading icon');
      expect(element.classList).toContain('zep-error');
    }));
  });
});
