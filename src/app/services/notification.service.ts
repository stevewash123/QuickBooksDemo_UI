import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string = 'Success') {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string = 'Error') {
    this.toastr.error(message, title);
  }

  showWarning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title);
  }

  showInfo(message: string, title: string = 'Info') {
    this.toastr.info(message, title);
  }

  showServerError() {
    this.toastr.error(
      'Unable to connect to the server. Please check if the API server is running and try again.',
      'Connection Error',
      {
        timeOut: 8000,
        extendedTimeOut: 3000
      }
    );
  }

  showNetworkError() {
    this.toastr.error(
      'Network error occurred. Please check your internet connection and try again.',
      'Network Error',
      {
        timeOut: 8000,
        extendedTimeOut: 3000
      }
    );
  }

  showGeneralError(error?: any) {
    let message = 'An unexpected error occurred. Please try again.';

    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    }

    this.toastr.error(message, 'Error', {
      timeOut: 6000,
      extendedTimeOut: 2000
    });
  }
}