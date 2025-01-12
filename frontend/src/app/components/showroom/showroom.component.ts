import { Component, OnInit } from '@angular/core';
import { ShowroomService } from '../../core/services/showroom.service';
import { Showroom } from '../../Interfaces/showroom';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-showroom',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule],
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss'],
})
export class ShowroomComponent implements OnInit {
  showrooms: Showroom[] = [];
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;

  // For creating/updating showrooms
  newShowroom: Showroom = {
    id: 0,
    name: '',
    commercialRegistrationNumber: '',
    managerName: '',
    contactNumber: '',
    address: '',
  };
  isEditMode: boolean = false;

  constructor(private showroomService: ShowroomService) { }

  ngOnInit(): void {
    this.loadShowrooms();
  }

  // Load showrooms with pagination
  loadShowrooms(): void {
    this.showroomService.getAllShowrooms(this.page, this.size).subscribe((response) => {
      this.showrooms = response.content;
      this.totalElements = response.totalElements;
    });
  }

  // Handle page change event
  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadShowrooms();
  }

  // Create or update a showroom
  saveShowroom(): void {
    if (this.isEditMode) {
      this.showroomService.updateShowroom(this.newShowroom.id, this.newShowroom).subscribe(() => {
        this.resetForm();
        this.loadShowrooms();
      });
    } else {
      this.showroomService.createShowroom(this.newShowroom).subscribe(() => {
        this.resetForm();
        this.loadShowrooms();
      });
    }
  }

  // Edit a showroom
  editShowroom(showroom: Showroom): void {
    this.isEditMode = true;
    this.newShowroom = { ...showroom };
  }

  // Delete a showroom
  deleteShowroom(id: number): void {
    if (confirm('Are you sure you want to delete this showroom?')) {
      this.showroomService.deleteShowroom(id).subscribe(() => {
        this.loadShowrooms();
      });
    }
  }

  // Reset the form
  resetForm(): void {
    this.isEditMode = false;
    this.newShowroom = {
      id: 0,
      name: '',
      commercialRegistrationNumber: '',
      managerName: '',
      contactNumber: '',
      address: '',
    };
  }
}