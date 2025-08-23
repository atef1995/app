import { prisma } from "@/lib/prisma";
import { Skill } from "@prisma/client";

/**
 * Service for managing skills in the database
 */
export class SkillService {
  /**
   * Get all skills from database
   */
  static async getAllSkills(): Promise<Skill[]> {
    try {
      return await prisma.skill.findMany({
        orderBy: [
          { category: 'asc' },
          { order: 'asc' },
          { name: 'asc' }
        ]
      });
    } catch (error) {
      console.error("Error fetching skills:", error);
      return [];
    }
  }

  /**
   * Get skills by category
   */
  static async getSkillsByCategory(category: string): Promise<Skill[]> {
    try {
      return await prisma.skill.findMany({
        where: { category },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' }
        ]
      });
    } catch (error) {
      console.error(`Error fetching skills for category ${category}:`, error);
      return [];
    }
  }

  /**
   * Extract skills from content based on keywords matching database skills
   */
  static async extractSkillsFromContent(
    title: string,
    description: string | null,
    category?: string
  ): Promise<string[]> {
    try {
      const skills = category 
        ? await this.getSkillsByCategory(category)
        : await this.getAllSkills();

      const text = `${title} ${description || ""}`.toLowerCase();
      const matchedSkills: string[] = [];

      for (const skill of skills) {
        // Check if any of the skill's keywords match the content
        const keywordMatch = skill.keywords.some(keyword => 
          text.includes(keyword.toLowerCase())
        );
        
        // Also check if the skill name itself is mentioned
        const nameMatch = text.includes(skill.name.toLowerCase());

        if (keywordMatch || nameMatch) {
          matchedSkills.push(skill.name);
        }
      }

      return matchedSkills;
    } catch (error) {
      console.error("Error extracting skills from content:", error);
      // Fallback to empty array if database is unavailable
      return [];
    }
  }

  /**
   * Get skills by phase keywords (for phase-specific skill matching)
   */
  static async getSkillsByKeywords(keywords: string[]): Promise<Skill[]> {
    try {
      return await prisma.skill.findMany({
        where: {
          OR: keywords.map(keyword => ({
            keywords: {
              has: keyword
            }
          }))
        },
        orderBy: [
          { category: 'asc' },
          { order: 'asc' },
          { name: 'asc' }
        ]
      });
    } catch (error) {
      console.error("Error fetching skills by keywords:", error);
      return [];
    }
  }

  /**
   * Create a new skill
   */
  static async createSkill(skillData: {
    slug: string;
    name: string;
    description?: string;
    category: string;
    keywords: string[];
    iconName: string;
    level?: string;
    order?: number;
  }): Promise<Skill> {
    return await prisma.skill.create({
      data: {
        slug: skillData.slug,
        name: skillData.name,
        description: skillData.description,
        category: skillData.category,
        keywords: skillData.keywords,
        iconName: skillData.iconName,
        level: skillData.level || "BEGINNER",
        order: skillData.order || 0,
      }
    });
  }
}