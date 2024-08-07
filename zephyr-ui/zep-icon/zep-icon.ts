import { Attribute, Component, ElementRef, InputSignal, OnInit, ViewEncapsulation, effect, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ZepIconService } from './zep-icon.service';

const defaultClass = 'material-icons';

@Component({
  selector: 'zep-icon',
  template: ``,
  standalone: true,
  exportAs: 'zepIcon',
  styleUrls: ['./zep-icon.scss'],
  host: {
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
    class: 'zep-icon notranslate',
    '[class]': 'color() ? "zep-" + color() : ""',
    '[class.zep-icon-no-color]': 'color() !== "primary" && color() !== "accent" && color() !== "warn"',
    '[style.fontSize.px]': 'size()',
    '[style.color]': 'color()',
    '[innerHTML]': 'safeSvgContent',
  },
  providers: [ZepIconService],
  encapsulation: ViewEncapsulation.None,
})
export class ZepIcon implements OnInit {
  className: InputSignal<string> = input<string>(defaultClass);
  icon: InputSignal<string> = input<string>('');
  size: InputSignal<number> = input(24, {
    transform: (x: number) => {
      console.warn('Invalid size provided for zep-icon. Size must be a positive number.');
      return x <= 0 ? 24 : x;
    },
  });

  color: InputSignal<string> = input<string>('primary');
  ariaLabel: InputSignal<string> = input<string>('icon');
  private safeSvgContent: SafeHtml = '';
  private currentFontClass = '';
  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private sanitizer: DomSanitizer,
    private zepIconService: ZepIconService,
    @Attribute('aria-hidden') ariaHidden: string,
  ) {
    effect(() => {
      this.renderIcon();
    });
    if (!ariaHidden) {
      _elementRef.nativeElement.setAttribute('aria-hidden', 'true');
    }
  }

  ngOnInit(): void {
    this.createIconElement();
  }

  private createIconElement() {
    const elem: HTMLElement = this._elementRef.nativeElement;
    elem.classList.add(this.className());
  }

  private renderIcon() {
    const elem: HTMLElement = this._elementRef.nativeElement;
    if (!this.icon()) {
      this.safeSvgContent = 'No icon provided';
      elem.textContent = 'No icon provided';
      elem.classList.add('zep-icon-empty');
      return;
    }
    if (this.isSvg(this.icon())) {
      this.safeSvgContent = '';
      this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml(this.icon());
      elem.classList.remove(this.className());
      return;
    }

    if (this.isSvgFile(this.icon())) {
      this.zepIconService.loadSvgFile(this.icon()).subscribe({
        next: (svgContent) => {
          this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml(svgContent);
          elem.classList.remove(this.className());
        },
        error: (err) => {
          console.error('Error loading SVG:', err);
          elem.textContent = 'Error loading icon';
          elem.classList.add('zep-error');
        },
      });
      return;
    }

    this.safeSvgContent = this.icon();
    elem.textContent = this.icon();
    elem.classList.add(this.className());
    if (elem.classList.contains(this.currentFontClass)) {
      elem.classList.remove(this.currentFontClass);
    }
    this.currentFontClass = this.className();
  }

  private isSvg(content: string): boolean {
    return content.trim().startsWith('<svg');
  }

  private isSvgFile(content: string): boolean {
    return content.trim().endsWith('.svg');
  }
}
