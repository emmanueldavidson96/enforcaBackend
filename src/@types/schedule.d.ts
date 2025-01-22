export interface CreateScheduleInput {
    title: string;
    startDate: Date;
    endDate: Date;
    description?: string;
    type?: 'interview' | 'meeting' | 'webinar' | 'other';
    location?: string;
    companyName?: string;
    department?: string;
    participants?: string[];
    isRecurring?: boolean;
    recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'none';
}

export interface UpdateScheduleInput extends Partial<CreateScheduleInput> {
    status?: 'scheduled' | 'completed' | 'cancelled';
}

export interface ScheduleQueryParams {
    startDate?: Date;
    endDate?: Date;
    type?: string;
    status?: string;
}