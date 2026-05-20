import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-user-list',
  standalone: false, 
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchTerm = '';

  pageIndex = 1;
  pageSize = 5;
  total = 0;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message.error('Ошибка загрузки пользователей');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
    this.total = this.filteredUsers.length;
    this.pageIndex = 1;
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.applyFilter();
        this.message.success('Пользователь удалён');
      },
      error: () => this.message.error('Ошибка удаления')
    });
  }

  get paginatedUsers(): User[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }
}