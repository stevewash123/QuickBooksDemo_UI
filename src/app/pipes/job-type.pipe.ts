import { Pipe, PipeTransform } from '@angular/core';
import { JobType } from '../models/job.model';

@Pipe({
  name: 'jobType',
  standalone: true
})
export class JobTypePipe implements PipeTransform {
  transform(value: JobType | number | string): string {
    if (typeof value === 'number') {
      switch (value) {
        case 0: return 'Installation';
        case 1: return 'Service Call';
        case 2: return 'Repair';
        default: return 'Unknown';
      }
    }

    if (typeof value === 'string') {
      switch (value) {
        case 'Installation': return 'Installation';
        case 'ServiceCall': return 'Service Call';
        case 'Repair': return 'Repair';
        default: return value;
      }
    }

    return 'Unknown';
  }
}