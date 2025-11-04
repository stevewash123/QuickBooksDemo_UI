import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="placeholder"><h2>Customer List</h2><p>Coming soon...</p></div>',
  styles: ['.placeholder { padding: 2rem; text-align: center; color: #6c757d; }']
})
export class CustomerListComponent {}