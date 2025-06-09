/**
 * Story status enumeration as defined in the database schema
 */
export enum StoryStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  PENDING_APPROVAL = 'pending_approval',
  PUBLISHED = 'published',
}
