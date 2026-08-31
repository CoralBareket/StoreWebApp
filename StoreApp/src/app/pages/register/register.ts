import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);

  protected readonly registerForm = this.formBuilder.nonNullable.group({
    userName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    const credentials = this.registerForm.getRawValue();

    this.authService.register(credentials).subscribe({
      next: () => {
        this.authService.login(credentials).subscribe({
          next: () => {
            this.router.navigate(['/products']);
          },
          error: () => {
            this.isSubmitting.set(false);
            this.errorMessage.set('Registration succeeded, but login failed');
          },
        });
      },
      error: (error) => {
        this.isSubmitting.set(false);

        if (error.status === 409) {
          this.errorMessage.set('Username already exists');
          return;
        }

        this.errorMessage.set('Registration failed');
      },
    });
  }
}
