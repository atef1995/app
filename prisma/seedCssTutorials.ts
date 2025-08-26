import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCssTutorials() {
  try {
    console.log("🎨 Seeding CSS tutorials...");

    // First, get or create the CSS category
    const cssCategory = await prisma.category.upsert({
      where: { slug: "css" },
      update: {},
      create: {
        slug: "css",
        title: "CSS",
        description:
          "Learn Cascading Style Sheets to create beautiful, responsive web designs",
        difficulty: "beginner",
        topics: ["CSS", "Styling", "Layout", "Design", "Responsive"],
        duration: "6-8 hours",
        iconBg: "bg-blue-100 dark:bg-blue-900",
        iconColor: "text-blue-600 dark:text-blue-400",
        badgeBg: "bg-blue-100 dark:bg-blue-900",
        badgeColor: "text-blue-800 dark:text-blue-200",
        dotColor: "bg-blue-600",
        order: 2,
        published: true,
      },
    });

    console.log(`✅ CSS category: ${cssCategory.title}`);

    // CSS Fundamentals Tutorial
    const cssFundamentalsTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-fundamentals" },
      update: {},
      create: {
        slug: "css-fundamentals",
        title: "CSS Fundamentals: Styling Your Web Pages",
        description:
          "Learn the basics of CSS including selectors, properties, and styling techniques to make your web pages look amazing.",
        content: null,
        mdxFile: "css/01-css-fundamentals",
        categoryId: cssCategory.id,
        difficulty: 1,
        estimatedTime: 60.0,
        order: 1,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssFundamentalsTutorial.title}`);

    // CSS Flexbox Tutorial
    const cssFlexboxTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-layout-flexbox" },
      update: {},
      create: {
        slug: "css-layout-flexbox",
        title: "CSS Layout with Flexbox: Modern Web Layouts Made Easy",
        description:
          "Master CSS Flexbox to create responsive, flexible layouts with ease. Learn alignment, distribution, and responsive design patterns.",
        content: null,
        mdxFile: "css/02-css-layout-flexbox",
        categoryId: cssCategory.id,
        difficulty: 2,
        estimatedTime: 75.0,
        order: 2,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssFlexboxTutorial.title}`);

    // CSS Grid Layout Tutorial
    const cssGridTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-grid-layout" },
      update: {},
      create: {
        slug: "css-grid-layout",
        title: "CSS Grid Layout: Master 2D Layouts",
        description:
          "Master CSS Grid to create powerful 2D layouts with precise control over rows, columns, and positioning. Build complex responsive designs with ease.",
        content: null,
        mdxFile: "css/03-css-grid-layout",
        categoryId: cssCategory.id,
        difficulty: 2,
        estimatedTime: 85.0,
        order: 3,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssGridTutorial.title}`);

    // CSS Positioning & Z-Index Tutorial
    const cssPositioningTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-positioning-z-index" },
      update: {},
      create: {
        slug: "css-positioning-z-index",
        title: "CSS Positioning & Z-Index: Control Element Placement",
        description:
          "Master CSS positioning and z-index to create overlays, sticky headers, tooltips, and complex layered layouts with precise element control.",
        content: null,
        mdxFile: "css/04-css-positioning-z-index",
        categoryId: cssCategory.id,
        difficulty: 2,
        estimatedTime: 70.0,
        order: 4,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssPositioningTutorial.title}`);

    // CSS Transforms & Transitions Tutorial
    const cssTransformsTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-transforms-transitions" },
      update: {},
      create: {
        slug: "css-transforms-transitions",
        title: "CSS Transforms & Transitions: Smooth Animations",
        description:
          "Learn CSS transforms and transitions to create smooth animations, hover effects, and interactive elements that enhance user experience.",
        content: null,
        mdxFile: "css/05-css-transforms-transitions",
        categoryId: cssCategory.id,
        difficulty: 2,
        estimatedTime: 75.0,
        order: 5,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssTransformsTutorial.title}`);

    // CSS Animations Tutorial
    const cssAnimationsTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-animations" },
      update: {},
      create: {
        slug: "css-animations",
        title: "CSS Animations: Advanced Motion Effects",
        description:
          "Master CSS keyframe animations to create complex motion effects, loading spinners, and engaging user interfaces with advanced animation techniques.",
        content: null,
        mdxFile: "css/06-css-animations",
        categoryId: cssCategory.id,
        difficulty: 3,
        estimatedTime: 80.0,
        order: 6,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssAnimationsTutorial.title}`);

    // Responsive Design & Media Queries Tutorial
    const cssResponsiveTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-responsive-design" },
      update: {},
      create: {
        slug: "css-responsive-design",
        title: "Responsive Design & Media Queries: Mobile-First CSS",
        description:
          "Master responsive web design with media queries, flexible layouts, and mobile-first principles to create websites that work on all devices.",
        content: null,
        mdxFile: "css/07-css-responsive-design",
        categoryId: cssCategory.id,
        difficulty: 2,
        estimatedTime: 85.0,
        order: 7,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssResponsiveTutorial.title}`);

    // Advanced CSS Selectors Tutorial
    const cssAdvancedSelectorsTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-advanced-selectors" },
      update: {},
      create: {
        slug: "css-advanced-selectors",
        title: "Advanced CSS Selectors: Precision Targeting",
        description:
          "Master advanced CSS selectors including pseudo-classes, pseudo-elements, attribute selectors, and combinators for precise element targeting.",
        content: null,
        mdxFile: "css/08-css-advanced-selectors",
        categoryId: cssCategory.id,
        difficulty: 2,
        estimatedTime: 70.0,
        order: 8,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssAdvancedSelectorsTutorial.title}`);

    // CSS Variables Tutorial
    const cssVariablesTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-variables" },
      update: {},
      create: {
        slug: "css-variables",
        title: "CSS Variables: Dynamic Styling with Custom Properties",
        description:
          "Learn CSS custom properties (variables) to create maintainable stylesheets, dynamic themes, and flexible design systems.",
        content: null,
        mdxFile: "css/09-css-variables",
        categoryId: cssCategory.id,
        difficulty: 2,
        estimatedTime: 65.0,
        order: 9,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssVariablesTutorial.title}`);

    // Typography & Web Fonts Tutorial
    const cssTypographyTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-typography-fonts" },
      update: {},
      create: {
        slug: "css-typography-fonts",
        title: "Typography & Web Fonts: Beautiful Text Design",
        description:
          "Master typography and web fonts to create readable, beautiful text layouts with proper font loading, hierarchy, and responsive text design.",
        content: null,
        mdxFile: "css/10-css-typography-fonts",
        categoryId: cssCategory.id,
        difficulty: 2,
        estimatedTime: 75.0,
        order: 10,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssTypographyTutorial.title}`);

    // CSS Architecture Tutorial
    const cssArchitectureTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-architecture" },
      update: {},
      create: {
        slug: "css-architecture",
        title: "CSS Architecture: Scalable & Maintainable Stylesheets",
        description:
          "Learn CSS methodologies like BEM, OOCSS, and SMACSS to write scalable, maintainable CSS for large projects and teams.",
        content: null,
        mdxFile: "css/11-css-architecture",
        categoryId: cssCategory.id,
        difficulty: 3,
        estimatedTime: 80.0,
        order: 11,
        published: true,
        isPremium: true,
        requiredPlan: "VIBED",
      },
    });

    console.log(`✅ Tutorial: ${cssArchitectureTutorial.title}`);

    // Modern CSS Features Tutorial
    const cssModernFeaturesTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-modern-features" },
      update: {},
      create: {
        slug: "css-modern-features",
        title: "Modern CSS Features: Cutting-Edge Techniques",
        description:
          "Explore the latest CSS features including container queries, CSS subgrid, clamp(), logical properties, and other cutting-edge techniques.",
        content: null,
        mdxFile: "css/12-css-modern-features",
        categoryId: cssCategory.id,
        difficulty: 3,
        estimatedTime: 90.0,
        order: 12,
        published: true,
        isPremium: true,
        requiredPlan: "CRACKED",
      },
    });

    console.log(`✅ Tutorial: ${cssModernFeaturesTutorial.title}`);

    // Create quizzes for the tutorials
    const cssFundamentalsQuiz = await prisma.quiz.upsert({
      where: { slug: "css-fundamentals-quiz" },
      update: {},
      create: {
        slug: "css-fundamentals-quiz",
        tutorialId: cssFundamentalsTutorial.id,
        title: "CSS Fundamentals Quiz",
        questions: [
          {
            question: "What does CSS stand for?",
            options: [
              "Computer Style Sheets",
              "Cascading Style Sheets",
              "Creative Style Sheets",
              "Colorful Style Sheets",
            ],
            correct: 1,
            explanation:
              "CSS stands for Cascading Style Sheets, which describes how HTML elements should be displayed.",
          },
          {
            question: "Which CSS selector has the highest specificity?",
            options: [
              "Element selector (p)",
              "Class selector (.highlight)",
              "ID selector (#header)",
              "Universal selector (*)",
            ],
            correct: 2,
            explanation:
              "ID selectors have higher specificity than class selectors, which have higher specificity than element selectors.",
          },
          {
            question: "What is the correct CSS syntax?",
            options: [
              "body {color: black}",
              "body {color: black;}",
              "{body: color=black;}",
              "body: color=black;",
            ],
            correct: 1,
            explanation:
              "CSS syntax requires a selector, followed by curly braces containing property: value pairs, ending with semicolons.",
          },
          {
            question:
              "Which property controls the space inside an element's border?",
            options: ["margin", "padding", "border", "spacing"],
            correct: 1,
            explanation:
              "Padding controls the space inside an element between the content and the border.",
          },
          {
            question: "What is the default display value for div elements?",
            options: ["inline", "inline-block", "block", "none"],
            correct: 2,
            explanation:
              "Div elements are block-level elements by default, meaning they take up the full width available and create a new line.",
          },
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssFundamentalsQuiz.title}`);

    const cssFlexboxQuiz = await prisma.quiz.upsert({
      where: { slug: "css-flexbox-quiz" },
      update: {},
      create: {
        slug: "css-flexbox-quiz",
        tutorialId: cssFlexboxTutorial.id,
        title: "CSS Flexbox Layout Quiz",
        questions: [
          {
            question: "Which property creates a flex container?",
            options: [
              "display: flex-container",
              "display: flex",
              "flex: container",
              "container: flex",
            ],
            correct: 1,
            explanation:
              "The display: flex property creates a flex container, making its direct children flex items.",
          },
          {
            question: "Which property controls alignment along the main axis?",
            options: [
              "align-items",
              "align-content",
              "justify-content",
              "flex-align",
            ],
            correct: 2,
            explanation:
              "justify-content controls alignment and distribution of flex items along the main axis.",
          },
          {
            question: "What does 'flex: 1' mean?",
            options: [
              "flex-grow: 1, flex-shrink: 0, flex-basis: auto",
              "flex-grow: 1, flex-shrink: 1, flex-basis: 0%",
              "flex-grow: 0, flex-shrink: 1, flex-basis: 1px",
              "Only flex-grow: 1",
            ],
            correct: 1,
            explanation:
              "flex: 1 is shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%, meaning the item will grow and shrink equally.",
          },
          {
            question: "Which property makes flex items wrap to new lines?",
            options: [
              "flex-wrap: wrap",
              "flex-break: wrap",
              "wrap: flex",
              "flex-line: wrap",
            ],
            correct: 0,
            explanation:
              "flex-wrap: wrap allows flex items to wrap onto multiple lines when there isn't enough space.",
          },
          {
            question:
              "How do you center an item both horizontally and vertically in a flex container?",
            options: [
              "align-items: center",
              "justify-content: center",
              "align-items: center; justify-content: center",
              "text-align: center; vertical-align: middle",
            ],
            correct: 2,
            explanation:
              "Use both align-items: center (vertical) and justify-content: center (horizontal) to center in both directions.",
          },
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssFlexboxQuiz.title}`);

    // CSS Grid Quiz
    const cssGridQuiz = await prisma.quiz.upsert({
      where: { slug: "css-grid-quiz" },
      update: {},
      create: {
        slug: "css-grid-quiz",
        tutorialId: cssGridTutorial.id,
        title: "CSS Grid Layout Quiz",
        questions: [
          {
            question: "What property creates a CSS Grid container?",
            options: [
              "display: grid-container",
              "display: grid",
              "grid: container",
              "container: grid",
            ],
            correct: 1,
            explanation:
              "The display: grid property creates a grid container, making its direct children grid items.",
          },
          {
            question: "Which property defines the size of grid columns?",
            options: [
              "grid-columns",
              "grid-template-columns",
              "column-template",
              "grid-column-size",
            ],
            correct: 1,
            explanation:
              "grid-template-columns defines the size and number of columns in the grid.",
          },
          {
            question: "What does 'grid-column: 1 / 3' mean?",
            options: [
              "Start at column 1, span 3 columns",
              "Start at column 1, end at column 3",
              "Divide by 3 columns",
              "Create 1-3 columns",
            ],
            correct: 1,
            explanation:
              "grid-column: 1 / 3 means start at grid line 1 and end at grid line 3, spanning 2 columns.",
          },
          {
            question: "Which property is best for naming grid areas?",
            options: [
              "grid-areas",
              "grid-template-areas",
              "grid-area-names",
              "grid-sections",
            ],
            correct: 1,
            explanation:
              "grid-template-areas allows you to name grid areas using a visual string representation.",
          },
          {
            question:
              "What does 'repeat(auto-fit, minmax(200px, 1fr))' create?",
            options: [
              "Fixed 200px columns",
              "Exactly 200px responsive columns",
              "Responsive columns that fit available space",
              "Auto-sizing rows",
            ],
            correct: 2,
            explanation:
              "This creates responsive columns that automatically fit the container width, with minimum 200px and maximum 1fr.",
          },
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssGridQuiz.title}`);

    // CSS Positioning Quiz
    const cssPositioningQuiz = await prisma.quiz.upsert({
      where: { slug: "css-positioning-quiz" },
      update: {},
      create: {
        slug: "css-positioning-quiz",
        tutorialId: cssPositioningTutorial.id,
        title: "CSS Positioning & Z-Index Quiz",
        questions: [
          {
            question:
              "Which positioning value removes an element from document flow?",
            options: ["relative", "static", "absolute", "sticky"],
            correct: 2,
            explanation:
              "Absolute positioning removes an element from the normal document flow and positions it relative to its nearest positioned ancestor.",
          },
          {
            question: "What does position: sticky do?",
            options: [
              "Sticks to the top always",
              "Acts like relative until a threshold, then becomes fixed",
              "Never moves from its position",
              "Same as position: fixed",
            ],
            correct: 1,
            explanation:
              "Sticky positioning toggles between relative and fixed based on scroll position and threshold values.",
          },
          {
            question: "For z-index to work, an element must be:",
            options: [
              "A block element",
              "Positioned (not static)",
              "A flex item",
              "Have a defined width",
            ],
            correct: 1,
            explanation:
              "z-index only works on positioned elements (relative, absolute, fixed, or sticky), not on static elements.",
          },
          {
            question: "What creates a new stacking context?",
            options: [
              "Any positioned element",
              "Elements with z-index other than auto",
              "Block-level elements",
              "Elements with opacity less than 1",
            ],
            correct: 3,
            explanation:
              "Elements with opacity < 1, among other properties like transform and positioned elements with z-index, create new stacking contexts.",
          },
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssPositioningQuiz.title}`);

    // CSS Transforms Quiz
    const cssTransformsQuiz = await prisma.quiz.upsert({
      where: { slug: "css-transforms-quiz" },
      update: {},
      create: {
        slug: "css-transforms-quiz",
        tutorialId: cssTransformsTutorial.id,
        title: "CSS Transforms & Transitions Quiz",
        questions: [
          {
            question: "Which CSS transform function rotates an element around its center?",
            options: ["rotate()", "spin()", "turn()", "revolve()"],
            correct: 0,
            explanation:
              "The rotate() function rotates an element around its center point (or transform-origin) by a specified angle in degrees.",
          },
          {
            question: "What does 'transform: translate(50px, -20px)' do?",
            options: [
              "Moves 50px down, 20px left",
              "Moves 50px right, 20px up",
              "Scales by 50px and 20px",
              "Rotates by 50 and 20 degrees",
            ],
            correct: 1,
            explanation:
              "translate(x, y) moves an element 50px to the right (positive X) and 20px up (negative Y) from its original position without affecting document flow.",
          },
          {
            question: "Which property controls how fast a transition accelerates and decelerates?",
            options: [
              "transition-speed",
              "transition-duration",
              "transition-timing-function",
              "transition-curve",
            ],
            correct: 2,
            explanation:
              "transition-timing-function controls the acceleration curve of the transition, with values like ease, linear, ease-in, ease-out, and cubic-bezier().",
          },
          {
            question: "What does 'transform-origin: top left' set?",
            options: [
              "The starting position for translation",
              "The pivot point for transformations",
              "The ending position after transform",
              "The direction of movement",
            ],
            correct: 1,
            explanation:
              "transform-origin sets the pivot point around which transformations are applied. 'top left' makes the element rotate and scale from its top-left corner.",
          },
          {
            question: "Which transform function changes the size of an element?",
            options: ["size()", "scale()", "resize()", "grow()"],
            correct: 1,
            explanation:
              "The scale() function changes the size of an element. scale(1.5) makes it 50% larger, scale(0.5) makes it half the size.",
          },
          {
            question: "What's the best duration for most UI transition interactions?",
            options: ["0.1s", "0.3s", "1s", "2s"],
            correct: 1,
            explanation:
              "0.3s (300ms) is the sweet spot for UI transitions - fast enough to feel responsive but slow enough to be noticeable and smooth.",
          },
          {
            question: "Which timing function creates the most natural-feeling animation?",
            options: ["linear", "ease", "ease-in", "steps()"],
            correct: 1,
            explanation:
              "The 'ease' timing function mimics natural motion with slow start, fast middle, and slow end - like throwing a ball or natural movement.",
          },
          {
            question: "What does 'transform: skew(15deg, 5deg)' create?",
            options: [
              "A rotation effect",
              "A scaling effect",
              "A parallelogram (slanted) effect",
              "A translation effect",
            ],
            correct: 2,
            explanation:
              "skew() tilts an element along the X and Y axes, creating a parallelogram effect. 15deg tilts horizontally, 5deg tilts vertically.",
          },
          {
            question: "Which properties are GPU-accelerated for smooth animations?",
            options: [
              "width, height, margin",
              "transform, opacity",
              "top, left, bottom, right",
              "padding, border-width",
            ],
            correct: 1,
            explanation:
              "Transform and opacity are GPU-accelerated properties that don't trigger layout recalculation, resulting in smooth 60fps animations.",
          },
          {
            question: "What happens when you combine multiple transforms like 'rotate(45deg) scale(1.2)'?",
            options: [
              "Only the first transform applies",
              "They apply in order: rotate then scale",
              "They apply simultaneously",
              "It creates an error",
            ],
            correct: 1,
            explanation:
              "Multiple transforms apply in order from left to right. The element rotates 45 degrees first, then scales up by 20% around the rotated coordinate system.",
          },
          {
            question: "For 3D transforms to work properly, what must the parent element have?",
            options: [
              "position: relative",
              "display: flex",
              "perspective property",
              "z-index value",
            ],
            correct: 2,
            explanation:
              "3D transforms require a perspective property on the parent element to define the 3D viewing distance and make the 3D effect visible.",
          },
          {
            question: "What does 'backface-visibility: hidden' do in 3D transforms?",
            options: [
              "Hides the element completely",
              "Prevents seeing the back of rotated elements",
              "Makes the element transparent",
              "Disables 3D transforms",
            ],
            correct: 1,
            explanation:
              "backface-visibility: hidden prevents seeing the 'back' of elements during 3D rotations, essential for card-flip effects.",
          },
          {
            question: "Which transition shorthand syntax is correct?",
            options: [
              "transition: 0.3s ease transform",
              "transition: transform 0.3s ease",
              "transition: ease transform 0.3s",
              "transition: transform ease 0.3s",
            ],
            correct: 1,
            explanation:
              "The correct shorthand order is: property, duration, timing-function, delay. So 'transition: transform 0.3s ease' is correct.",
          },
          {
            question: "What creates a smooth hover effect that lifts a card?",
            options: [
              "transform: translateY(10px)",
              "transform: translateY(-10px)",
              "margin-top: -10px",
              "top: -10px",
            ],
            correct: 1,
            explanation:
              "translateY(-10px) moves the element up by 10 pixels (negative Y is up), creating a lifting effect that's GPU-accelerated and smooth.",
          },
          {
            question: "How do you create a perfect center position using transforms?",
            options: [
              "transform: translate(50%, 50%)",
              "transform: translate(-50%, -50%)",
              "transform: center",
              "transform: translate(center, center)",
            ],
            correct: 1,
            explanation:
              "Combined with position: absolute; top: 50%; left: 50%, transform: translate(-50%, -50%) perfectly centers an element by moving it back by half its own width and height.",
          },
          {
            question: "What performance problem do layout-triggering animations cause?",
            options: [
              "They use too much memory",
              "They cause layout thrashing and jank",
              "They break accessibility",
              "They don't work on mobile",
            ],
            correct: 1,
            explanation:
              "Animating layout properties like width, height, margin, or positioning forces the browser to recalculate layout for all affected elements, causing performance issues (jank).",
          },
          {
            question: "Which cubic-bezier timing creates a bounce effect?",
            options: [
              "cubic-bezier(0, 0, 1, 1)",
              "cubic-bezier(0.25, 0.1, 0.25, 1)",
              "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              "cubic-bezier(1, 0, 0, 1)",
            ],
            correct: 2,
            explanation:
              "cubic-bezier(0.68, -0.55, 0.265, 1.55) creates a bounce effect because the negative and >1 values cause overshoot beyond the target.",
          },
          {
            question: "What's the key advantage of CSS transforms over changing layout properties?",
            options: [
              "They look better visually",
              "They're easier to write",
              "They run on the GPU and don't trigger layout",
              "They work in older browsers",
            ],
            correct: 2,
            explanation:
              "CSS transforms run on the GPU compositor layer and don't trigger layout or paint recalculation, making them much more performant than layout-changing properties.",
          }
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssTransformsQuiz.title}`);

    // CSS Variables Quiz
    const cssVariablesQuiz = await prisma.quiz.upsert({
      where: { slug: "css-variables-quiz" },
      update: {},
      create: {
        slug: "css-variables-quiz",
        tutorialId: cssVariablesTutorial.id,
        title: "CSS Variables Quiz",
        questions: [
          {
            question: "How do you declare a CSS custom property?",
            options: [
              "var-name: value;",
              "--var-name: value;",
              "$var-name: value;",
              "@var-name: value;",
            ],
            correct: 1,
            explanation:
              "CSS custom properties are declared with two dashes: --variable-name: value;",
          },
          {
            question: "How do you use a CSS variable?",
            options: [
              "use(--var-name)",
              "var(--var-name)",
              "get(--var-name)",
              "custom(--var-name)",
            ],
            correct: 1,
            explanation:
              "CSS variables are used with the var() function: var(--variable-name)",
          },
          {
            question: "Where should global CSS variables be defined?",
            options: ["body", ":root", "html", "*"],
            correct: 1,
            explanation:
              ":root is the recommended place for global CSS variables as it has the highest specificity.",
          },
          {
            question: "What happens if a CSS variable is undefined?",
            options: [
              "Error occurs",
              "Default value is used if provided",
              "Property is ignored",
              "Browser crashes",
            ],
            correct: 1,
            explanation:
              "If a CSS variable is undefined, the fallback value is used: var(--undefined, fallback-value)",
          },
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssVariablesQuiz.title}`);

    // CSS Typography & Web Fonts Quiz
    const cssTypographyQuiz = await prisma.quiz.upsert({
      where: { slug: "css-typography-quiz" },
      update: {},
      create: {
        slug: "css-typography-quiz",
        tutorialId: cssTypographyTutorial.id,
        title: "Typography & Web Fonts Quiz",
        questions: [
          {
            question: "What is the main difference between a typeface and a font?",
            options: [
              "There is no difference, they're the same thing",
              "Typeface is the design, font is the file that contains the typeface",
              "Font is the design, typeface is the file",
              "Typeface is for print, font is for web"
            ],
            correct: 1,
            explanation: "A typeface is the overall design (like Helvetica), while a font is the specific file that implements that design (like Helvetica-Bold.woff2)."
          },
          {
            question: "Which CSS property controls the space between lines of text?",
            options: [
              "letter-spacing",
              "word-spacing", 
              "line-height",
              "text-spacing"
            ],
            correct: 2,
            explanation: "line-height controls the vertical space between lines of text. A value of 1.5 means 1.5 times the font size."
          },
          {
            question: "What does 'font-display: swap' do?",
            options: [
              "Swaps between different fonts randomly",
              "Shows fallback text immediately, then swaps to custom font when loaded",
              "Prevents custom fonts from loading",
              "Only works with variable fonts"
            ],
            correct: 1,
            explanation: "font-display: swap shows the fallback font immediately for fast text rendering, then swaps to the custom font once it loads."
          },
          {
            question: "Which font loading strategy prevents invisible text (FOIT)?",
            options: [
              "font-display: block",
              "font-display: auto",
              "font-display: swap",
              "font-display: fallback"
            ],
            correct: 2,
            explanation: "font-display: swap prevents FOIT (Flash of Invisible Text) by immediately showing fallback fonts instead of waiting for custom fonts."
          },
          {
            question: "What is the recommended line-height for optimal body text readability?",
            options: [
              "1.0 - 1.2",
              "1.4 - 1.6", 
              "2.0 - 2.5",
              "0.8 - 1.0"
            ],
            correct: 1,
            explanation: "Line-height between 1.4-1.6 provides optimal readability for body text, giving enough space between lines without feeling too loose."
          },
          {
            question: "Which CSS property creates a typography scale using mathematical ratios?",
            options: [
              "font-scale",
              "CSS custom properties with calculated ratios",
              "typography-ratio",
              "font-progression"
            ],
            correct: 1,
            explanation: "CSS custom properties (variables) with calculated ratios like --font-size-lg: calc(var(--font-size-base) * 1.333) create consistent typography scales."
          },
          {
            question: "What does 'font-variation-settings' control in variable fonts?",
            options: [
              "Font loading behavior",
              "Multiple font variations like weight, width, and slant",
              "Font fallback order",
              "Typography hierarchy"
            ],
            correct: 1,
            explanation: "font-variation-settings allows fine control over variable font axes like weight ('wght'), width ('wdth'), and other custom variations."
          },
          {
            question: "Which text shadow creates a realistic 3D effect?",
            options: [
              "text-shadow: 0 0 10px black",
              "text-shadow: 1px 1px 0 #333, 2px 2px 0 #333, 3px 3px 5px rgba(0,0,0,0.3)",
              "text-shadow: 5px 5px blue",
              "text-shadow: inset 0 0 10px black"
            ],
            correct: 1,
            explanation: "Multiple layered text-shadows with increasing offsets and a final blur create realistic 3D depth effects."
          },
          {
            question: "What creates gradient text effects in CSS?",
            options: [
              "color: gradient(red, blue)",
              "background: linear-gradient(...) + background-clip: text + color: transparent",
              "text-gradient: linear-gradient(...)",
              "font-color: gradient(...)"
            ],
            correct: 1,
            explanation: "Gradient text uses background gradients with background-clip: text and transparent color to show the gradient through the text shape."
          },
          {
            question: "Which property makes text stroke/outline effects?",
            options: [
              "text-outline",
              "border: 2px solid color",
              "-webkit-text-stroke",
              "outline: 2px solid color"
            ],
            correct: 2,
            explanation: "-webkit-text-stroke creates outline effects around text characters, often combined with transparent fill for hollow text."
          },
          {
            question: "What is the optimal line length for reading comprehension?",
            options: [
              "20-30 characters per line",
              "45-75 characters per line",
              "100-120 characters per line", 
              "No limit, longer is better"
            ],
            correct: 1,
            explanation: "45-75 characters per line (including spaces) is optimal for reading speed and comprehension. Use CSS max-width: 65ch to achieve this."
          },
          {
            question: "Which CSS unit is best for creating scalable, accessible typography?",
            options: [
              "px (pixels)",
              "pt (points)",
              "rem (root em)",
              "cm (centimeters)"
            ],
            correct: 2,
            explanation: "rem units scale with the user's browser font size settings, making typography more accessible for users who need larger text."
          },
          {
            question: "What does 'font-feature-settings: \"liga\"' enable?",
            options: [
              "Font ligatures (combined characters like fi, fl)",
              "Line spacing adjustments",
              "Letter spacing controls",
              "Font loading optimizations"
            ],
            correct: 0,
            explanation: "Font ligatures automatically combine certain character pairs (like fi, fl, ff) into single, more attractive glyphs when supported by the font."
          },
          {
            question: "Which technique creates the smoothest text animations?",
            options: [
              "Animating font-size directly",
              "Animating with transform: scale()",
              "Animating letter-spacing",
              "Animating line-height"
            ],
            correct: 1,
            explanation: "transform: scale() is GPU-accelerated and doesn't trigger layout recalculation, creating much smoother text scaling animations than font-size."
          },
          {
            question: "What creates a typewriter animation effect?",
            options: [
              "Animating opacity from 0 to 1",
              "Animating width with overflow: hidden + border-right caret",
              "Animating transform: translateX()",
              "Animating letter-spacing"
            ],
            correct: 1,
            explanation: "Typewriter effects animate width from 0 to 100% with overflow: hidden, often adding a blinking border-right as a cursor."
          },
          {
            question: "Which contrast ratio meets WCAG AA standards for normal text?",
            options: [
              "3:1",
              "4.5:1",
              "7:1", 
              "21:1"
            ],
            correct: 1,
            explanation: "WCAG AA requires a minimum 4.5:1 contrast ratio for normal text and 3:1 for large text (18pt+ or 14pt+ bold)."
          },
          {
            question: "What does 'clamp(1rem, 4vw, 2rem)' create for typography?",
            options: [
              "Fixed 4vw font size",
              "Responsive typography that scales between 1rem and 2rem",
              "Only works on mobile devices",
              "Creates an error in older browsers"
            ],
            correct: 1,
            explanation: "clamp() creates fluid typography that starts at 1rem minimum, scales at 4% of viewport width, and caps at 2rem maximum."
          },
          {
            question: "Which approach optimizes web font loading performance?",
            options: [
              "Load all font weights and styles at once",
              "Use font-display: swap + preload critical fonts + subset fonts",
              "Only use system fonts",
              "Load fonts with JavaScript after page load"
            ],
            correct: 1,
            explanation: "Combining font-display: swap, preloading critical fonts, and using font subsets (unicode-range) provides the best performance and user experience."
          },
          {
            question: "What creates a text reveal animation on scroll?",
            options: [
              "CSS only with :hover",
              "Intersection Observer API + CSS transforms/opacity",
              "Media queries",
              "Font loading events"
            ],
            correct: 1,
            explanation: "Scroll-triggered text reveals use Intersection Observer to detect when elements enter the viewport, then apply CSS classes for transform/opacity animations."
          },
          {
            question: "Which typography system creates the most harmonious font size relationships?",
            options: [
              "Random size increases",
              "Mathematical ratios like Perfect Fourth (1.333) or Golden Ratio (1.618)",
              "Always doubling the previous size",
              "Using only even numbers"
            ],
            correct: 1,
            explanation: "Mathematical ratios create visually harmonious relationships between font sizes. Common ratios include Perfect Fourth (1.333), Major Third (1.25), and Golden Ratio (1.618)."
          }
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssTypographyQuiz.title}`);

    // CSS Animations Quiz
    const cssAnimationsQuiz = await prisma.quiz.upsert({
      where: { slug: "css-animations-quiz" },
      update: {},
      create: {
        slug: "css-animations-quiz",
        tutorialId: cssAnimationsTutorial.id,
        title: "CSS Animations Quiz",
        questions: [
          {
            question: "What is the main difference between CSS transitions and animations?",
            options: [
              "Transitions are faster than animations",
              "Transitions animate between two states, animations can have multiple keyframes",
              "Animations only work with transforms",
              "There is no difference"
            ],
            correct: 1,
            explanation: "Transitions animate between two states (A → B), while animations can have multiple keyframes for complex sequences (A → B → C → D)."
          },
          {
            question: "How do you define an animation sequence in CSS?",
            options: [
              "@animation myAnimation { }",
              "@keyframes myAnimation { }",
              "@sequence myAnimation { }",
              "@animate myAnimation { }"
            ],
            correct: 1,
            explanation: "The @keyframes rule is used to define animation sequences with multiple steps."
          },
          {
            question: "What does 'animation-iteration-count: infinite' do?",
            options: [
              "Makes the animation very long",
              "Makes the animation repeat forever",
              "Creates an error",
              "Makes the animation run once"
            ],
            correct: 1,
            explanation: "The 'infinite' value makes the animation repeat continuously without stopping."
          },
          {
            question: "In keyframes, what does '50%' represent?",
            options: [
              "Half the element's size",
              "50 pixels",
              "The halfway point of the animation duration",
              "50 degrees of rotation"
            ],
            correct: 2,
            explanation: "Percentage keyframes represent timing within the animation duration - 50% is the halfway point."
          },
          {
            question: "Which timing function creates the most natural-feeling animation?",
            options: [
              "linear",
              "ease",
              "steps()",
              "cubic-bezier(1,1,1,1)"
            ],
            correct: 1,
            explanation: "The 'ease' timing function mimics natural motion with slow start, fast middle, and slow end."
          },
          {
            question: "What does 'animation-delay: -0.5s' do?",
            options: [
              "Delays the animation by 0.5 seconds",
              "Starts the animation 0.5 seconds earlier in its cycle",
              "Makes the animation 0.5 seconds shorter",
              "Creates an error"
            ],
            correct: 1,
            explanation: "Negative delays make animations start partway through their cycle, useful for creating wave effects."
          },
          {
            question: "Which properties are GPU-accelerated for best animation performance?",
            options: [
              "width, height, margin",
              "transform, opacity",
              "color, background-color",
              "top, left, bottom, right"
            ],
            correct: 1,
            explanation: "Transform and opacity are GPU-accelerated properties that don't trigger layout recalculation."
          },
          {
            question: "What does 'animation-direction: alternate' do?",
            options: [
              "Plays the animation backwards",
              "Plays the animation forward then backward repeatedly",
              "Alternates between different animations",
              "Chooses a random direction"
            ],
            correct: 1,
            explanation: "The 'alternate' direction makes animations go forward, then backward, then forward again."
          },
          {
            question: "How do you create a bouncing ball animation?",
            options: [
              "Use rotate() function",
              "Use translateY() with alternate direction",
              "Use scale() only",
              "Use color changes"
            ],
            correct: 1,
            explanation: "A bouncing ball uses translateY() to move up and down, typically with alternate direction for continuous bouncing."
          },
          {
            question: "What is the purpose of 'animation-fill-mode: forwards'?",
            options: [
              "Makes the animation play forward",
              "Keeps the final animation state after completion",
              "Makes the animation faster",
              "Fills the element with color"
            ],
            correct: 1,
            explanation: "fill-mode: forwards keeps the element in the final keyframe state after the animation completes."
          },
          {
            question: "Which is the correct animation shorthand syntax?",
            options: [
              "animation: 2s ease myAnimation infinite",
              "animation: myAnimation 2s ease infinite",
              "animation: infinite myAnimation 2s ease",
              "animation: ease 2s myAnimation infinite"
            ],
            correct: 1,
            explanation: "The correct order is: name, duration, timing-function, delay, iteration-count, direction, fill-mode."
          },
          {
            question: "What creates a wave effect in loading animations?",
            options: [
              "Different colors",
              "Different animation delays",
              "Different sizes",
              "Different positions only"
            ],
            correct: 1,
            explanation: "Staggered animation delays on similar elements create wave effects, like in loading spinners."
          },
          {
            question: "How do you pause an animation with CSS?",
            options: [
              "animation-pause: true",
              "animation-play-state: paused",
              "animation-stop: pause",
              "animation: none"
            ],
            correct: 1,
            explanation: "The animation-play-state property with value 'paused' stops the animation at its current position."
          },
          {
            question: "What does 'linear' timing function create?",
            options: [
              "Natural acceleration and deceleration",
              "Constant speed throughout the animation",
              "Very fast animation",
              "Bouncing effect"
            ],
            correct: 1,
            explanation: "Linear timing creates constant speed with no acceleration or deceleration, feeling mechanical."
          },
          {
            question: "Which keyframe setup creates a pulsing effect?",
            options: [
              "0% { scale(1) } 100% { scale(2) }",
              "0%, 100% { scale(1) } 50% { scale(1.2) }",
              "0% { opacity: 0 } 100% { opacity: 1 }",
              "0% { rotate(0deg) } 100% { rotate(360deg) }"
            ],
            correct: 1,
            explanation: "A pulsing effect scales up at 50% and returns to normal size at start and end (0%, 100%)."
          },
          {
            question: "What property should you avoid animating for best performance?",
            options: [
              "transform",
              "opacity",
              "width and height",
              "rotate"
            ],
            correct: 2,
            explanation: "Animating layout properties like width and height triggers expensive layout recalculations."
          },
          {
            question: "How do you create a spinning loader animation?",
            options: [
              "Use translate() function",
              "Use rotate(360deg) with linear timing",
              "Use scale() function",
              "Use skew() function"
            ],
            correct: 1,
            explanation: "A spinning loader uses rotate(360deg) from 0deg to 360deg with linear timing for constant rotation."
          },
          {
            question: "What does 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' create?",
            options: [
              "Linear motion",
              "A bouncy, overshoot effect",
              "Very slow motion",
              "No animation"
            ],
            correct: 1,
            explanation: "This cubic-bezier curve creates a bounce effect with overshoot beyond the target value."
          },
          {
            question: "Which technique creates the best slide-in animation?",
            options: [
              "Changing the left property",
              "Using translateX() with transforms",
              "Changing margin-left",
              "Using width changes"
            ],
            correct: 1,
            explanation: "translateX() with transforms is GPU-accelerated and provides the smoothest slide-in effects."
          },
          {
            question: "What's the key to professional loading animations?",
            options: [
              "Very bright colors",
              "Strategic positioning and animation delays",
              "Very fast animations",
              "Complex shapes"
            ],
            correct: 1,
            explanation: "Professional loading animations use strategic positioning and staggered delays to create smooth, wave-like effects."
          }
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssAnimationsQuiz.title}`);

    // CSS Responsive Design Quiz
    const cssResponsiveQuiz = await prisma.quiz.upsert({
      where: { slug: "css-responsive-quiz" },
      update: {},
      create: {
        slug: "css-responsive-quiz",
        tutorialId: cssResponsiveTutorial.id,
        title: "Responsive Design & Media Queries Quiz",
        questions: [
          {
            question: "What is the primary principle of mobile-first responsive design?",
            options: [
              "Design for desktop first, then adapt for mobile",
              "Design for mobile first, then enhance for larger screens",
              "Use the same design for all devices",
              "Focus only on tablet layouts"
            ],
            correct: 1,
            explanation: "Mobile-first design starts with mobile styles as the base, then progressively enhances the experience for larger screens using min-width media queries."
          },
          {
            question: "What does the viewport meta tag 'width=device-width' do?",
            options: [
              "Sets a fixed width for all devices",
              "Makes the viewport width match the device's screen width",
              "Enables responsive images",
              "Creates media queries automatically"
            ],
            correct: 1,
            explanation: "width=device-width makes the viewport width equal to the device's screen width, ensuring proper responsive behavior."
          },
          {
            question: "Which media query targets tablets in portrait orientation?",
            options: [
              "@media (min-width: 480px)",
              "@media (min-width: 768px)",
              "@media (max-width: 767px)",
              "@media (min-width: 1024px)"
            ],
            correct: 1,
            explanation: "768px is the standard breakpoint for tablets in portrait orientation, targeting screens from tablet size and up."
          },
          {
            question: "What does 'clamp(1rem, 4vw, 2rem)' do for typography?",
            options: [
              "Sets font size to exactly 4vw",
              "Creates responsive text that scales between 1rem and 2rem",
              "Makes text 1rem on mobile, 2rem on desktop",
              "Only works on desktop screens"
            ],
            correct: 1,
            explanation: "clamp() creates fluid typography that starts at 1rem minimum, scales at 4% of viewport width, and caps at 2rem maximum."
          },
          {
            question: "Which CSS technique makes images responsive?",
            options: [
              "width: 100%; height: auto;",
              "max-width: 100%; height: auto;",
              "width: auto; height: 100%;",
              "width: 100vw; height: 100vh;"
            ],
            correct: 1,
            explanation: "max-width: 100% and height: auto make images scale down to fit their container while maintaining aspect ratio."
          },
          {
            question: "What is the main advantage of CSS Grid's 'repeat(auto-fit, minmax(250px, 1fr))'?",
            options: [
              "Creates exactly 4 columns",
              "Creates responsive columns that automatically fit the container",
              "Only works on desktop",
              "Makes all columns exactly 250px wide"
            ],
            correct: 1,
            explanation: "auto-fit with minmax creates responsive columns that automatically adjust count based on available space, with minimum 250px width."
          },
          {
            question: "Which breakpoint typically represents desktop screens?",
            options: [
              "480px",
              "768px",
              "1024px",
              "1440px"
            ],
            correct: 2,
            explanation: "1024px is the standard breakpoint for desktop screens, representing the transition from tablet to desktop layouts."
          },
          {
            question: "What does '@media (prefers-color-scheme: dark)' detect?",
            options: [
              "Dark colored websites",
              "User's operating system dark mode preference",
              "Time of day",
              "Device brightness settings"
            ],
            correct: 1,
            explanation: "This media query detects when the user has set their operating system to prefer dark mode interfaces."
          },
          {
            question: "Which container query establishes a query container?",
            options: [
              "container: inline-size;",
              "container-type: inline-size;",
              "query-container: true;",
              "container-query: enabled;"
            ],
            correct: 1,
            explanation: "container-type: inline-size establishes an element as a containment context for size-based container queries."
          },
          {
            question: "What does '@media (hover: hover)' target?",
            options: [
              "All devices with hover capability",
              "Devices where hover is the primary interaction method",
              "Touch devices only",
              "Desktop computers only"
            ],
            correct: 1,
            explanation: "@media (hover: hover) targets devices where hovering is the primary interaction method, typically desktop with mouse."
          },
          {
            question: "In mobile navigation, what triggers the hamburger menu to open?",
            options: [
              "CSS only",
              "JavaScript event handler",
              "Media query",
              "Automatic on small screens"
            ],
            correct: 1,
            explanation: "Hamburger menus require JavaScript event handlers to toggle the active class that shows/hides the navigation menu."
          },
          {
            question: "Which media query targets high-DPI (retina) displays?",
            options: [
              "@media (resolution: high)",
              "@media (min-resolution: 192dpi)",
              "@media (pixel-ratio: 2)",
              "@media (retina: true)"
            ],
            correct: 1,
            explanation: "@media (min-resolution: 192dpi) or (-webkit-min-device-pixel-ratio: 2) targets high-DPI displays like retina screens."
          },
          {
            question: "What does 'flex-wrap: wrap' enable in responsive design?",
            options: [
              "Makes flex items smaller",
              "Allows flex items to wrap to new lines when space is limited",
              "Wraps text inside flex items",
              "Creates vertical flex layouts"
            ],
            correct: 1,
            explanation: "flex-wrap: wrap allows flex items to wrap onto new lines when there isn't enough horizontal space, enabling responsive layouts."
          },
          {
            question: "Which unit is best for responsive margins and padding?",
            options: [
              "px (pixels)",
              "rem (root em)",
              "pt (points)",
              "cm (centimeters)"
            ],
            correct: 1,
            explanation: "rem units are relative to the root font size, making them scalable and accessible for responsive design."
          },
          {
            question: "What does '@media print' optimize for?",
            options: [
              "E-reader devices",
              "Printing web pages",
              "Black and white monitors",
              "High contrast mode"
            ],
            correct: 1,
            explanation: "@media print applies styles specifically when the page is being printed, typically removing colors, shadows, and optimizing layout."
          },
          {
            question: "Which technique creates aspect-ratio containers before aspect-ratio property?",
            options: [
              "height: 0; padding-bottom: percentage;",
              "width: 100%; height: 100%;",
              "position: absolute; top: 0;",
              "display: flex; align-items: center;"
            ],
            correct: 0,
            explanation: "The padding-bottom percentage technique creates aspect ratios: height: 0; padding-bottom: 56.25% creates 16:9 ratio."
          },
          {
            question: "What is the purpose of '@media (prefers-reduced-motion: reduce)'?",
            options: [
              "Slows down all animations",
              "Removes animations for users who prefer reduced motion",
              "Makes animations smaller",
              "Only affects CSS transitions"
            ],
            correct: 1,
            explanation: "This accessibility feature removes or reduces animations for users who have set reduced motion preferences in their OS."
          },
          {
            question: "Which approach creates the most performant responsive images?",
            options: [
              "Multiple img tags with different sources",
              "CSS background images with media queries",
              "The picture element with source sets",
              "JavaScript to swap image sources"
            ],
            correct: 2,
            explanation: "The picture element with responsive source sets allows browsers to choose the most appropriate image for the device and connection."
          },
          {
            question: "What does 'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))' create?",
            options: [
              "Exactly 200px wide columns",
              "Responsive columns that automatically adjust count based on available space",
              "5 columns on all screen sizes",
              "Columns that only work on desktop"
            ],
            correct: 1,
            explanation: "This creates responsive columns that automatically fit the container, with minimum 200px width and growing to fill available space."
          },
          {
            question: "Which CSS feature is most important for touch-friendly design?",
            options: [
              "Large font sizes",
              "Minimum 44px touch targets",
              "Bright colors",
              "Rounded corners"
            ],
            correct: 1,
            explanation: "Touch targets should be at least 44px square to ensure they're large enough for finger taps on mobile devices."
          },
          {
            question: "What makes container queries revolutionary compared to media queries?",
            options: [
              "They're faster than media queries",
              "They respond to element size instead of viewport size",
              "They work better on mobile",
              "They don't need CSS"
            ],
            correct: 1,
            explanation: "Container queries respond to the size of a specific container element, not the viewport, enabling truly modular responsive components."
          },
          {
            question: "Which combination creates the best responsive layout foundation?",
            options: [
              "Fixed pixels for everything",
              "CSS Grid + Flexbox + relative units + media queries",
              "Only media queries",
              "JavaScript-based layouts"
            ],
            correct: 1,
            explanation: "Modern responsive design combines CSS Grid for page layout, Flexbox for component layout, relative units for scalability, and media queries for breakpoints."
          }
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssResponsiveQuiz.title}`);

    // CSS Advanced Selectors Quiz
    const cssAdvancedSelectorsQuiz = await prisma.quiz.upsert({
      where: { slug: "css-advanced-selectors-quiz" },
      update: {},
      create: {
        slug: "css-advanced-selectors-quiz",
        tutorialId: cssAdvancedSelectorsTutorial.id,
        title: "Advanced CSS Selectors Quiz",
        questions: [
          {
            question: "Which CSS selector has the highest specificity?",
            options: [
              "Element selector (div)",
              "Class selector (.highlight)",
              "ID selector (#header)",
              "Inline style (style=\"color: red\")"
            ],
            correct: 3,
            explanation: "Inline styles have the highest specificity (1000), followed by IDs (100), classes (10), and elements (1)."
          },
          {
            question: "What does the ':nth-child(2n+1)' selector target?",
            options: [
              "Every second element",
              "All odd-positioned elements",
              "All even-positioned elements",
              "Only the first element"
            ],
            correct: 1,
            explanation: "2n+1 selects odd-positioned elements (1st, 3rd, 5th, etc.). The formula starts at 1 and increments by 2."
          },
          {
            question: "Which pseudo-class targets the first child element of its type?",
            options: [
              ":first-child",
              ":first-of-type",
              ":nth-child(1)",
              ":only-child"
            ],
            correct: 1,
            explanation: ":first-of-type selects the first element of its type among siblings, while :first-child selects the first child regardless of type."
          },
          {
            question: "What does the ':not(.active)' selector do?",
            options: [
              "Selects elements with the active class",
              "Selects elements without the active class",
              "Creates an error",
              "Disables the active class"
            ],
            correct: 1,
            explanation: "The :not() pseudo-class selects elements that do NOT match the selector inside parentheses."
          },
          {
            question: "Which selector targets form inputs that are required and invalid?",
            options: [
              "input:required:invalid",
              "input[required][invalid]",
              "input.required.invalid",
              "input:required + :invalid"
            ],
            correct: 0,
            explanation: "Chaining pseudo-classes like :required:invalid selects elements that match both conditions simultaneously."
          },
          {
            question: "What does '::before' create?",
            options: [
              "A duplicate of the element",
              "A virtual inline element before the content",
              "A new HTML element",
              "A CSS variable"
            ],
            correct: 1,
            explanation: "::before creates a virtual inline element as the first child of the selected element, perfect for decorative content."
          },
          {
            question: "Which attribute selector matches elements where href starts with 'https'?",
            options: [
              "[href='https']",
              "[href*='https']",
              "[href^='https']",
              "[href$='https']"
            ],
            correct: 2,
            explanation: "[href^='https'] uses the ^ symbol to match attributes that START WITH the specified value."
          },
          {
            question: "What does the child combinator '>' do?",
            options: [
              "Selects all descendants",
              "Selects only direct children",
              "Selects following siblings",
              "Selects parent elements"
            ],
            correct: 1,
            explanation: "The child combinator (>) selects only direct children, not deeper descendants like the descendant combinator (space)."
          },
          {
            question: "Which selector targets elements that contain the word 'button' in their class?",
            options: [
              "[class='button']",
              "[class*='button']",
              "[class^='button']",
              "[class~='button']"
            ],
            correct: 3,
            explanation: "[class~='button'] matches whole words in space-separated values, perfect for targeting specific classes."
          },
          {
            question: "What does ':hover:focus' select?",
            options: [
              "Elements that are hovered OR focused",
              "Elements that are hovered AND focused",
              "Hovered elements that contain focused elements",
              "Creates a CSS error"
            ],
            correct: 1,
            explanation: "Chaining pseudo-classes without spaces means ALL conditions must be true - the element must be both hovered AND focused."
          },
          {
            question: "Which combinator selects the immediately following sibling?",
            options: [
              "~ (general sibling)",
              "+ (adjacent sibling)",
              "> (child)",
              "  (descendant)"
            ],
            correct: 1,
            explanation: "The adjacent sibling combinator (+) selects the element that immediately follows another element at the same level."
          },
          {
            question: "What does '[data-category=\"electronics\"]' target?",
            options: [
              "Elements with data-category containing 'electronics'",
              "Elements with data-category exactly equal to 'electronics'",
              "Elements with any data attribute",
              "Elements with class 'electronics'"
            ],
            correct: 1,
            explanation: "The equals sign (=) in attribute selectors requires an exact match of the entire attribute value."
          },
          {
            question: "Which pseudo-element is best for creating tooltips?",
            options: [
              "::before",
              "::after",
              "Both ::before and ::after",
              "::tooltip"
            ],
            correct: 2,
            explanation: "Tooltips typically use both ::before for the tooltip box and ::after for the arrow/triangle pointer."
          },
          {
            question: "What does ':empty' select?",
            options: [
              "Elements with empty content",
              "Elements with no children (including text)",
              "Elements with display: none",
              "Invisible elements"
            ],
            correct: 1,
            explanation: ":empty selects elements that have no children, including no text content (not even whitespace)."
          },
          {
            question: "Which selector has higher specificity: '.nav .menu' or '.nav-menu'?",
            options: [
              ".nav .menu (20)",
              ".nav-menu (10)",
              "They have equal specificity",
              "It depends on the order in CSS"
            ],
            correct: 0,
            explanation: ".nav .menu has two classes (10 + 10 = 20), while .nav-menu has one class (10). More selectors = higher specificity."
          },
          {
            question: "What does 'input[type=\"email\"]:focus:valid' target?",
            options: [
              "All email inputs",
              "Focused email inputs",
              "Valid email inputs",
              "Focused email inputs that contain valid data"
            ],
            correct: 3,
            explanation: "This chains three selectors: email type inputs that are currently focused AND contain valid email data."
          },
          {
            question: "Which attribute selector matches file extensions ending in '.pdf'?",
            options: [
              "[href*='.pdf']",
              "[href$='.pdf']",
              "[href^='.pdf']",
              "[href~='.pdf']"
            ],
            correct: 1,
            explanation: "[href$='.pdf'] uses the $ symbol to match attributes that END WITH the specified value."
          },
          {
            question: "What performance consideration applies to CSS selectors?",
            options: [
              "Longer selectors are always faster",
              "ID selectors are slowest",
              "Browsers read selectors from right to left",
              "Attribute selectors are always fastest"
            ],
            correct: 2,
            explanation: "Browsers parse selectors right-to-left, so the rightmost selector should be as specific as possible for better performance."
          }
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssAdvancedSelectorsQuiz.title}`);

    console.log("🎉 CSS tutorials seeded successfully!");

    return {
      category: cssCategory,
      tutorials: [
        cssFundamentalsTutorial,
        cssFlexboxTutorial,
        cssGridTutorial,
        cssPositioningTutorial,
        cssTransformsTutorial,
        cssAnimationsTutorial,
        cssResponsiveTutorial,
        cssAdvancedSelectorsTutorial,
        cssVariablesTutorial,
        cssTypographyTutorial,
        cssArchitectureTutorial,
        cssModernFeaturesTutorial,
      ],
      quizzes: [
        cssFundamentalsQuiz,
        cssFlexboxQuiz,
        cssGridQuiz,
        cssPositioningQuiz,
        cssTransformsQuiz,
        cssAnimationsQuiz,
        cssResponsiveQuiz,
        cssAdvancedSelectorsQuiz,
        cssVariablesQuiz,
        cssTypographyQuiz,
      ],
    };
  } catch (error) {
    console.error("❌ Error seeding CSS tutorials:", error);
    throw error;
  }
}

export default seedCssTutorials;

// Allow running this script directly
seedCssTutorials()
  .then(() => {
    console.log("✅ CSS tutorials seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ CSS tutorials seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
