import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private localUsers: User[] | null = null; 

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    if (this.localUsers) {
      return of(this.localUsers);
    }
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(users => this.localUsers = users),
      catchError(err => {
        console.error('Ошибка загрузки', err);
        this.localUsers = [];
        return of([]);
      })
    );
  }

  getUser(id: number): Observable<User> {
    if (this.localUsers) {
      const user = this.localUsers.find(u => u.id === id);
      if (user) return of(user);
    }
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      map(newUser => {
        if (!this.localUsers) this.localUsers = [];
        const maxId = this.localUsers.length > 0 ? Math.max(...this.localUsers.map(u => u.id || 0)) : 0;
        newUser.id = maxId + 1;
        this.localUsers.push(newUser);
        return newUser;
      }),
      catchError(() => {
        if (!this.localUsers) this.localUsers = [];
        const maxId = this.localUsers.length > 0 ? Math.max(...this.localUsers.map(u => u.id || 0)) : 0;
        const fakeUser = { ...user, id: maxId + 1 };
        this.localUsers.push(fakeUser);
        return of(fakeUser);
      })
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      map(updated => {
        if (this.localUsers) {
          const index = this.localUsers.findIndex(u => u.id === id);
          if (index !== -1) this.localUsers[index] = { ...updated, id };
        }
        return updated;
      }),
      catchError(() => {
        if (this.localUsers) {
          const index = this.localUsers.findIndex(u => u.id === id);
          if (index !== -1) this.localUsers[index] = { ...user, id };
        }
        return of(user);
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        if (this.localUsers) this.localUsers = this.localUsers.filter(u => u.id !== id);
      }),
      catchError(() => {
        if (this.localUsers) this.localUsers = this.localUsers.filter(u => u.id !== id);
        return of(void 0);
      })
    );
  }
}