import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tour-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" (click)="onCancel()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h2>🎯 Welcome to QuickBooks Demo!</h2>
        </div>

        <div class="dialog-body">
          <p class="intro-text">
            Would you like to take a guided tour to see how the integration works?
          </p>

          <div class="tour-features">
            <h3>The tour will show you:</h3>
            <ul>
              <li>📋 Local job management</li>
              <li>🔗 Creating invoices in QuickBooks</li>
              <li>⚡ Real-time data synchronization</li>
              <li>💼 Eliminating double-entry workflow</li>
            </ul>
          </div>

          <p class="tour-duration">
            <strong>Duration:</strong> About 2-3 minutes
          </p>
        </div>

        <div class="dialog-actions">
          <button class="btn btn-secondary" (click)="onCancel()">
            Skip Tour
          </button>
          <button class="btn btn-primary" (click)="onAccept()">
            Start Demo Tour
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    }

    .dialog-content {
      background: white;
      border-radius: 12px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease-out;
    }

    .dialog-header {
      padding: 24px 24px 0 24px;
      text-align: center;
    }

    .dialog-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .dialog-body {
      padding: 20px 24px;
    }

    .intro-text {
      font-size: 1.1rem;
      color: #495057;
      margin-bottom: 20px;
      text-align: center;
    }

    .tour-features {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
    }

    .tour-features h3 {
      margin: 0 0 12px 0;
      color: #495057;
      font-size: 1rem;
      font-weight: 600;
    }

    .tour-features ul {
      margin: 0;
      padding-left: 20px;
      color: #6c757d;
    }

    .tour-features li {
      margin-bottom: 8px;
      font-size: 0.95rem;
    }

    .tour-duration {
      text-align: center;
      color: #6c757d;
      font-size: 0.9rem;
      margin: 16px 0 0 0;
    }

    .dialog-actions {
      padding: 0 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 120px;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-primary {
      background: #28a745;
      color: white;
    }

    .btn-primary:hover {
      background: #218838;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class TourDialogComponent {
  @Output() accept = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onAccept() {
    this.accept.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}