import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = Number(idParam);
      this.loadUserData();
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      phone: [''],
      website: [''],
      address: this.fb.group({
        street: [''],
        suite: [''],
        city: [''],
        zipcode: ['']
      }),
      company: this.fb.group({
        name: ['']
      })
    });
  }

  loadUserData(): void {
    if (!this.userId) return;
    this.loading = true;
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.loading = false;
      },
      error: () => {
        this.message.error('Ошибка загрузки данных пользователя');
        this.router.navigate(['/users']);
        this.loading = false;
      }
    });
  }

//   onSubmit(): void {
//     if (this.userForm.invalid) {
//       Object.values(this.userForm.controls).forEach(control => {
//         control.markAsDirty();
//         control.updateValueAndValidity();
//       });
//       return;
//     }

//     const userData = this.userForm.value;

//     if (this.isEditMode && this.userId) {
//       this.userService.updateUser(this.userId, userData).subscribe({
//         next: () => {
//           this.message.success('Пользователь обновлён');
//           this.router.navigate(['/users', this.userId]);
//         },
//         error: () => this.message.error('Ошибка обновления')
//       });
//     } else {
//       this.userService.createUser(userData).subscribe({
//         next: (newUser) => {
//           this.message.success('Пользователь создан');
//           this.router.navigate(['/users', newUser.id]);
//         },
//         error: () => this.message.error('Ошибка создания')
//       });
//     }
//   }
    onSubmit(): void {
    if (this.userForm.invalid) {
        Object.values(this.userForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
        });
        return;
    }

    const userData = this.userForm.value;

    if (this.isEditMode && this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe({
        next: () => {
            this.message.success('Пользователь обновлён');
            this.router.navigate(['/users']);
        },
        error: () => this.message.error('Ошибка обновления')
        });
    } else {
        this.userService.createUser(userData).subscribe({
        next: () => {
            this.message.success('Пользователь создан');
            this.router.navigate(['/users']);
        },
        error: () => this.message.error('Ошибка создания')
        });
    }
    }
}