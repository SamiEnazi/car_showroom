import { Component, OnInit } from '@angular/core';
import { ShowroomService } from '../../core/services/showroom.service';
import { Showroom } from '../../Interfaces/showroom';

@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss'],
})
export class ShowroomComponent implements OnInit {
  showrooms: Showroom[] = [];
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;

  constructor(private showroomService: ShowroomService) { }

  ngOnInit(): void {
    this.loadShowrooms();
  }

  loadShowrooms(): void {
    this.showroomService.getAllShowrooms(this.page, this.size).subscribe((response) => {
      this.showrooms = response.content;
      this.totalElements = response.totalElements;
    });
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadShowrooms();
  }

  // Other methods remain unchanged
}