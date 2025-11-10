import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private isMovingForward = true;
  private isTourActive = false;
  private currentStep = 0;

  private driverInstance: any = null;

  constructor(private router: Router) {}

  getCurrentStep(): number {
    return this.currentStep;
  }

  isTourRunning(): boolean {
    return this.isTourActive;
  }

  advanceTour(): void {
    if (this.driverInstance && this.isTourActive) {
      this.driverInstance.moveNext();
    }
  }

  advanceToInvoicesPage(): void {
    if (this.driverInstance && this.isTourActive) {
      // Navigate to invoices and advance tour
      this.router.navigate(['/invoices']).then(() => {
        setTimeout(() => {
          this.driverInstance.moveNext();
        }, 500);
      });
    }
  }

  startTour(): void {
    console.log('Starting comprehensive Driver.js tour...');

    // Start tour on Jobs page
    this.router.navigate(['/jobs']).then(() => {
      setTimeout(() => {
        // Debug: Check if elements exist
        console.log('Checking tour elements...');
        console.log('App header:', document.querySelector('.app-header'));
        console.log('Jobs grid:', document.querySelector('#jobs-grid'));
        console.log('All job rows:', document.querySelectorAll('.job-row'));
        console.log('Completed job row:', document.querySelector('.completed-job-row'));
        this.isTourActive = true;
        this.currentStep = 0;

        this.driverInstance = driver({
          showProgress: true,
          animate: true,
          overlayColor: '#000',
          overlayOpacity: 0.7,
          onDestroyed: () => {
            console.log('Tour completed or exited');
            this.isTourActive = false;
            this.currentStep = 0;
            this.markTourCompleted();
          },
          onHighlighted: (element, step, options) => {
            this.currentStep = options.state ? options.state.activeIndex || 0 : 0;
            console.log('Step highlighted:', this.currentStep, step);
          },
          steps: [
            // Step 1: Welcome
            {
              element: '.app-header',
              popover: {
                title: 'Welcome to the QuickBooks Integration Demo! 👋',
                description: `
                  <p>This demo shows a real working integration between a job management system and QuickBooks Online.</p>
                  <p><strong>We'll walk you through:</strong></p>
                  <p>• Viewing local job data<br>
                     • Completing a job<br>
                     • Creating an invoice in QuickBooks<br>
                     • Viewing invoices synced from QuickBooks</p>
                  <p>Click Next to begin the tour, or Skip to explore on your own.</p>
                `,
                side: "bottom",
                align: 'center'
              }
            },
            // Step 2: Jobs Grid (disable buttons during this step)
            {
              element: '#jobs-grid',
              popover: {
                title: 'Jobs Browser - Local Application Data',
                description: `
                  <p>This is your Jobs grid. This data is stored only in your local application database, not in QuickBooks.</p>
                  <p><strong>These jobs can include:</strong></p>
                  <p>• Potential customers you're quoting<br>
                     • Work in progress<br>
                     • Jobs not yet ready to invoice</p>
                  <p>This gives you flexibility to track work before it becomes billable in QuickBooks.</p>
                `,
                side: "right",
                align: 'start'
              }
            },
            // Step 3: Completed Job (no Next button - user must click View Details)
            {
              element: '.completed-job-row',
              popover: {
                title: 'Completed Job Ready to Invoice',
                description: `
                  <p>This job has been marked as "Completed" and is ready to be invoiced.</p>
                  <p><strong>Click "View Details" on this job to continue the demo and see how to create an invoice in QuickBooks.</strong></p>
                `,
                side: "top",
                showButtons: []
              }
            },
            // Step 4: Job Details Overview
            {
              element: '#job-details',
              popover: {
                title: 'Job Details - Ready for Invoice',
                description: `
                  <p>Here you can see all the completed job information:</p>
                  <p>• <strong>Customer details</strong> - Contact info and job location<br>
                     • <strong>Line items</strong> - Labor hours, materials, and costs<br>
                     • <strong>Totals</strong> - Complete breakdown of charges</p>
                  <p>This data will be automatically transferred to QuickBooks to create a professional invoice.</p>
                `,
                side: "left",
                align: 'start'
              }
            },
            // Step 5: Invoice Creation Button
            {
              element: '#create-invoice-btn',
              popover: {
                title: 'Create QuickBooks Invoice',
                description: `
                  <p>Click this button to send the job data to QuickBooks and create an invoice.</p>
                  <p><strong>This eliminates double-entry by:</strong></p>
                  <p>• Automatically transferring customer info<br>
                     • Converting line items to invoice items<br>
                     • Calculating totals and taxes</p>
                  <p><strong>Click "Send Invoice to QB" to continue!</strong></p>
                `,
                side: "top",
                showButtons: []
              }
            },
            // Step 6: Invoices page (after they create invoice)
            {
              element: '#invoices-grid',
              popover: {
                title: 'Invoices Browser - Live QuickBooks Data 🔗',
                description: `
                  <p>This page displays invoices loaded FROM QuickBooks Online in real-time.</p>
                  <p><strong>Key differences from the Jobs browser:</strong></p>
                  <p>• This data comes directly from QuickBooks<br>
                     • Any invoice created in QuickBooks appears here<br>
                     • Changes in QuickBooks are reflected here<br>
                     • This is synchronized, live data</p>
                  <p>Notice the QuickBooks logo icons indicating this is synced data.</p>
                `,
                side: "right"
              }
            },
            {
              element: '.new-invoice-highlight',
              popover: {
                title: 'Your New Invoice',
                description: `
                  <p>Here's the invoice we just created!</p>
                  <p>This invoice now exists in your QuickBooks Online account. If you log into QuickBooks directly, you'll see this exact invoice there.</p>
                  <p><strong>This demonstrates true bidirectional integration:</strong></p>
                  <p>• Local job data → QuickBooks invoice (write)<br>
                     • QuickBooks invoices → displayed here (read)</p>
                `,
                side: "top"
              }
            },
            {
              element: '.app-header',
              popover: {
                title: 'Demo Complete! 🎉',
                description: `
                  <p><strong>You've seen how the integration works:</strong></p>
                  <p>1. ✅ Track jobs locally (flexibility before invoicing)<br>
                     2. ✅ Send completed jobs to QuickBooks as invoices<br>
                     3. ✅ View all QuickBooks invoices in real-time</p>
                  <p><strong>Key Benefits:</strong></p>
                  <p>• No double-entry between systems<br>
                     • One-click invoice creation<br>
                     • Always see current QuickBooks data<br>
                     • Track pre-invoice work locally</p>
                  <p>Click "Restart Tour" anytime to see it again, or use the button in the navigation menu.</p>
                `,
                side: "bottom",
                align: 'center'
              }
            }
          ] // End of simplified steps
        });

        this.driverInstance.drive();

        console.log('Comprehensive Driver.js tour started');
      }, 500); // Wait for page to render
    });
  }

  shouldAutoStartTour(): boolean {
    return !localStorage.getItem('quickbooks-demo-tour-completed');
  }

  markTourCompleted(): void {
    localStorage.setItem('quickbooks-demo-tour-completed', 'true');
  }

  restartTour(): void {
    localStorage.removeItem('quickbooks-demo-tour-completed');
    this.startTour();
  }
}
