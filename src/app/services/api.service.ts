import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import { Technician } from '../models/technician.model';
import { Job, JobStatus, JobType } from '../models/job.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = this.getApiUrl();
  private readonly requestTimeout = 10000; // 10 seconds

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  private getApiUrl(): string {
    // Check if we're in production (on Render)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      return 'https://quickbooksdemo-api.onrender.com/api';
    }
    // Default to localhost for development
    return 'http://localhost:5042/api';
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('API Error:', error);

    if (error.status === 0) {
      // Network error or server not running
      this.notificationService.showServerError();
    } else if (error.status >= 400 && error.status < 500) {
      // Client errors (400-499)
      const message = error.error?.message || error.error || `HTTP ${error.status}: ${error.statusText}`;
      this.notificationService.showError(message, 'Request Failed');
    } else if (error.status >= 500) {
      // Server errors (500-599)
      this.notificationService.showError(
        'Server error occurred. Please try again later.',
        'Server Error'
      );
    } else {
      // Other errors
      this.notificationService.showGeneralError(error);
    }

    return throwError(() => error);
  };

  private withErrorHandling<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      timeout(this.requestTimeout),
      catchError(this.handleError)
    );
  }

  // Customer endpoints
  getCustomers(): Observable<Customer[]> {
    return this.withErrorHandling(
      this.http.get<Customer[]>(`${this.baseUrl}/customers`)
    );
  }

  getCustomer(id: string): Observable<Customer> {
    return this.withErrorHandling(
      this.http.get<Customer>(`${this.baseUrl}/customers/${id}`)
    );
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.withErrorHandling(
      this.http.post<Customer>(`${this.baseUrl}/customers`, customer)
    );
  }

  updateCustomer(id: string, customer: Customer): Observable<Customer> {
    return this.withErrorHandling(
      this.http.put<Customer>(`${this.baseUrl}/customers/${id}`, customer)
    );
  }

  deleteCustomer(id: string): Observable<void> {
    return this.withErrorHandling(
      this.http.delete<void>(`${this.baseUrl}/customers/${id}`)
    );
  }

  searchCustomers(term: string): Observable<Customer[]> {
    return this.withErrorHandling(
      this.http.get<Customer[]>(`${this.baseUrl}/customers/search?term=${term}`)
    );
  }

  // Technician endpoints
  getTechnicians(): Observable<Technician[]> {
    return this.withErrorHandling(
      this.http.get<Technician[]>(`${this.baseUrl}/technicians`)
    );
  }

  getActiveTechnicians(): Observable<Technician[]> {
    return this.withErrorHandling(
      this.http.get<Technician[]>(`${this.baseUrl}/technicians/active`)
    );
  }

  getTechnician(id: string): Observable<Technician> {
    return this.withErrorHandling(
      this.http.get<Technician>(`${this.baseUrl}/technicians/${id}`)
    );
  }

  createTechnician(technician: Technician): Observable<Technician> {
    return this.withErrorHandling(
      this.http.post<Technician>(`${this.baseUrl}/technicians`, technician)
    );
  }

  updateTechnician(id: string, technician: Technician): Observable<Technician> {
    return this.withErrorHandling(
      this.http.put<Technician>(`${this.baseUrl}/technicians/${id}`, technician)
    );
  }

  deleteTechnician(id: string): Observable<void> {
    return this.withErrorHandling(
      this.http.delete<void>(`${this.baseUrl}/technicians/${id}`)
    );
  }

  // Job endpoints
  getJobs(): Observable<Job[]> {
    return this.withErrorHandling(
      this.http.get<Job[]>(`${this.baseUrl}/jobs`)
    );
  }

  getJob(id: string): Observable<Job> {
    return this.withErrorHandling(
      this.http.get<Job>(`${this.baseUrl}/jobs/${id}`)
    );
  }

  createJob(job: Job): Observable<Job> {
    return this.withErrorHandling(
      this.http.post<Job>(`${this.baseUrl}/jobs`, job)
    );
  }

  updateJob(id: string, job: Job): Observable<Job> {
    return this.withErrorHandling(
      this.http.put<Job>(`${this.baseUrl}/jobs/${id}`, job)
    );
  }

  deleteJob(id: string): Observable<void> {
    return this.withErrorHandling(
      this.http.delete<void>(`${this.baseUrl}/jobs/${id}`)
    );
  }

  getJobsByCustomer(customerId: string): Observable<Job[]> {
    return this.withErrorHandling(
      this.http.get<Job[]>(`${this.baseUrl}/jobs/customer/${customerId}`)
    );
  }

  getJobsByTechnician(technicianId: string): Observable<Job[]> {
    return this.withErrorHandling(
      this.http.get<Job[]>(`${this.baseUrl}/jobs/technician/${technicianId}`)
    );
  }

  getJobsByStatus(status: JobStatus): Observable<Job[]> {
    return this.withErrorHandling(
      this.http.get<Job[]>(`${this.baseUrl}/jobs/status/${status}`)
    );
  }

  getJobsByType(jobType: JobType): Observable<Job[]> {
    return this.withErrorHandling(
      this.http.get<Job[]>(`${this.baseUrl}/jobs/type/${jobType}`)
    );
  }

  searchJobs(term: string): Observable<Job[]> {
    return this.withErrorHandling(
      this.http.get<Job[]>(`${this.baseUrl}/jobs/search?term=${term}`)
    );
  }

  // Reseed endpoint
  reseedDatabase(): Observable<any> {
    return this.withErrorHandling(
      this.http.post<any>(`${this.baseUrl}/reseed`, {})
    );
  }
}