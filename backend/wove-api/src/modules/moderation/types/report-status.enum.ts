/**
 * Enum for content report status
 */
export enum ReportStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
  ESCALATED = 'escalated',
  ACTION_TAKEN = 'action_taken',
  NO_ACTION_NEEDED = 'no_action_needed',
}
