import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { GetComponent } from './views/item/get/get.component';
import { AppendComponent } from './views/item/append/append.component';
import { AdminComponent } from './views/admin/admin.component';
import { CategoryComponent } from './views/category/category.component';
import { CollectionComponent } from './views/collection/collection.component';
import { UserComponent } from './views/user/user.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'category/:categoryId',
    component: CategoryComponent
  },
  {
    path: 'category/:categoryId/album/:album',
    component: CollectionComponent
  },
  {
    path: "user/:userId",
    component: UserComponent
  },
  {
    path: 'item/append',
    component: AppendComponent
  },
  {
    path: 'item/:itemIg',
    component: GetComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
