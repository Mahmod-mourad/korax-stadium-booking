/**
 * Services barrel export
 *
 * هنا بيتجمع كل الـ services
 * لما يتم ربط backend حقيقي:
 *  - ابعت requests لـ API بدل mock data
 *  - نفس الـ interface — الشاشات ما تتغيرش
 */
export { Storage, STORAGE_KEYS } from './storage';
export type { StorageKey } from './storage';
