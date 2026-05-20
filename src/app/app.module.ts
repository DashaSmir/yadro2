import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd/i18n';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { IconDefinition } from '@ant-design/icons-angular';
import { PlusOutline, SearchOutline, EditOutline, DeleteOutline } from '@ant-design/icons-angular/icons';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserFormComponent } from './components/user-form/user-form.component';
registerLocaleData(ru); 
const icons: IconDefinition[] = [PlusOutline, SearchOutline, EditOutline, DeleteOutline];

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserDetailComponent,
    UserFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule.forRoot(icons),
    NzPaginationModule,
    NzCardModule,
    NzDescriptionsModule,
    NzSpinModule,
    NzFormModule,
    NzDividerModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: ru_RU }   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }