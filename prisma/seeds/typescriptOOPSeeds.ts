import { PrismaClient } from "@prisma/client";

export const typescriptOOPTutorials = [
  {
    slug: "typescript-oop-overview",
    title: "TypeScript OOP - Complete Guide Overview",
    description: "Your roadmap to mastering object-oriented programming with TypeScript. Learn the fundamentals and discover advanced patterns",
    mdxFile: "03-typescript-oop.mdx",
    difficulty: 2,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 15.0,
  },
  {
    slug: "typescript-classes-fundamentals",
    title: "TypeScript Classes Fundamentals",
    description: "Master TypeScript classes with type safety, access modifiers, and advanced class features that make JavaScript OOP bulletproof",
    mdxFile: "04-typescript-classes.mdx",
    difficulty: 3,
    order: 2,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 30.0,
  },
  {
    slug: "typescript-interfaces",
    title: "TypeScript Interfaces - Ultimate Contracts",
    description: "Master TypeScript interfaces to define bulletproof contracts for your code. Learn interface implementation, extension, and advanced patterns",
    mdxFile: "05-typescript-interfaces.mdx",
    difficulty: 3,
    order: 3,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 35.0,
  },
  {
    slug: "typescript-inheritance",
    title: "Inheritance in TypeScript - Building Family Trees",
    description: "Master TypeScript inheritance with class hierarchies, method overriding, super keyword, and advanced inheritance patterns",
    mdxFile: "06-typescript-inheritance.mdx",
    difficulty: 3,
    order: 4,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 40.0,
  },
  {
    slug: "typescript-abstract-classes",
    title: "TypeScript Abstract Classes - Ultimate Blueprints",
    description: "Master TypeScript abstract classes to create bulletproof templates that force implementation while providing shared functionality",
    mdxFile: "07-typescript-abstract-classes.mdx",
    difficulty: 4,
    order: 5,
    published: true,
    isPremium: true,
    requiredPlan: "PRO",
    estimatedTime: 35.0,
  },
  {
    slug: "typescript-design-patterns",
    title: "TypeScript Design Patterns - Professional Solutions",
    description: "Master essential design patterns in TypeScript including Singleton, Factory, Observer, Strategy, and more. Build professional, maintainable code",
    mdxFile: "08-typescript-design-patterns.mdx",
    difficulty: 4,
    order: 6,
    published: true,
    isPremium: true,
    requiredPlan: "PRO",
    estimatedTime: 50.0,
  },
];

export const typescriptOOPQuizzes = [
  {
    slug: "typescript-oop-overview-quiz",
    title: "TypeScript OOP Overview Quiz",
    questions: {
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: "What is the main advantage of TypeScript over JavaScript for OOP?",
          options: [
            "Faster runtime performance",
            "Compile-time type checking and better IDE support", 
            "Smaller bundle sizes",
            "Better browser compatibility"
          ],
          correct: 1,
          explanation: "TypeScript provides compile-time type checking, better IDE support with IntelliSense, and helps catch errors before runtime."
        },
        {
          id: "q2", 
          type: "multiple-choice",
          question: "Which TypeScript OOP feature allows you to define contracts that classes must follow?",
          options: [
            "Abstract Classes",
            "Inheritance",
            "Interfaces",
            "Generics"
          ],
          correct: 2,
          explanation: "Interfaces in TypeScript define contracts that specify what properties and methods a class must implement."
        },
        {
          id: "q3",
          type: "multiple-choice", 
          question: "What is the correct learning order for TypeScript OOP concepts?",
          options: [
            "Design Patterns → Classes → Interfaces",
            "Classes → Interfaces → Inheritance → Abstract Classes → Design Patterns",
            "Inheritance → Classes → Interfaces",
            "Abstract Classes → Interfaces → Classes"
          ],
          correct: 1,
          explanation: "The recommended learning path starts with Classes (fundamentals), then Interfaces (contracts), Inheritance (code reuse), Abstract Classes (templates), and finally Design Patterns (professional solutions)."
        },
        {
          id: "q4",
          type: "code-completion",
          question: "Complete the interface definition for a playable instrument:",
          codeTemplate: `interface Playable {\n  name: ____;\n  ____(): string;\n}`,
          correctAnswer: `interface Playable {\n  name: string;\n  play(): string;\n}`,
          explanation: "An interface for a playable instrument should have a name property of type string and a play method that returns a string."
        },
        {
          id: "q5",
          type: "true-false",
          question: "TypeScript interfaces can contain both abstract and concrete methods.",
          correct: false,
          explanation: "TypeScript interfaces only define contracts (method signatures and property types). They cannot contain concrete implementations. That's what abstract classes are for."
        }
      ],
      metadata: {
        totalQuestions: 5,
        passingScore: 80,
        timeLimit: 300
      }
    }
  },
  {
    slug: "typescript-classes-fundamentals-quiz", 
    title: "TypeScript Classes Fundamentals Quiz",
    questions: {
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: "Which access modifier allows a property to be accessed by child classes but not external code?",
          options: [
            "private",
            "protected", 
            "public",
            "readonly"
          ],
          correct: 1,
          explanation: "The 'protected' access modifier allows access from the declaring class and its subclasses, but not from external code."
        },
        {
          id: "q2",
          type: "code-completion",
          question: "Complete the TypeScript class with proper access modifiers:",
          codeTemplate: `class BankAccount {\n  ____ balance: number;\n  ____ owner: string;\n  \n  constructor(owner: string, balance: number) {\n    this.owner = owner;\n    this.balance = balance;\n  }\n}`,
          correctAnswer: `class BankAccount {\n  private balance: number;\n  public owner: string;\n  \n  constructor(owner: string, balance: number) {\n    this.owner = owner;\n    this.balance = balance;\n  }\n}`,
          explanation: "Balance should be private (sensitive data), while owner can be public (general information)."
        },
        {
          id: "q3",
          type: "multiple-choice",
          question: "What is the purpose of the constructor parameter properties shortcut in TypeScript?",
          options: [
            "To make constructors run faster",
            "To automatically create class properties from constructor parameters",
            "To add type checking to parameters", 
            "To make properties readonly"
          ],
          correct: 1,
          explanation: "Constructor parameter properties automatically create class properties from constructor parameters, reducing boilerplate code."
        },
        {
          id: "q4",
          type: "true-false", 
          question: "Static methods can be called without creating an instance of the class.",
          correct: true,
          explanation: "Static methods belong to the class itself, not to instances, so they can be called directly on the class without creating an instance."
        },
        {
          id: "q5",
          type: "multiple-choice",
          question: "What happens if you try to access a private property from outside the class in TypeScript?",
          options: [
            "It returns undefined",
            "It throws a runtime error",
            "It causes a compile-time error",
            "It works normally"
          ],
          correct: 2,
          explanation: "TypeScript prevents access to private properties at compile time, catching errors before the code runs."
        }
      ],
      metadata: {
        totalQuestions: 5,
        passingScore: 80,
        timeLimit: 420
      }
    }
  },
  {
    slug: "typescript-interfaces-quiz",
    title: "TypeScript Interfaces Quiz", 
    questions: {
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: "What is the main difference between interfaces and type aliases in TypeScript?",
          options: [
            "Interfaces are faster at runtime",
            "Interfaces can be extended and merged, types cannot be merged",
            "Type aliases support generics, interfaces don't",
            "There is no difference"
          ],
          correct: 1,
          explanation: "Interfaces can be extended with 'extends' and can be merged (declaration merging), while type aliases cannot be merged but are more flexible for unions and computed types."
        },
        {
          id: "q2",
          type: "code-completion",
          question: "Complete the interface implementation:",
          codeTemplate: `interface Flyable {\n  altitude: number;\n  fly(): void;\n}\n\nclass Bird ____ Flyable {\n  altitude: number = 0;\n  \n  ____(): void {\n    this.altitude = 100;\n  }\n}`,
          correctAnswer: `interface Flyable {\n  altitude: number;\n  fly(): void;\n}\n\nclass Bird implements Flyable {\n  altitude: number = 0;\n  \n  fly(): void {\n    this.altitude = 100;\n  }\n}`,
          explanation: "Classes implement interfaces using the 'implements' keyword and must provide implementations for all interface members."
        },
        {
          id: "q3",
          type: "multiple-choice",
          question: "What does the ? symbol mean in an interface property?",
          options: [
            "The property is private",
            "The property is optional",
            "The property is readonly", 
            "The property can be null"
          ],
          correct: 1,
          explanation: "The ? symbol makes an interface property optional, meaning it may or may not be present on implementing objects."
        },
        {
          id: "q4",
          type: "true-false",
          question: "A class can implement multiple interfaces in TypeScript.",
          correct: true,
          explanation: "TypeScript classes can implement multiple interfaces by separating them with commas: 'class MyClass implements Interface1, Interface2'."
        },
        {
          id: "q5",
          type: "multiple-choice",
          question: "What is the benefit of using interfaces for polymorphism?",
          options: [
            "Better runtime performance",
            "Smaller code size",
            "Functions can work with any object that implements the interface",
            "Automatic error handling"
          ],
          correct: 2,
          explanation: "Interfaces enable polymorphism by allowing functions to work with any object that implements the required interface, regardless of the specific class."
        }
      ],
      metadata: {
        totalQuestions: 5,
        passingScore: 80,
        timeLimit: 480
      }
    }
  },
  {
    slug: "typescript-inheritance-quiz",
    title: "TypeScript Inheritance Quiz",
    questions: {
      questions: [
        {
          id: "q1",
          type: "multiple-choice", 
          question: "What keyword is used to create inheritance in TypeScript classes?",
          options: [
            "implements",
            "extends",
            "inherits",
            "super"
          ],
          correct: 1,
          explanation: "The 'extends' keyword is used to create inheritance relationships between classes in TypeScript."
        },
        {
          id: "q2",
          type: "code-completion",
          question: "Complete the inheritance example with proper super call:",
          codeTemplate: `class Animal {\n  constructor(protected name: string) {}\n}\n\nclass Dog extends Animal {\n  constructor(name: string, private breed: string) {\n    ____;\n  }\n}`,
          correctAnswer: `class Animal {\n  constructor(protected name: string) {}\n}\n\nclass Dog extends Animal {\n  constructor(name: string, private breed: string) {\n    super(name);\n  }\n}`,
          explanation: "Child classes must call super() in their constructor to invoke the parent class constructor."
        },
        {
          id: "q3",
          type: "multiple-choice",
          question: "What is method overriding in inheritance?",
          options: [
            "Calling a parent method from a child class",
            "Adding new methods to a child class", 
            "Replacing a parent method with a new implementation in the child class",
            "Making a method private"
          ],
          correct: 2,
          explanation: "Method overriding is when a child class provides a new implementation for a method that was defined in the parent class."
        },
        {
          id: "q4",
          type: "true-false",
          question: "The 'super' keyword can be used to call parent class methods from a child class.",
          correct: true,
          explanation: "The 'super' keyword allows child classes to call methods from their parent class, both in constructors and regular methods."
        },
        {
          id: "q5",
          type: "multiple-choice",
          question: "What access modifier allows child classes to access parent properties?",
          options: [
            "private",
            "protected",
            "public", 
            "Both protected and public"
          ],
          correct: 3,
          explanation: "Both 'protected' and 'public' properties can be accessed by child classes. 'Private' properties cannot be accessed by child classes."
        }
      ],
      metadata: {
        totalQuestions: 5,
        passingScore: 80,
        timeLimit: 540
      }
    }
  },
  {
    slug: "typescript-abstract-classes-quiz",
    title: "TypeScript Abstract Classes Quiz",
    questions: {
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: "What is the main purpose of abstract classes?",
          options: [
            "To improve runtime performance",
            "To provide a template with shared functionality while forcing specific implementations",
            "To make classes private",
            "To enable multiple inheritance"
          ],
          correct: 1,
          explanation: "Abstract classes provide a template that combines shared concrete functionality with abstract methods that must be implemented by subclasses."
        },
        {
          id: "q2",
          type: "true-false", 
          question: "You can create an instance of an abstract class directly.",
          correct: false,
          explanation: "Abstract classes cannot be instantiated directly. You must create instances of concrete subclasses that implement all abstract methods."
        },
        {
          id: "q3",
          type: "code-completion",
          question: "Complete the abstract class definition:",
          codeTemplate: `____ class Vehicle {\n  constructor(protected brand: string) {}\n  \n  ____ start(): string;  // Must be implemented by subclasses\n  \n  getInfo(): string {    // Concrete method\n    return this.brand;\n  }\n}`,
          correctAnswer: `abstract class Vehicle {\n  constructor(protected brand: string) {}\n  \n  abstract start(): string;  // Must be implemented by subclasses\n  \n  getInfo(): string {    // Concrete method\n    return this.brand;\n  }\n}`,
          explanation: "Abstract classes use the 'abstract' keyword, and abstract methods within them also use the 'abstract' keyword."
        },
        {
          id: "q4",
          type: "multiple-choice",
          question: "What's the difference between abstract classes and interfaces?",
          options: [
            "No difference, they're the same",
            "Abstract classes can have concrete methods, interfaces cannot",
            "Interfaces are faster",
            "Abstract classes don't support inheritance"
          ],
          correct: 1,
          explanation: "Abstract classes can contain both abstract methods (like interfaces) and concrete methods with implementations, while interfaces only define contracts."
        },
        {
          id: "q5",
          type: "multiple-choice",
          question: "In the Template Method pattern, what does the abstract class provide?",
          options: [
            "Only abstract methods",
            "The algorithm structure and some concrete implementations",
            "Just data storage",
            "Error handling only"
          ],
          correct: 1,
          explanation: "In the Template Method pattern, the abstract class defines the overall algorithm structure and some concrete steps, while leaving specific implementation details to be filled in by subclasses."
        }
      ],
      metadata: {
        totalQuestions: 5,
        passingScore: 80,
        timeLimit: 480
      }
    }
  },
  {
    slug: "typescript-design-patterns-quiz",
    title: "TypeScript Design Patterns Quiz",
    questions: {
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: "What is the main purpose of the Singleton pattern?",
          options: [
            "To create multiple instances efficiently",
            "To ensure only one instance of a class exists throughout the application",
            "To improve inheritance",
            "To handle events"
          ],
          correct: 1,
          explanation: "The Singleton pattern ensures that a class has only one instance and provides a global access point to that instance."
        },
        {
          id: "q2",
          type: "code-completion",
          question: "Complete the Singleton pattern implementation:",
          codeTemplate: `class DatabaseConnection {\n  private static instance: DatabaseConnection;\n  \n  private constructor() {}\n  \n  public static getInstance(): DatabaseConnection {\n    if (!DatabaseConnection.____) {\n      DatabaseConnection.____ = new DatabaseConnection();\n    }\n    return DatabaseConnection.____;\n  }\n}`,
          correctAnswer: `class DatabaseConnection {\n  private static instance: DatabaseConnection;\n  \n  private constructor() {}\n  \n  public static getInstance(): DatabaseConnection {\n    if (!DatabaseConnection.instance) {\n      DatabaseConnection.instance = new DatabaseConnection();\n    }\n    return DatabaseConnection.instance;\n  }\n}`,
          explanation: "The Singleton pattern uses a private constructor and a static instance property accessed through a getInstance() method."
        },
        {
          id: "q3",
          type: "multiple-choice",
          question: "What problem does the Factory pattern solve?",
          options: [
            "Memory management",
            "Creating objects without specifying their exact classes",
            "Data validation",
            "Error handling"
          ],
          correct: 1,
          explanation: "The Factory pattern provides an interface for creating objects without specifying their exact classes, making the code more flexible and maintainable."
        },
        {
          id: "q4",
          type: "multiple-choice",
          question: "In the Observer pattern, what is the role of the Subject?",
          options: [
            "To observe changes in other objects",
            "To notify observers when its state changes",
            "To create observer instances",
            "To validate observer data"
          ],
          correct: 1,
          explanation: "In the Observer pattern, the Subject maintains a list of observers and notifies them when its state changes."
        },
        {
          id: "q5",
          type: "true-false",
          question: "The Strategy pattern allows you to change algorithms at runtime.",
          correct: true,
          explanation: "The Strategy pattern encapsulates algorithms in separate classes, allowing you to switch between different strategies (algorithms) at runtime."
        }
      ],
      metadata: {
        totalQuestions: 5,
        passingScore: 80,
        timeLimit: 600
      }
    }
  }
];

