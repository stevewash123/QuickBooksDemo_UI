import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { NotificationService } from './notification.service';

export interface QuickBooksAuthResult {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  companyId: string;
  expiresIn: number;
  message: string;
}

export interface SendJobResponse {
  quickBooksId: string;
  type: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  date: Date;
  status: string;
  jobId?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuickBooksService {
  private apiUrl = 'http://localhost:5042/api/quickbooks';
  private readonly requestTimeout = 15000; // 15 seconds for QB operations

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('QuickBooks API Error:', error);

    if (error.status === 0) {
      this.notificationService.showServerError();
    } else if (error.status >= 400 && error.status < 500) {
      const message = error.error?.message || error.error || 'QuickBooks request failed';
      this.notificationService.showError(message, 'QuickBooks Error');
    } else if (error.status >= 500) {
      this.notificationService.showError(
        'QuickBooks server error occurred. Please try again later.',
        'QuickBooks Server Error'
      );
    } else {
      this.notificationService.showError(
        'QuickBooks integration error occurred.',
        'QuickBooks Error'
      );
    }

    return throwError(() => error);
  };

  private withErrorHandling<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      timeout(this.requestTimeout),
      catchError(this.handleError)
    );
  }

  sendJobToQuickBooks(jobId: string, asInvoice: boolean = true): Observable<SendJobResponse> {
    const request = {
      asInvoice
    };
    return this.withErrorHandling(
      this.http.post<SendJobResponse>(`${this.apiUrl}/send-job/${jobId}`, request)
    );
  }

  testConnection(): Observable<{ isConnected: boolean }> {
    return this.withErrorHandling(
      this.http.get<{ isConnected: boolean }>(`${this.apiUrl}/test-connection`)
    );
  }

  getInvoices(): Observable<Invoice[]> {
    return this.withErrorHandling(
      this.http.get<Invoice[]>(`${this.apiUrl}/invoices`)
    );
  }
}