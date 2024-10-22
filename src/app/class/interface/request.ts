export interface Request {
    id: string;
    studentId: string;
    studentIdentification: string;
    studentName: string;
    serviceId: string;
    serviceName: string;
    serviceType: string;
    status: string;
    files: Array<any>[]
  }