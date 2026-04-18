/**
 * @typedef {"top" | "mentor" | "expert" | "phd"} BadgeType
 */

/**
 * @typedef {Object} Reply
 * @property {string} id
 * @property {string} author
 * @property {string} role
 * @property {string} text
 * @property {string} createdAt
 * @property {number} likes
 */

/**
 * @typedef {Object} Answer
 * @property {string} id
 * @property {string} author
 * @property {boolean} accent
 * @property {string} subtitle
 * @property {string} createdAt
 * @property {BadgeType[]} badges
 * @property {number} likes
 * @property {string[]} paragraphs
 * @property {Reply[]} replies
 */

/**
 * @typedef {Object} ContributorStats
 * @property {string} answer
 * @property {string} approved
 * @property {string} joined
 */

/**
 * @typedef {Object} Contributor
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} org
 * @property {BadgeType[]} badges
 * @property {ContributorStats} stats
 */

/**
 * @typedef {Object} ThreadCategoryChip
 * @property {string} id
 * @property {string} label
 * @property {string} tone
 */

/**
 * @typedef {Object} ViewerProfile
 * @property {string} name
 * @property {string} role
 * @property {string} subtitle
 * @property {boolean} isAlumni
 * @property {string} [alumniRole]
 * @property {string} [alumniSubtitle]
 */

export {};
