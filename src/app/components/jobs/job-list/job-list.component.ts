import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Job, JobStatus, JobType } from '../../../models/job.model';
import { Technician } from '../../../models/technician.model';
import { Subscription, filter } from 'rxjs';
import { JobTypePipe } from '../../../pipes/job-type.pipe';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, JobTypePipe],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  technicians: Technician[] = [];
  private routerSubscription?: Subscription;
  reseedingInProgress = false;

  // Filters
  selectedStatus = 'all';
  selectedType = 'all';
  selectedTechnician = 'all';
  searchTerm = '';

  // Enums for template
  JobStatus = JobStatus;
  JobType = JobType;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadJobs();
    this.loadTechnicians();

    // Subscribe to router events to refresh data when navigating back to jobs list
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/jobs') {
          this.loadJobs();
        }
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  loadJobs() {
    this.apiService.getJobs().subscribe({
      next: (jobs) => {
        console.log('Loaded jobs:', jobs);
        if (jobs.length > 0) {
          console.log('First job status:', jobs[0].status, 'Type:', typeof jobs[0].status);
        }
        this.jobs = jobs;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
      }
    });
  }

  loadTechnicians() {
    this.apiService.getTechnicians().subscribe({
      next: (technicians) => {
        this.technicians = technicians;
      },
      error: (error) => {
        console.error('Error loading technicians:', error);
      }
    });
  }

  applyFilters() {
    let filtered = this.jobs;

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(job => {
        // Handle both string and number status values
        if (typeof job.status === 'number') {
          // Convert number to string enum value for comparison
          const statusString = this.getEnumStringFromNumber(job.status);
          return statusString === this.selectedStatus;
        }
        return job.status === this.selectedStatus;
      });
    }

    // Type filter
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(job => job.jobType === this.selectedType);
    }

    // Technician filter
    if (this.selectedTechnician !== 'all') {
      filtered = filtered.filter(job => job.assignedTechnicianId === this.selectedTechnician);
    }

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(job =>
        job.customerName.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        (job.assignedTechnicianName && job.assignedTechnicianName.toLowerCase().includes(term))
      );
    }

    this.filteredJobs = filtered;
  }

  onFilterChange() {
    this.applyFilters();
  }

  getStatusIcon(status: JobStatus | string | number): string {
    // Handle both enum values and integer ordinal values
    if (typeof status === 'number') {
      switch (status) {
        case 0: return '🟡'; // Quote
        case 1: return '🔵'; // InProgress
        case 2: return '🟢'; // Completed
        default: return '⚪';
      }
    }

    // Handle string/enum values
    switch (status) {
      case JobStatus.Quote:
      case 'Quote': return '🟡';
      case JobStatus.InProgress:
      case 'InProgress': return '🔵';
      case JobStatus.Completed:
      case 'Completed': return '🟢';
      default: return '⚪';
    }
  }

  getStatusText(status: JobStatus | string | number): string {
    // Handle both enum values and integer ordinal values
    if (typeof status === 'number') {
      switch (status) {
        case 0: return 'Quote';
        case 1: return 'In Progress';
        case 2: return 'Completed';
        default: return 'Unknown';
      }
    }

    // Handle string/enum values
    switch (status) {
      case JobStatus.Quote:
      case 'Quote': return 'Quote';
      case JobStatus.InProgress:
      case 'InProgress': return 'In Progress';
      case JobStatus.Completed:
      case 'Completed': return 'Completed';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: JobStatus | string | number): string {
    // Handle both enum values and integer ordinal values
    if (typeof status === 'number') {
      switch (status) {
        case 0: return 'status-quote';
        case 1: return 'status-progress';
        case 2: return 'status-complete';
        default: return 'status-default';
      }
    }

    // Handle string/enum values
    switch (status) {
      case JobStatus.Quote:
      case 'Quote': return 'status-quote';
      case JobStatus.InProgress:
      case 'InProgress': return 'status-progress';
      case JobStatus.Completed:
      case 'Completed': return 'status-complete';
      default: return 'status-default';
    }
  }

  private getEnumStringFromNumber(status: number): string {
    switch (status) {
      case 0: return 'Quote';
      case 1: return 'InProgress';
      case 2: return 'Completed';
      default: return '';
    }
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
      day: 'numeric'
    });
  }

  createNewJob() {
    this.router.navigate(['/jobs/new']);
  }

  viewJob(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }

  reseedDatabase() {
    if (this.reseedingInProgress) return;

    const confirmed = confirm(
      'This will reset all data to the initial demo state and manage QuickBooks invoices. ' +
      'Any custom data will be lost. Continue?'
    );

    if (!confirmed) return;

    this.reseedingInProgress = true;

    this.apiService.reseedDatabase().subscribe({
      next: (response) => {
        console.log('Reseed response:', response);
        alert('Database reseeded successfully! The page will refresh to show the new data.');

        // Reload the jobs data
        this.loadJobs();
        this.loadTechnicians();

        this.reseedingInProgress = false;
      },
      error: (error) => {
        console.error('Reseed failed:', error);
        alert('Failed to reseed database. Please check the console for details.');
        this.reseedingInProgress = false;
      }
    });
  }
}