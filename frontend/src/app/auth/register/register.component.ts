import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../core/services/notifications.service';
@Component({
  selector: 'app-register',
  standalone: true, // Mark the component as standalone
  imports: [ReactiveFormsModule, CommonModule], // Import ReactiveFormsModule and CommonModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationsService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register({ username, email, password }).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/login']);
          this.notifications.showSuccess("User Registered Successfully!", "Success!");
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error ? err.error : 'Registration failed. Please try again.';
        }
      });
    }
  }
}