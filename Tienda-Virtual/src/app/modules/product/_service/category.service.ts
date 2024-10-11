import { Injectable } from '@angular/core';
import { Category } from '../_model/category';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

  getCategories(): Category[] {
    let categories: Category[] = [];
    categories.push(new Category(1, 'Categoria 1', 'tag1', 1));
    categories.push(new Category(2, 'Categoria 5', 'tag2', 1));
    categories.push(new Category(3, 'Categoria 3', 'tag3', 0));
    return categories;
  
  }
}

