import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDomTutorials() {
  console.log("🌱 Seeding DOM tutorials...");

  try {
    // Create or get the DOM category
    const domCategory = await prisma.category.upsert({
      where: { slug: "dom" },
      update: {},
      create: {
        title: "DOM Manipulation",
        slug: "dom",
        description:
          "Master the Document Object Model and Browser APIs to create dynamic, interactive web experiences.",
        difficulty: "intermediate",
        duration: "6-8 hours", // Total estimated time for all tutorials
        topics: ["DOM", "JavaScript", "Browser APIs", "Events", "Forms"],
        order: 3, // After fundamentals and CSS
        published: true,
      },
    });

    console.log(`✅ DOM category created/updated: ${domCategory.id}`);

    // Define DOM tutorials
    const domTutorials = [
      {
        title: "DOM Manipulation: Bringing Web Pages to Life",
        slug: "dom-manipulation",
        description:
          "Learn to interact with and manipulate HTML elements using JavaScript DOM methods for dynamic web experiences.",
        content: "dom/01-dom-manipulation",
        difficulty: 2,
        estimatedTime: 45,
        order: 1,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        title: "DOM Selectors & Traversal: Finding Elements Like a Pro",
        slug: "dom-selectors-traversal",
        description:
          "Master advanced DOM selection techniques, CSS selectors, and tree traversal methods to efficiently navigate HTML structures.",
        content: "dom/02-dom-selectors-traversal",
        difficulty: 2,
        estimatedTime: 50,
        order: 2,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        title: "DOM Events Deep Dive: Interactive Web Magic",
        slug: "dom-events-deep-dive",
        description:
          "Master event handling, event delegation, custom events, and advanced interaction patterns for dynamic web applications.",
        content: "dom/03-dom-events-deep-dive",
        difficulty: 3,
        estimatedTime: 60,
        order: 3,
        isPremium: true,
        requiredPlan: "VIBED",
      },
      {
        title: "Form Handling & Validation: User Input Mastery",
        slug: "form-handling-validation",
        description:
          "Master form interactions, validation patterns, data collection, and user experience best practices for web forms.",
        content: "dom/04-form-handling-validation",
        difficulty: 3,
        estimatedTime: 55,
        order: 4,
        isPremium: true,
        requiredPlan: "VIBED",
      },
      {
        title: "Browser Object Model (BOM): Mastering the Browser Environment",
        slug: "browser-object-model",
        description:
          "Explore the Browser Object Model to control navigation, manage browser history, handle storage, and interact with the browser environment.",
        content: "dom/05-browser-object-model",
        difficulty: 3,
        estimatedTime: 50,
        order: 5,
        isPremium: true,
        requiredPlan: "VIBED",
      },
    ];

    // Create tutorials
    for (const tutorialData of domTutorials) {
      const tutorial = await prisma.tutorial.upsert({
        where: {
          slug: tutorialData.slug,
        },
        update: {
          title: tutorialData.title,
          description: tutorialData.description,
          mdxFile: tutorialData.content,
          difficulty: tutorialData.difficulty,
          estimatedTime: tutorialData.estimatedTime,
          order: tutorialData.order,
          isPremium: tutorialData.isPremium,
          requiredPlan: tutorialData.requiredPlan,
          published: true,
          categoryId: domCategory.id,
        },
        create: {
          title: tutorialData.title,
          slug: tutorialData.slug,
          description: tutorialData.description,
          mdxFile: tutorialData.content,
          difficulty: tutorialData.difficulty,
          estimatedTime: tutorialData.estimatedTime,
          order: tutorialData.order,
          isPremium: tutorialData.isPremium,
          requiredPlan: tutorialData.requiredPlan,
          published: true,
          categoryId: domCategory.id,
        },
      });

      console.log(`✅ Tutorial created/updated: ${tutorial.title}`);
    }

    // Note: Quiz creation should be handled by the quiz seeding system
    console.log(
      "📝 Tutorial structure created. Quizzes should be seeded separately using the quiz system."
    );

    // Create sample achievements related to DOM learning
    const domAchievements = [
      {
        key: "dom-manipulator",
        title: "DOM Manipulator",
        description: "Complete your first DOM manipulation tutorial",
        icon: "🎯",
        category: "learning",
        rarity: "COMMON",
        points: 50,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 1,
        isHidden: false,
      },
      {
        key: "element-selector-master",
        title: "Element Selector Master",
        description: "Master all DOM selector techniques",
        icon: "🎪",
        category: "learning",
        rarity: "COMMON",
        points: 75,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 2,
        isHidden: false,
      },
      {
        key: "event-handler-pro",
        title: "Event Handler Pro",
        description: "Complete the DOM Events Deep Dive tutorial",
        icon: "⚡",
        category: "learning",
        rarity: "RARE",
        points: 100,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 3,
        isHidden: false,
      },
      {
        key: "form-wizard",
        title: "Form Wizard",
        description: "Master form handling and validation",
        icon: "🧙‍♂️",
        category: "learning",
        rarity: "RARE",
        points: 125,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 4,
        isHidden: false,
      },
      {
        key: "browser-master",
        title: "Browser Master",
        description: "Complete all DOM and Browser API tutorials",
        icon: "🌐",
        category: "learning",
        rarity: "EPIC",
        points: 200,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 5,
        isHidden: false,
      },
    ];

    for (const achievementData of domAchievements) {
      await prisma.achievement.upsert({
        where: {
          key: achievementData.key,
        },
        update: achievementData,
        create: achievementData,
      });
    }

    console.log(
      `✅ Created ${domAchievements.length} DOM-related achievements`
    );

    const domManipulationQuiz = [
      {
        title: "DOM Manipulation Quiz",
        slug: "dom-manipulation-quiz",
        tutorialSlug: "dom-manipulation",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: 1,
            question: "Which method is used to select an element by its ID?",
            type: "multiple-choice",
            options: [
              "document.querySelector('#id')",
              "document.getElementByClass('id')",
              "document.getElementById('id')",
              "document.selectElementById('id')",
            ],
            correct: 2,
            explanation:
              "`document.getElementById('id')` is the standard method for selecting an element by its ID.",
            difficulty: "easy",
          },
          {
            id: 2,
            question: "What does `element.textContent` do?",
            type: "multiple-choice",
            options: [
              "Changes the tag name",
              "Sets or gets the text inside an element",
              "Executes HTML inside the element",
              "Applies inline styles",
            ],
            correct: 1,
            explanation:
              "`textContent` sets or retrieves the plain text inside an element, without interpreting HTML.",
            difficulty: "easy",
          },
          {
            id: 3,
            question:
              "Which property is used to change an element's inline CSS with JavaScript?",
            type: "multiple-choice",
            options: [
              "element.css",
              "element.classList",
              "element.innerStyle",
              "element.style",
            ],
            correct: 3,
            explanation:
              "`element.style` allows you to set or get inline CSS properties like `color`, `backgroundColor`, etc.",
            difficulty: "easy",
          },
          {
            id: 4,
            question: "How do you create a new DOM element in JavaScript?",
            type: "multiple-choice",
            options: [
              "new HTMLElement('div')",
              "document.newElement('div')",
              "document.createElement('div')",
              "create.div()",
            ],
            correct: 2,
            explanation:
              "`document.createElement('div')` creates a new DOM element of the specified tag type.",
            difficulty: "medium",
          },
          {
            id: 5,
            question: "Which method attaches a child to a parent DOM node?",
            type: "multiple-choice",
            options: [
              "append()",
              "appendChild()",
              "addNode()",
              "attachElement()",
            ],
            correct: 1,
            explanation:
              "`appendChild()` inserts a node as the last child of a parent element.",
            difficulty: "medium",
          },
          {
            id: 6,
            question: "How do you listen to a click event on a button element?",
            type: "multiple-choice",
            options: [
              "button.addListener('click', function...)",
              "button.onClick(function...)",
              "button.event('click', callback)",
              "button.addEventListener('click', function...)",
            ],
            correct: 3,
            explanation:
              "`addEventListener('click', ...)` is the correct way to attach a click event listener to a DOM element.",
            difficulty: "medium",
          },
          {
            id: 7,
            question: "What does `classList.toggle('active')` do?",
            type: "multiple-choice",
            options: [
              "Always adds the class",
              "Always removes the class",
              "Adds the class if it's missing, removes it if it's present",
              "Changes the class name to 'active'",
            ],
            correct: 2,
            explanation:
              "`toggle()` checks if the class exists; if it does, it removes it, otherwise it adds it. Great for show/hide logic.",
            difficulty: "medium",
          },
          {
            id: 8,
            question: "What happens when you use `element.remove()`?",
            type: "multiple-choice",
            options: [
              "It disables the element",
              "It removes the element from the DOM entirely",
              "It clears the content inside the element",
              "It hides the element with CSS",
            ],
            correct: 1,
            explanation:
              "`element.remove()` deletes the element from the DOM structure, making it no longer available visually or via JavaScript.",
            difficulty: "easy",
          },
          {
            id: 9,
            question:
              "What is the difference between `.innerHTML` and `.textContent`?",
            type: "multiple-choice",
            options: [
              "`innerHTML` includes HTML tags; `textContent` only includes text",
              "They are exactly the same",
              "`textContent` includes HTML tags; `innerHTML` does not",
              "`innerHTML` can only be used on inputs",
            ],
            correct: 0,
            explanation:
              "`innerHTML` can parse and insert HTML markup; `textContent` will treat everything as plain text, escaping any tags.",
            difficulty: "medium",
          },
          {
            id: 10,
            question:
              "Which method selects the **first** matching element from the DOM?",
            type: "multiple-choice",
            options: [
              "document.getElementByClassName()",
              "document.querySelectorAll()",
              "document.querySelector()",
              "document.getElementsByTagName()",
            ],
            correct: 2,
            explanation:
              "`querySelector()` returns the first element that matches a given CSS selector. `querySelectorAll()` returns a list.",
            difficulty: "medium",
          },
          {
            id: 11,
            question:
              "What is the difference between `parentNode` and `parentElement`?",
            type: "multiple-choice",
            options: [
              "They are exactly the same",
              "`parentNode` can return document nodes, `parentElement` only returns element nodes",
              "`parentElement` can return document nodes, `parentNode` only returns element nodes",
              "`parentNode` is deprecated, use `parentElement` instead",
            ],
            correct: 1,
            explanation:
              "`parentNode` can return any type of node (including document nodes), while `parentElement` only returns element nodes or null.",
            difficulty: "medium",
          },
          {
            id: 12,
            question:
              "How do you efficiently add multiple elements to the DOM at once?",
            type: "multiple-choice",
            options: [
              "Use multiple `appendChild()` calls",
              "Use `DocumentFragment` to batch append operations",
              "Use `innerHTML` with concatenated strings",
              "Use `insertAdjacentHTML()` multiple times",
            ],
            correct: 1,
            explanation:
              "`DocumentFragment` allows you to build DOM structure in memory and append it all at once, minimizing reflows and improving performance.",
            difficulty: "hard",
          },
          {
            id: 13,
            question:
              "What does `event.preventDefault()` do in an event handler?",
            type: "multiple-choice",
            options: [
              "Stops the event from bubbling up to parent elements",
              "Cancels the default action associated with the event",
              "Removes the event listener",
              "Prevents the event from being triggered again",
            ],
            correct: 1,
            explanation:
              "`preventDefault()` cancels the default browser behavior for an event (like form submission or link navigation) but doesn't stop event propagation.",
            difficulty: "medium",
          },
          {
            id: 14,
            question: "What is event delegation and why is it useful?",
            type: "multiple-choice",
            options: [
              "Adding event listeners to each individual element",
              "Using a single event listener on a parent to handle events from child elements",
              "Preventing events from bubbling up the DOM tree",
              "Creating custom events for specific elements",
            ],
            correct: 1,
            explanation:
              "Event delegation uses event bubbling to handle events from child elements with a single listener on their parent, improving performance and handling dynamic content.",
            difficulty: "hard",
          },
          {
            id: 15,
            question:
              "Which method allows you to insert HTML at a specific position relative to an element?",
            type: "multiple-choice",
            options: [
              "insertBefore()",
              "appendChild()",
              "insertAdjacentHTML()",
              "replaceChild()",
            ],
            correct: 2,
            explanation:
              "`insertAdjacentHTML()` can insert HTML at four positions: 'beforebegin', 'afterbegin', 'beforeend', and 'afterend' relative to the target element.",
            difficulty: "medium",
          },
          {
            id: 16,
            question:
              "What happens if you try to access a DOM element before the page finishes loading?",
            type: "multiple-choice",
            options: [
              "The element will always be null or undefined",
              "JavaScript will throw a syntax error",
              "The browser will wait automatically",
              "The element might be null if it hasn't been parsed yet",
            ],
            correct: 3,
            explanation:
              "If you try to access a DOM element before it's been parsed by the browser, it will be null. This is why we use events like 'DOMContentLoaded' or place scripts at the end of the body.",
            difficulty: "medium",
          },
          {
            id: 17,
            question:
              "Which property gives you the actual visible width of an element including padding but excluding borders?",
            type: "multiple-choice",
            options: [
              "offsetWidth",
              "clientWidth",
              "scrollWidth",
              "getBoundingClientRect().width",
            ],
            correct: 1,
            explanation:
              "`clientWidth` returns the inner width including padding but excluding borders and scrollbars. `offsetWidth` includes borders, `scrollWidth` includes overflow content.",
            difficulty: "hard",
          },
          {
            id: 18,
            question: "How do you clone a DOM element and all its children?",
            type: "multiple-choice",
            options: [
              "element.clone(true)",
              "element.cloneNode(true)",
              "element.copy()",
              "element.duplicate(true)",
            ],
            correct: 1,
            explanation:
              "`cloneNode(true)` creates a deep copy of the element including all its children. `cloneNode(false)` or `cloneNode()` only clones the element itself.",
            difficulty: "medium",
          },
          {
            id: 19,
            question:
              "What is the difference between `textContent` and `innerText`?",
            type: "multiple-choice",
            options: [
              "They are exactly the same",
              "`textContent` gets all text including hidden elements, `innerText` respects styling",
              "`innerText` gets all text including hidden elements, `textContent` respects styling",
              "`textContent` is faster, `innerText` is more accurate",
            ],
            correct: 1,
            explanation:
              "`textContent` gets all text content regardless of CSS visibility, while `innerText` respects styling and won't include text from hidden elements.",
            difficulty: "hard",
          },
          {
            id: 20,
            question:
              "Which event fires when the user starts typing in an input field?",
            type: "multiple-choice",
            options: ["onChange", "onInput", "onKeyPress", "onFocus"],
            correct: 1,
            explanation:
              "The `input` event fires immediately when the input value changes, while `change` only fires when the input loses focus. `input` is better for real-time validation.",
            difficulty: "medium",
          },
          {
            id: 21,
            question:
              "How do you properly remove an event listener that was added with `addEventListener`?",
            type: "multiple-choice",
            options: [
              "element.removeEventListener('click')",
              "element.removeEventListener('click', functionReference)",
              "element.addEventListener('click', null)",
              "delete element.onclick",
            ],
            correct: 1,
            explanation:
              "`removeEventListener()` requires the exact same function reference that was used in `addEventListener()`. Anonymous functions cannot be removed this way.",
            difficulty: "medium",
          },
          {
            id: 22,
            question: "What does `document.createDocumentFragment()` create?",
            type: "multiple-choice",
            options: [
              "A new HTML document",
              "A lightweight container for DOM nodes that exists in memory only",
              "A copy of the current document",
              "A template for reusable HTML structure",
            ],
            correct: 1,
            explanation:
              "DocumentFragment is a lightweight container that holds DOM nodes in memory. It's not part of the main DOM tree, making it ideal for building structures before adding them to the document.",
            difficulty: "hard",
          },
          {
            id: 23,
            question:
              "Which method is best for setting multiple CSS properties at once?",
            type: "multiple-choice",
            options: [
              "element.style.cssText = 'color: red; font-size: 16px;'",
              "element.setAttribute('style', 'color: red; font-size: 16px;')",
              "element.style.setProperty() multiple times",
              "All of the above work equally well",
            ],
            correct: 0,
            explanation:
              "`style.cssText` is the most efficient way to set multiple CSS properties at once, as it requires only one DOM operation instead of multiple property assignments.",
            difficulty: "hard",
          },
          {
            id: 24,
            question:
              "What happens when you set `element.innerHTML` to include script tags?",
            type: "multiple-choice",
            options: [
              "The scripts will execute immediately",
              "The scripts will not execute for security reasons",
              "The scripts will execute only if they're inline",
              "The scripts will execute only if they're external",
            ],
            correct: 1,
            explanation:
              "For security reasons, script tags inserted via `innerHTML` will not execute. Use `createElement()` and `appendChild()` if you need to add executable scripts dynamically.",
            difficulty: "hard",
          },
          {
            id: 25,
            question:
              "How do you check if an element has a specific CSS class without using external libraries?",
            type: "multiple-choice",
            options: [
              "element.className.includes('className')",
              "element.classList.contains('className')",
              "element.hasClass('className')",
              "element.style.className === 'className'",
            ],
            correct: 1,
            explanation:
              "`classList.contains()` is the most reliable method to check for a class. Using `className.includes()` can give false positives for partial class name matches.",
            difficulty: "easy",
          },
        ],
      },
    ];

    for (const domData of domManipulationQuiz) {
      // Find the tutorial this quiz belongs to
      const tutorial = await prisma.tutorial.findUnique({
        where: { slug: domData.tutorialSlug },
      });

      if (!tutorial) {
        console.warn(`⚠️ Tutorial not found for quiz: ${domData.slug}`);
        continue;
      }

      const { tutorialSlug, ...quizData } = domData;
      await prisma.quiz.upsert({
        where: {
          slug: domData.slug,
        },
        update: {
          title: quizData.title,
          questions: quizData.questions,
          isPremium: quizData.isPremium,
          requiredPlan: quizData.requiredPlan,
        },
        create: { ...quizData, tutorialId: tutorial.id },
      });
    }

    console.log("🎉 DOM tutorials seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding DOM tutorials:", error);
    throw error;
  }
}

export default seedDomTutorials;

seedDomTutorials()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
