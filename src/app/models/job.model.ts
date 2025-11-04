export enum JobStatus {
  Quote = 'Quote',
  InProgress = 'InProgress',
  Completed = 'Completed'
}

export enum JobType {
  Installation = 'Installation',
  ServiceCall = 'ServiceCall',
  Repair = 'Repair'
}

export interface LineItem {
  id: string;
  description: string;
  materialCost: number;
  laborHours: number;
  laborCost: number;
  totalCost: number;
}

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  status: JobStatus | number;
  jobType: JobType;
  description: string;
  quotedAmount: number;
  actualAmount?: number;
  createdDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  lineItems: LineItem[];
  totalLineItemCost: number;
  totalLaborHours: number;
}