export const typescriptOOPAchievements = [
  {
    key: "typescript_oop_beginner",
    title: "TypeScript OOP Explorer",
    description: "Completed the TypeScript OOP overview tutorial",
    icon: "🔍",
    category: "learning",
    rarity: "COMMON",
    points: 10,
    requirementType: "tutorial_completed",
    requirementValue: 1, // tutorial ID will be resolved during seeding
    isHidden: false
  },
  {
    key: "class_master",
    title: "Class Master",
    description: "Mastered TypeScript classes fundamentals",
    icon: "🏗️", 
    category: "learning",
    rarity: "COMMON",
    points: 25,
    requirementType: "tutorial_completed",
    requirementValue: 1, // tutorial ID will be resolved during seeding
    isHidden: false
  },
  {
    key: "interface_architect", 
    title: "Interface Architect",
    description: "Mastered TypeScript interfaces and contracts",
    icon: "📋",
    category: "learning", 
    rarity: "UNCOMMON",
    points: 30,
    requirementType: "tutorial_completed",
    requirementValue: 1, // tutorial ID will be resolved during seeding
    isHidden: false
  },
  {
    key: "inheritance_expert",
    title: "Inheritance Expert", 
    description: "Mastered TypeScript inheritance and class hierarchies",
    icon: "🌳",
    category: "learning",
    rarity: "UNCOMMON", 
    points: 35,
    requirementType: "tutorial_completed",
    requirementValue: 1, // tutorial ID will be resolved during seeding
    isHidden: false
  },
  {
    key: "abstract_architect",
    title: "Abstract Architect",
    description: "Mastered TypeScript abstract classes and templates",
    icon: "🏛️",
    category: "learning",
    rarity: "RARE",
    points: 50,
    requirementType: "tutorial_completed", 
    requirementValue: 1, // tutorial ID will be resolved during seeding
    isHidden: false
  },
  {
    key: "pattern_master",
    title: "Design Pattern Master",
    description: "Mastered professional TypeScript design patterns",
    icon: "🎯",
    category: "learning",
    rarity: "RARE", 
    points: 75,
    requirementType: "tutorial_completed",
    requirementValue: 1, // tutorial ID will be resolved during seeding
    isHidden: false
  },
  {
    key: "typescript_oop_scholar",
    title: "TypeScript OOP Scholar",
    description: "Completed all TypeScript OOP tutorials",
    icon: "🎓",
    category: "learning",
    rarity: "EPIC",
    points: 100,
    requirementType: "tutorials_completed",
    requirementValue: 6, // All 6 tutorials in the series
    isHidden: false
  },
  {
    key: "quiz_ace",
    title: "Quiz Ace",
    description: "Passed all TypeScript OOP quizzes with 90%+ score",
    icon: "🏆",
    category: "achievement",
    rarity: "RARE", 
    points: 60,
    requirementType: "quiz_score_average",
    requirementValue: 90,
    isHidden: false
  },
  {
    key: "perfect_score",
    title: "Perfect Score",
    description: "Achieved 100% on a TypeScript OOP quiz",
    icon: "💯", 
    category: "achievement",
    rarity: "UNCOMMON",
    points: 40,
    requirementType: "quiz_perfect_score",
    requirementValue: 1,
    isHidden: false
  },
  {
    key: "speed_learner",
    title: "Speed Learner",
    description: "Completed TypeScript Classes tutorial in under 20 minutes", 
    icon: "⚡",
    category: "achievement",
    rarity: "UNCOMMON",
    points: 30,
    requirementType: "tutorial_time",
    requirementValue: 1200, // 20 minutes in seconds
    isHidden: false
  },
  {
    key: "dedicated_student",
    title: "Dedicated Student",
    description: "Spent over 3 hours studying TypeScript OOP",
    icon: "📚",
    category: "engagement",
    rarity: "UNCOMMON",
    points: 35,
    requirementType: "total_study_time",
    requirementValue: 10800, // 3 hours in seconds  
    isHidden: false
  },
  {
    key: "comeback_kid",
    title: "Comeback Kid",
    description: "Passed a quiz after failing it twice",
    icon: "🎯",
    category: "perseverance",
    rarity: "UNCOMMON", 
    points: 25,
    requirementType: "quiz_attempts_before_pass",
    requirementValue: 3,
    isHidden: false
  }
];

