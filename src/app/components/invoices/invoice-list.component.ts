import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickBooksService, Invoice } from '../../services/quickbooks.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="invoice-list-container">
      <div class="header">
        <h2>QuickBooks Invoices</h2>
        <div class="status-badge">
          ✅ Connected to QuickBooks (Demo)
        </div>
      </div>

      <div class="invoice-table">
        <div class="table-header">
          <div class="col-id">Invoice ID</div>
          <div class="col-customer">Customer</div>
          <div class="col-amount">Amount</div>
          <div class="col-date">Date</div>
          <div class="col-status">Status</div>
        </div>

        <div class="table-body">
          <div *ngFor="let invoice of invoices" class="invoice-row">
            <div class="col-id">{{ invoice.id }}</div>
            <div class="col-customer">{{ invoice.customerName }}</div>
            <div class="col-amount">{{ formatCurrency(invoice.amount) }}</div>
            <div class="col-date">{{ formatDate(invoice.date) }}</div>
            <div class="col-status">
              <span [class]="getStatusClass(invoice.status)">{{ invoice.status }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="invoices.length === 0" class="no-data">
          <p>No invoices found. Create jobs and send them to QuickBooks as invoices to see them here.</p>
        </div>

        <div *ngIf="loading" class="loading">
          <p>Loading invoices from QuickBooks...</p>
        </div>

        <div *ngIf="error" class="error">
          <p>{{ error }}</p>
          <button (click)="loadInvoices()" class="btn btn-primary">Retry</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .invoice-list-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .status-badge {
      background: #d4edda;
      color: #155724;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
    }

    .invoice-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 150px 1fr 120px 120px 100px;
      background: #f8f9fa;
      padding: 16px;
      font-weight: 600;
      border-bottom: 1px solid #dee2e6;
    }

    .table-body {
      min-height: 200px;
    }

    .invoice-row {
      display: grid;
      grid-template-columns: 150px 1fr 120px 120px 100px;
      padding: 16px;
      border-bottom: 1px solid #eee;
      align-items: center;
    }

    .invoice-row:hover {
      background: #f8f9fa;
    }

    .no-data, .loading, .error {
      padding: 40px;
      text-align: center;
      color: #6c757d;
    }

    .error {
      color: #dc3545;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .status-paid {
      background: #d4edda;
      color: #155724;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .status-overdue {
      background: #f8d7da;
      color: #721c24;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

  `]
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  loading = false;
  error: string | null = null;

  constructor(private quickBooksService: QuickBooksService) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.loading = true;
    this.error = null;

    this.quickBooksService.getInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load invoices:', error);
        this.error = 'Failed to load invoices from QuickBooks';
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}