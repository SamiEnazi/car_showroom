import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

import { ShowroomService } from '../../core/services/showroom.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { Showroom } from '../../Interfaces/showroom';

@Component({
  selector: 'app-showroom',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatPaginatorModule, AsyncPipe],
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss']
})
export class ShowroomComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showroomForm: FormGroup;
  showAddForm = false;
  isSubmitting = false;

  user$ = this.authService.user$;
  isAdmin$ = this.user$.pipe(
    map(user => user?.role === 'ADMIN')
  );

  showrooms: Showroom[] = [];
  errorMessage: string = '';

  // Pagination
  page: number = 0;
  size: number = 6;
  totalElements: number = 0;

  constructor(
    private fb: FormBuilder,
    private showroomService: ShowroomService,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationsService
  ) {
    this.showroomForm = this.fb.group({
      name: ['', Validators.required],
      commercialRegistrationNumber: [''],
      managerName: [''],
      contactNumber: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.loadShowrooms();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleAddShowroom(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.showroomForm.reset();
    }
  }

  onSubmit(): void {
    if (this.showroomForm.valid) {
      this.isSubmitting = true;
      this.showroomService.createShowroom(this.showroomForm.value).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.notifications.showSuccess('Showroom created successfully!', 'Success');
          this.showroomForm.reset();
          this.showAddForm = false;
          this.loadShowrooms();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.notifications.showError('Failed to create showroom!', 'Error');
          this.isSubmitting = false;
        }
      });
    }
  }

  // Existing methods remain the same
  loadShowrooms(): void {
    this.showroomService.getAllShowrooms(this.page, this.size).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.showrooms = response.content;
        this.totalElements = response.totalElements;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load showrooms. Please try again later.';
        this.notifications.showError('Failed to load showrooms!', 'Error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadShowrooms();
  }

  viewDetails(showroomId: number): void {
    this.router.navigate(['/showrooms', showroomId]);
  }

  editShowroom(showroomId: number): void {
    this.router.navigate(['/showrooms', showroomId, 'edit']);
  }

  deleteShowroom(id: number): void {
    if (confirm('Are you sure you want to delete this showroom?')) {
      this.showroomService.deleteShowroom(id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.loadShowrooms();
          this.notifications.showSuccess('Showroom deleted successfully!', 'Success');
        },
        error: () => {
          this.notifications.showError('Failed to delete showroom!', 'Error');
        }
      });
    }
  }
}