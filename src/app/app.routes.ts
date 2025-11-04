import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  { path: 'jobs', loadComponent: () => import('./components/jobs/job-list/job-list.component').then(m => m.JobListComponent) },
  { path: 'jobs/new', loadComponent: () => import('./components/jobs/job-form/job-form.component').then(m => m.JobFormComponent) },
  { path: 'jobs/:id', loadComponent: () => import('./components/jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent) },
  { path: 'jobs/:id/edit', loadComponent: () => import('./components/jobs/job-form/job-form.component').then(m => m.JobFormComponent) },
  { path: 'invoices', loadComponent: () => import('./components/invoices/invoice-list.component').then(m => m.InvoiceListComponent) },
  { path: 'customers', loadComponent: () => import('./components/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent) },
  { path: 'customers/new', loadComponent: () => import('./components/customers/customer-form/customer-form.component').then(m => m.CustomerFormComponent) },
  { path: 'customers/:id', loadComponent: () => import('./components/customers/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent) },
  { path: 'customers/:id/edit', loadComponent: () => import('./components/customers/customer-form/customer-form.component').then(m => m.CustomerFormComponent) },
  { path: 'technicians', loadComponent: () => import('./components/technicians/technician-list/technician-list.component').then(m => m.TechnicianListComponent) },
  { path: 'technicians/new', loadComponent: () => import('./components/technicians/technician-form/technician-form.component').then(m => m.TechnicianFormComponent) },
  { path: 'technicians/:id', loadComponent: () => import('./components/technicians/technician-detail/technician-detail.component').then(m => m.TechnicianDetailComponent) },
  { path: 'technicians/:id/edit', loadComponent: () => import('./components/technicians/technician-form/technician-form.component').then(m => m.TechnicianFormComponent) }
];
