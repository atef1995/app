import { ContributionProject } from "./contribution";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProjectApiResponse
  extends ApiResponse<{
    project: ContributionProject;
  }> {
  project?: ContributionProject;
}

export interface SubmissionApiResponse
  extends ApiResponse<{
    submissionId: string;
    status: string;
  }> {
  submissionId?: string;
  status?: string;
}
