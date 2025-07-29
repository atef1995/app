"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
exports.generateUniqueSlug = generateUniqueSlug;
/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
/**
 * Generate a unique slug by appending a number if needed
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
function generateUniqueSlug(baseSlug, existingSlugs) {
    var uniqueSlug = baseSlug;
    var counter = 1;
    while (existingSlugs.includes(uniqueSlug)) {
        uniqueSlug = "".concat(baseSlug, "-").concat(counter);
        counter++;
    }
    return uniqueSlug;
}
