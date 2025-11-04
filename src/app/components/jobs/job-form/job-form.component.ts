import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';
import { Job, JobStatus, JobType } from '../../../models/job.model';
import { Customer } from '../../../models/customer.model';
import { Technician } from '../../../models/technician.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css'
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  customers: Customer[] = [];
  technicians: Technician[] = [];
  isEditing = false;
  loading = false;
  loadingCustomers = false;
  loadingTechnicians = false;
  loadingJob = false;

  // Enums for template
  JobStatus = JobStatus;
  JobType = JobType;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.fb.group({
      customerId: ['', Validators.required],
      jobType: [1, Validators.required], // ServiceCall = 1
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: [0, Validators.required], // Quote = 0
      assignedTechnicianId: [''],
      scheduledDate: [''],
      quotedAmount: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() {
    this.loadCustomers();
    this.loadTechnicians();

    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.isEditing = true;
      this.loadJob(jobId);
    }
  }

  loadCustomers() {
    this.loadingCustomers = true;
    this.apiService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.loadingCustomers = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.loadingCustomers = false;
      }
    });
  }

  loadTechnicians() {
    this.loadingTechnicians = true;
    this.apiService.getActiveTechnicians().subscribe({
      next: (technicians) => {
        this.technicians = technicians;
        this.loadingTechnicians = false;
      },
      error: (error) => {
        console.error('Error loading technicians:', error);
        this.loadingTechnicians = false;
      }
    });
  }

  loadJob(id: string) {
    this.loadingJob = true;
    this.apiService.getJob(id).subscribe({
      next: (job) => {
        this.jobForm.patchValue({
          customerId: job.customerId,
          jobType: job.jobType,
          description: job.description,
          status: job.status,
          assignedTechnicianId: job.assignedTechnicianId || '',
          scheduledDate: job.scheduledDate ? this.formatDateForInput(job.scheduledDate) : '',
          quotedAmount: job.quotedAmount || 0
        });
        this.loadingJob = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.loadingJob = false;
      }
    });
  }

  onSubmit() {
    if (this.jobForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.jobForm.value;

    const jobData: Partial<Job> = {
      customerId: formValue.customerId,
      jobType: formValue.jobType,
      description: formValue.description,
      status: formValue.status,
      assignedTechnicianId: formValue.assignedTechnicianId || undefined,
      scheduledDate: formValue.scheduledDate ? new Date(formValue.scheduledDate) : undefined,
      quotedAmount: formValue.quotedAmount || 0,
      lineItems: []
    };

    const request = this.isEditing
      ? this.apiService.updateJob(this.route.snapshot.paramMap.get('id')!, jobData as Job)
      : this.apiService.createJob(jobData as Job);

    request.subscribe({
      next: (result) => {
        const action = this.isEditing ? 'updated' : 'created';
        this.notificationService.showSuccess(
          `Job ${result.id} has been ${action} successfully!`,
          'Job Saved'
        );
        this.router.navigate(['/jobs', result.id]);
      },
      error: (error) => {
        console.error('Error saving job:', error);
        this.loading = false;
        // Error notification is handled by the ApiService
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.jobForm.controls).forEach(key => {
      const control = this.jobForm.get(key);
      control?.markAsTouched();
    });
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getFieldError(fieldName: string): string {
    const control = this.jobForm.get(fieldName);
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (control.errors['minlength']) {
      return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['min']) {
      return `${this.getFieldDisplayName(fieldName)} must be greater than or equal to ${control.errors['min'].min}`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      customerId: 'Customer',
      jobType: 'Job Type',
      description: 'Description',
      status: 'Status',
      quotedAmount: 'Estimated Amount'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.jobForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  cancel() {
    if (this.isEditing) {
      this.router.navigate(['/jobs', this.route.snapshot.paramMap.get('id')]);
    } else {
      this.router.navigate(['/jobs']);
    }
  }
}