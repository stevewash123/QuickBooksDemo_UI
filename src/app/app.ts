import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TourService } from './services/tour.service';
import { TourDialogComponent } from './components/tour-dialog/tour-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TourDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'QuickBooks Demo: Cripple Creek Electrical Contractors';
  showTourDialog = false;

  constructor(private tourService: TourService) {}

  ngOnInit() {
    // Prompt user for tour on first visit
    setTimeout(() => {
      if (this.tourService.shouldAutoStartTour()) {
        this.showTourDialog = true;
      }
    }, 1000); // Delay to ensure page is fully loaded
  }

  startTour() {
    console.log('Demo Tour button clicked!');
    this.tourService.restartTour();
  }

  onTourAccepted() {
    this.showTourDialog = false;
    this.tourService.startTour();
  }

  onTourCanceled() {
    this.showTourDialog = false;
    this.tourService.markTourCompleted();
  }
}