export async function seedTypescriptOOP() {
  const prisma = new PrismaClient();

  try {
    console.log("🌱 Seeding TypeScript OOP content...");

    // First, ensure the OOP category exists
    const oopCategory = await prisma.category.upsert({
      where: { slug: "oop" },
      update: {},
      create: {
        slug: "oop",
        title: "Object-Oriented Programming",
        description: "Master the principles of object-oriented programming with modern JavaScript and TypeScript",
        difficulty: "intermediate", 
        topics: [
          "Classes and Objects",
          "Inheritance",
          "Polymorphism", 
          "Encapsulation",
          "Abstraction",
          "Design Patterns"
        ],
        duration: "8-12 hours",
        iconBg: "bg-purple-100 dark:bg-purple-900",
        iconColor: "text-purple-600 dark:text-purple-400",
        badgeBg: "bg-purple-100 dark:bg-purple-900", 
        badgeColor: "text-purple-800 dark:text-purple-200",
        dotColor: "bg-purple-600",
        order: 3,
        published: true
      }
    });

    console.log("✅ OOP category created/updated");

    // Seed tutorials
    const createdTutorials = [];
    for (const tutorialData of typescriptOOPTutorials) {
      const tutorial = await prisma.tutorial.upsert({
        where: { slug: tutorialData.slug },
        update: {
          ...tutorialData,
          categoryId: oopCategory.id
        },
        create: {
          ...tutorialData,
          categoryId: oopCategory.id
        }
      });
      createdTutorials.push(tutorial);
    }

    console.log(`✅ Seeded ${createdTutorials.length} TypeScript OOP tutorials`);

    // Seed quizzes
    let quizCount = 0;
    for (let i = 0; i < typescriptOOPQuizzes.length; i++) {
      const quizData = typescriptOOPQuizzes[i];
      const tutorial = createdTutorials[i]; // Match quiz to tutorial by index

      await prisma.quiz.upsert({
        where: { slug: quizData.slug },
        update: {
          ...quizData,
          tutorialId: tutorial.id
        },
        create: {
          ...quizData,
          tutorialId: tutorial.id
        }
      });
      quizCount++;
    }

    console.log(`✅ Seeded ${quizCount} TypeScript OOP quizzes`);

    // Seed achievements
    for (const achievementData of typescriptOOPAchievements) {
      await prisma.achievement.upsert({
        where: { key: achievementData.key },
        update: achievementData,
        create: achievementData
      });
    }

    console.log(`✅ Seeded ${typescriptOOPAchievements.length} TypeScript OOP achievements`);

    console.log("🎉 TypeScript OOP seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding TypeScript OOP content:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}