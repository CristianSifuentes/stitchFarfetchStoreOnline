import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';

let nextId = 0;

// A labelled text input in the house style: one bottom border, and a label
// that rests inside the field and floats up into label caps once you type.
// Passwords get a Show/Hide toggle; errors appear underneath in red.
@Component({
  selector: 'app-text-field',
  template: `
    <div class="relative">
      <input
        [id]="id"
        class="input-line peer pb-2.5 pt-6"
        [class.pr-14]="revealable()"
        [class.border-error]="error()"
        [type]="inputType()"
        [attr.autocomplete]="autocomplete()"
        [attr.autofocus]="autofocus() ? '' : null"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="error() ? id + '-error' : null"
        placeholder=" "
        [value]="value()"
        (input)="value.set($any($event.target).value)"
      />
      <label
        [for]="id"
        class="label-caps pointer-events-none absolute left-0 top-1 text-muted transition-all duration-200 peer-[:placeholder-shown:not(:focus)]:top-[1.4rem] peer-[:placeholder-shown:not(:focus)]:text-sm peer-[:placeholder-shown:not(:focus)]:font-normal peer-[:placeholder-shown:not(:focus)]:normal-case peer-[:placeholder-shown:not(:focus)]:tracking-normal"
      >{{ label() }}</label>
      @if (revealable()) {
        <button
          type="button"
          class="label-caps absolute bottom-3 right-0 text-muted transition-colors hover:text-ink"
          [attr.aria-pressed]="revealed()"
          [attr.aria-label]="(revealed() ? 'Hide ' : 'Show ') + label().toLowerCase()"
          (click)="revealed.set(!revealed())"
        >{{ revealed() ? 'Hide' : 'Show' }}</button>
      }
    </div>
    @if (error()) {
      <p [id]="id + '-error'" class="mt-2 text-xs text-error">{{ error() }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextFieldComponent {
  readonly label = input.required<string>();
  readonly value = model('');
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly autocomplete = input<string | null>(null);
  readonly autofocus = input(false);
  // Adds a Show/Hide toggle (passwords).
  readonly revealable = input(false);
  // Shown under the field; empty when the value is fine.
  readonly error = input('');

  protected readonly id = `field-${nextId++}`;
  protected readonly revealed = signal(false);
  protected readonly inputType = computed(() => (this.revealable() && this.revealed() ? 'text' : this.type()));
}
