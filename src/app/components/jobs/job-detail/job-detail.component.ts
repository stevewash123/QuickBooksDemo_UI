import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { QuickBooksService } from '../../../services/quickbooks.service';
import { NotificationService } from '../../../services/notification.service';
import { TourService } from '../../../services/tour.service';
import { Job, JobStatus, JobType } from '../../../models/job.model';

interface QuickBooksActivity {
  type: string;
  quickBooksId: string;
  date: Date;
}

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css'
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  quickBooksActivity: QuickBooksActivity[] = [];

  constructor(
    private apiService: ApiService,
    private quickBooksService: QuickBooksService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private tourService: TourService
  ) {}

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJob(jobId);
    }

    // Advance tour if active and on step 3 (coming from completed job click)
    if (this.tourService.isTourRunning() && this.tourService.getCurrentStep() === 2) {
      setTimeout(() => {
        this.tourService.advanceTour();
      }, 1000); // Wait for page to render
    }
  }

  loadJob(id: string) {
    this.apiService.getJob(id).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.loading = false;
      }
    });
  }

  getStatusIcon(status: JobStatus | number): string {
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
      case JobStatus.Quote: return '🟡';
      case JobStatus.InProgress: return '🔵';
      case JobStatus.Completed: return '🟢';
      default: return '⚪';
    }
  }

  getStatusText(status: JobStatus | number): string {
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
      case JobStatus.Quote: return 'Quote';
      case JobStatus.InProgress: return 'In Progress';
      case JobStatus.Completed: return 'Completed';
      default: return 'Unknown';
    }
  }

  getJobTypeText(jobType: JobType | number): string {
    // Handle both enum values and integer ordinal values
    if (typeof jobType === 'number') {
      switch (jobType) {
        case 0: return 'Installation';
        case 1: return 'Service Call';
        case 2: return 'Repair';
        default: return 'Unknown';
      }
    }

    // Handle string/enum values
    switch (jobType) {
      case JobType.Installation: return 'Installation';
      case JobType.ServiceCall: return 'Service Call';
      case JobType.Repair: return 'Repair';
      default: return 'Unknown';
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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  editJob() {
    if (this.job) {
      this.router.navigate(['/jobs', this.job.id, 'edit']);
    }
  }

  deleteJob() {
    if (this.job && confirm('Are you sure you want to delete this job?')) {
      const jobId = this.job.id;
      this.apiService.deleteJob(jobId).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            `Job ${jobId} has been deleted successfully!`,
            'Job Deleted'
          );
          this.router.navigate(['/jobs']);
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          // Error notification is handled by the ApiService
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/jobs']);
  }

  getTotalMaterialCost(): number {
    return this.job?.lineItems.reduce((sum, item) => sum + item.materialCost, 0) || 0;
  }

  getTotalLaborCost(): number {
    return this.job?.lineItems.reduce((sum, item) => sum + item.laborCost, 0) || 0;
  }

  // QuickBooks Methods
  sendToQuickBooks(type: 'invoice' | 'estimate') {
    if (!this.job) return;

    const asInvoice = type === 'invoice';

    // Handle tour advancement regardless of QB success/failure
    const isTourActive = this.tourService.isTourRunning();
    const currentStep = this.tourService.getCurrentStep();

    this.quickBooksService.sendJobToQuickBooks(this.job.id, asInvoice)
      .subscribe({
        next: (response) => {
          // Add to activity log
          this.quickBooksActivity.unshift({
            type: type === 'invoice' ? 'Invoice Created' : 'Estimate Created',
            quickBooksId: response.quickBooksId,
            date: new Date()
          });

          const docType = type === 'invoice' ? 'Invoice' : 'Estimate';
          this.notificationService.showSuccess(
            `${docType} ${response.quickBooksId} successfully sent to QuickBooks!`,
            'QuickBooks Success'
          );

          // Advance tour to invoices page if active
          if (isTourActive && currentStep === 4 && asInvoice) {
            setTimeout(() => {
              this.tourService.advanceToInvoicesPage();
            }, 2000); // Wait for notification to show
          }
        },
        error: (error) => {
          console.error('Error sending to QuickBooks:', error);

          // Even if QB fails, continue tour for demo purposes
          if (isTourActive && currentStep === 4 && asInvoice) {
            this.notificationService.showSuccess(
              'Demo: Simulating invoice creation for tour purposes!',
              'Demo Mode'
            );
            setTimeout(() => {
              this.tourService.advanceToInvoicesPage();
            }, 2000);
          }
          // Error notification is handled by the QuickBooksService
        }
      });
  }
}