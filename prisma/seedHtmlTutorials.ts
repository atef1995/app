import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedHtmlTutorials() {
  console.log("🌐 Seeding HTML tutorials...");

  try {
    // HTML Tutorials
    const htmlTutorials = [
      {
        slug: "html-basics",
        title: "HTML Basics: Building Your First Web Page",
        description:
          "Learn the fundamental building blocks of the web with HTML elements, tags, and document structure",
        mdxFile: "html/01-html-basics",
        category: "html",
        estimatedTime: 45.0,
        difficulty: 1,
        order: 1,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        slug: "html-forms-inputs",
        title: "HTML Forms and Input Elements: Building Interactive Web Pages",
        description:
          "Master HTML forms, input types, validation, and user interaction to create dynamic web experiences",
        mdxFile: "html/02-html-forms-inputs",
        category: "html",
        estimatedTime: 60.0,
        difficulty: 2,
        order: 2,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        slug: "html-multimedia",
        title: "HTML Multimedia: Images, Videos, and Audio",
        description:
          "Learn to add and optimize images, videos, audio, and other multimedia content to create engaging web experiences",
        mdxFile: "html/03-html-multimedia",
        category: "html",
        estimatedTime: 50.0,
        difficulty: 2,
        order: 3,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        slug: "html-semantic-elements",
        title: "HTML5 Semantic Elements: Building Meaningful Web Structure",
        description:
          "Learn HTML5 semantic elements to create well-structured, accessible, and SEO-friendly web pages",
        mdxFile: "html/04-html-semantic-elements",
        category: "html",
        estimatedTime: 45.0,
        difficulty: 3,
        order: 4,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        slug: "html-accessibility",
        title: "HTML Accessibility: Building Inclusive Web Experiences",
        description:
          "Learn to create accessible web content that works for everyone, including users with disabilities, using semantic HTML and accessibility best practices",
        mdxFile: "html/05-html-accessibility",
        category: "html",
        estimatedTime: 55.0,
        difficulty: 3,
        order: 5,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    ];

    // Get the HTML category
    const htmlCategory = await prisma.category.findUnique({
      where: { slug: "html" },
    });

    if (!htmlCategory) {
      throw new Error("HTML category not found. Please run seedCategories first.");
    }

    // Create tutorials
    for (const tutorial of htmlTutorials) {
      const { category, ...tutorialData } = tutorial;
      const createdTutorial = await prisma.tutorial.upsert({
        where: { slug: tutorial.slug },
        update: {
          ...tutorialData,
          category: {
            connect: { id: htmlCategory.id }
          }
        },
        create: {
          ...tutorialData,
          category: {
            connect: { id: htmlCategory.id }
          }
        },
      });

      console.log(`✅ Created/updated tutorial: ${createdTutorial.title}`);
    }

    // HTML Tutorial Quizzes
    const htmlQuizzes = [
      {
        slug: "html-basics-quiz",
        title: "HTML Basics Quiz",
        tutorialSlug: "html-basics",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-basics-1",
            question: "What does HTML stand for?",
            type: "multiple-choice",
            options: [
              "Hypertext Markup Language",
              "High Tech Modern Language",
              "Home Tool Markup Language",
              "Hyperlink and Text Markup Language",
            ],
            correct: 0,
            explanation:
              "HTML stands for Hypertext Markup Language. It is the standard markup language used to create web pages.",
          },
          {
            id: "html-basics-2",
            question: "Which HTML element is used for the largest heading?",
            type: "multiple-choice",
            options: ["<h6>", "<h1>", "<heading>", "<header>"],
            correct: 1,
            explanation:
              "<h1> represents the largest heading in HTML. Headings range from <h1> (largest) to <h6> (smallest).",
          },
          {
            id: "html-basics-3",
            question:
              "What is the correct HTML element for creating a line break?",
            type: "multiple-choice",
            options: ["<break>", "<br>", "<lb>", "<newline>"],
            correct: 1,
            explanation:
              "<br> is the correct HTML element for creating a line break. It is a self-closing element.",
          },
          {
            id: "html-basics-4",
            question: "Which attribute specifies the URL of a link?",
            type: "multiple-choice",
            options: ["src", "link", "href", "url"],
            correct: 2,
            explanation:
              "The href attribute specifies the URL of the page the link goes to.",
          },
          {
            id: "html-basics-5",
            question:
              "What is the purpose of the alt attribute in img elements?",
            type: "multiple-choice",
            options: [
              "To specify the image width",
              "To provide alternative text for screen readers",
              "To set the image source",
              "To add a border to the image",
            ],
            correct: 1,
            explanation:
              "The alt attribute provides alternative text for images, which is crucial for accessibility and screen readers.",
          },
          {
            id: "html-basics-6",
            question: "Which HTML element is used to define a paragraph?",
            type: "multiple-choice",
            options: ["<paragraph>", "<p>", "<para>", "<text>"],
            correct: 1,
            explanation: "<p> is the HTML element used to define a paragraph.",
          },
          {
            id: "html-basics-7",
            question: "What does the <title> element define?",
            type: "multiple-choice",
            options: [
              "The main heading of the page",
              "The title shown in the browser tab",
              "The largest text on the page",
              "The navigation title",
            ],
            correct: 1,
            explanation:
              "The <title> element defines the title shown in the browser tab and is also used by search engines.",
          },
          {
            id: "html-basics-8",
            question: "Which HTML element creates an unordered list?",
            type: "multiple-choice",
            options: ["<ol>", "<ul>", "<list>", "<unordered>"],
            correct: 1,
            explanation:
              "<ul> creates an unordered (bulleted) list, while <ol> creates an ordered (numbered) list.",
          },
          {
            id: "html-basics-9",
            question: "What is the correct HTML for creating a hyperlink?",
            type: "multiple-choice",
            options: [
              '<a url="http://example.com">Link</a>',
              '<a href="http://example.com">Link</a>',
              '<link href="http://example.com">Link</link>',
              '<a src="http://example.com">Link</a>',
            ],
            correct: 1,
            explanation:
              '<a href="URL">Link text</a> is the correct syntax for creating a hyperlink.',
          },
          {
            id: "html-basics-10",
            question: "Which HTML element is used to display code?",
            type: "multiple-choice",
            options: ["<code>", "<script>", "<pre>", "<programming>"],
            correct: 0,
            explanation:
              "<code> is used to display inline code. <pre> can be used for preformatted text including code blocks.",
          },
          {
            id: "html-basics-11",
            question: "What is the purpose of the DOCTYPE declaration?",
            type: "multiple-choice",
            options: [
              "To define the document type and version",
              "To set the page title",
              "To include CSS styles",
              "To create a comment",
            ],
            correct: 0,
            explanation:
              "DOCTYPE tells the browser which version of HTML the page is written in and ensures proper rendering.",
          },
          {
            id: "html-basics-12",
            question: "Which element is used to group table rows?",
            type: "multiple-choice",
            options: ["<tbody>", "<tgroup>", "<rows>", "<group>"],
            correct: 0,
            explanation:
              "<tbody> is used to group the body content in a table, separate from <thead> and <tfoot>.",
          },
          {
            id: "html-basics-13",
            question: "What is the correct way to comment in HTML?",
            type: "multiple-choice",
            options: [
              "// This is a comment",
              "/* This is a comment */",
              "<!-- This is a comment -->",
              "# This is a comment",
            ],
            correct: 2,
            explanation:
              "<!-- comment --> is the correct syntax for HTML comments.",
          },
          {
            id: "html-basics-14",
            question: "Which attribute makes an input field required?",
            type: "multiple-choice",
            options: ["mandatory", "required", "needed", "must"],
            correct: 1,
            explanation:
              "The required attribute makes an input field mandatory before form submission.",
          },
          {
            id: "html-basics-15",
            question: "What does the lang attribute specify?",
            type: "multiple-choice",
            options: [
              "The programming language used",
              "The natural language of the content",
              "The location of the website",
              "The layout direction",
            ],
            correct: 1,
            explanation:
              "The lang attribute specifies the natural language of the content, which helps browsers and screen readers.",
          },
        ],
      },
      {
        slug: "html-forms-inputs-quiz",
        title: "HTML Forms and Input Elements Quiz",
        tutorialSlug: "html-forms-inputs",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-forms-1",
            question:
              "Which HTTP method is typically used for form submissions that modify data?",
            type: "multiple-choice",
            options: ["GET", "POST", "PUT", "DELETE"],
            correct: 1,
            explanation:
              "POST is used for form submissions that modify server data, while GET is used for retrieving data.",
          },
          {
            id: "html-forms-2",
            question:
              "What is the purpose of the name attribute in form inputs?",
            type: "multiple-choice",
            options: [
              "To display a label",
              "To identify the data when the form is submitted",
              "To set the input type",
              "To validate the input",
            ],
            correct: 1,
            explanation:
              "The name attribute identifies the data when the form is submitted to the server.",
          },
          {
            id: "html-forms-3",
            question: "Which input type provides a date picker?",
            type: "multiple-choice",
            options: ["date", "datetime", "calendar", "picker"],
            correct: 0,
            explanation:
              "The date input type provides a native date picker in most modern browsers.",
          },
          {
            id: "html-forms-4",
            question: "What does the placeholder attribute do?",
            type: "multiple-choice",
            options: [
              "Sets the default value",
              "Provides example text that disappears when typing",
              "Creates a label for the input",
              "Validates the input format",
            ],
            correct: 1,
            explanation:
              "Placeholder provides hint text that disappears when the user starts typing.",
          },
          {
            id: "html-forms-5",
            question: "Which element is used to group related form controls?",
            type: "multiple-choice",
            options: ["<group>", "<fieldset>", "<section>", "<div>"],
            correct: 1,
            explanation:
              "<fieldset> is specifically designed to group related form controls, often with a <legend>.",
          },
          {
            id: "html-forms-6",
            question:
              "What is the difference between radio buttons and checkboxes?",
            type: "multiple-choice",
            options: [
              "Radio buttons are for single selection, checkboxes for multiple",
              "Radio buttons are round, checkboxes are square",
              "Radio buttons are for text, checkboxes for numbers",
              "There is no difference",
            ],
            correct: 0,
            explanation:
              "Radio buttons allow only one selection from a group, while checkboxes allow multiple selections.",
          },
          {
            id: "html-forms-7",
            question: "Which attribute associates a label with its input?",
            type: "multiple-choice",
            options: ["name", "for", "id", "target"],
            correct: 1,
            explanation:
              "The for attribute on a label should match the id attribute of its associated input.",
          },
          {
            id: "html-forms-8",
            question: "What does the required attribute do?",
            type: "multiple-choice",
            options: [
              "Makes the field visible",
              "Prevents form submission if the field is empty",
              "Sets a default value",
              "Enables autocomplete",
            ],
            correct: 1,
            explanation:
              "The required attribute prevents form submission if the field is empty or invalid.",
          },
          {
            id: "html-forms-9",
            question: "Which input type is best for email addresses?",
            type: "multiple-choice",
            options: ["text", "email", "mail", "address"],
            correct: 1,
            explanation:
              "The email input type provides built-in validation and mobile-optimized keyboards.",
          },
          {
            id: "html-forms-10",
            question: "What is the purpose of the action attribute in a form?",
            type: "multiple-choice",
            options: [
              "To specify the form method",
              "To define where to send form data",
              "To set the form encoding",
              "To validate the form",
            ],
            correct: 1,
            explanation:
              "The action attribute specifies the URL where the form data should be sent when submitted.",
          },
          {
            id: "html-forms-11",
            question: "Which element creates a dropdown selection list?",
            type: "multiple-choice",
            options: ["<dropdown>", "<select>", "<list>", "<options>"],
            correct: 1,
            explanation:
              "<select> creates a dropdown list, containing <option> elements for each choice.",
          },
          {
            id: "html-forms-12",
            question:
              "What does the multiple attribute do on a select element?",
            type: "multiple-choice",
            options: [
              "Creates multiple dropdowns",
              "Allows selection of multiple options",
              "Duplicates the select element",
              "Enables keyboard navigation",
            ],
            correct: 1,
            explanation:
              "The multiple attribute allows users to select more than one option from a select list.",
          },
          {
            id: "html-forms-13",
            question: "Which input type creates a slider control?",
            type: "multiple-choice",
            options: ["slider", "range", "number", "control"],
            correct: 1,
            explanation:
              "The range input type creates a slider control for selecting values within a range.",
          },
          {
            id: "html-forms-14",
            question: "What is the purpose of the legend element?",
            type: "multiple-choice",
            options: [
              "To create a form title",
              "To provide a caption for a fieldset",
              "To display help text",
              "To group inputs",
            ],
            correct: 1,
            explanation:
              "The legend element provides a caption or title for a fieldset, improving accessibility.",
          },
          {
            id: "html-forms-15",
            question:
              "Which attribute specifies the accepted file types for file uploads?",
            type: "multiple-choice",
            options: ["types", "accept", "files", "formats"],
            correct: 1,
            explanation:
              "The accept attribute specifies which file types are accepted for file input elements.",
          },
        ],
      },
      {
        slug: "html-multimedia-quiz",
        title: "HTML Multimedia Quiz",
        tutorialSlug: "html-multimedia",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-multimedia-1",
            question: "What does the alt attribute provide for images?",
            type: "multiple-choice",
            options: [
              "Alternative styling",
              "Alternative text for accessibility",
              "Alternative source",
              "Alternative dimensions",
            ],
            correct: 1,
            explanation:
              "The alt attribute provides alternative text that describes the image for screen readers and when images fail to load.",
          },
          {
            id: "html-multimedia-2",
            question: "Which element is used to provide captions for images?",
            type: "multiple-choice",
            options: ["<caption>", "<figcaption>", "<description>", "<title>"],
            correct: 1,
            explanation:
              "<figcaption> is used within a <figure> element to provide captions for images or other content.",
          },
          {
            id: "html-multimedia-3",
            question:
              "What is the purpose of the poster attribute in video elements?",
            type: "multiple-choice",
            options: [
              "To add subtitles",
              "To specify a thumbnail image",
              "To set video quality",
              "To enable autoplay",
            ],
            correct: 1,
            explanation:
              "The poster attribute specifies an image to show before the video starts playing.",
          },
          {
            id: "html-multimedia-4",
            question:
              "Which attribute makes a video play automatically when the page loads?",
            type: "multiple-choice",
            options: ["play", "auto", "autoplay", "start"],
            correct: 2,
            explanation:
              "The autoplay attribute makes videos start playing automatically, though most browsers require the muted attribute as well.",
          },
          {
            id: "html-multimedia-5",
            question: "What does the srcset attribute do for images?",
            type: "multiple-choice",
            options: [
              "Sets the image source",
              "Provides multiple image sources for different screen sizes",
              "Sets image quality",
              "Enables lazy loading",
            ],
            correct: 1,
            explanation:
              "srcset allows you to provide multiple image sources for different screen resolutions and sizes.",
          },
          {
            id: "html-multimedia-6",
            question:
              "Which element is used for grouping media content with captions?",
            type: "multiple-choice",
            options: ["<media>", "<figure>", "<container>", "<wrapper>"],
            correct: 1,
            explanation:
              "<figure> is used to group media content like images with their captions using <figcaption>.",
          },
          {
            id: "html-multimedia-7",
            question:
              "What does the controls attribute do for video/audio elements?",
            type: "multiple-choice",
            options: [
              "Enables volume control only",
              "Shows playback controls like play, pause, volume",
              "Allows remote control",
              "Enables keyboard shortcuts",
            ],
            correct: 1,
            explanation:
              "The controls attribute displays the browser's default playback controls for video and audio elements.",
          },
          {
            id: "html-multimedia-8",
            question: "Which format is best for photographs on the web?",
            type: "multiple-choice",
            options: ["PNG", "SVG", "JPEG", "GIF"],
            correct: 2,
            explanation:
              "JPEG is typically best for photographs due to good compression while maintaining quality.",
          },
          {
            id: "html-multimedia-9",
            question: "What is the purpose of the preload attribute?",
            type: "multiple-choice",
            options: [
              "To load the entire media file immediately",
              "To specify how much media to preload",
              "To enable progressive download",
              "To set buffer size",
            ],
            correct: 1,
            explanation:
              "The preload attribute specifies whether and how much of the media should be loaded when the page loads.",
          },
          {
            id: "html-multimedia-10",
            question:
              "Which element provides fallback content for unsupported media?",
            type: "multiple-choice",
            options: [
              "Content inside the media element",
              "<fallback>",
              "<alternative>",
              "<backup>",
            ],
            correct: 0,
            explanation:
              "Content placed inside video or audio elements serves as fallback for browsers that don't support the media.",
          },
          {
            id: "html-multimedia-11",
            question: 'What does the loading="lazy" attribute do for images?',
            type: "multiple-choice",
            options: [
              "Loads images slowly",
              "Defers loading until image is near viewport",
              "Reduces image quality",
              "Enables progressive loading",
            ],
            correct: 1,
            explanation:
              'loading="lazy" defers loading images until they are about to enter the viewport, improving page performance.',
          },
          {
            id: "html-multimedia-12",
            question:
              "Which track kind is used for subtitles in different languages?",
            type: "multiple-choice",
            options: ["captions", "subtitles", "descriptions", "chapters"],
            correct: 1,
            explanation:
              'kind="subtitles" is used for translations of dialogue in different languages.',
          },
        ],
      },
      {
        slug: "html-semantic-elements-quiz",
        title: "HTML5 Semantic Elements Quiz",
        tutorialSlug: "html-semantic-elements",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-semantic-1",
            question:
              "What is the main benefit of using semantic HTML elements?",
            type: "multiple-choice",
            options: [
              "They look better",
              "They provide meaning and structure for accessibility and SEO",
              "They load faster",
              "They are easier to style",
            ],
            correct: 1,
            explanation:
              "Semantic elements provide meaning that benefits screen readers, search engines, and code maintainability.",
          },
          {
            id: "html-semantic-2",
            question:
              "Which element represents the main content of a document?",
            type: "multiple-choice",
            options: ["<content>", "<main>", "<primary>", "<body>"],
            correct: 1,
            explanation:
              "<main> represents the main content of a document, excluding navigation, sidebars, and footers.",
          },
          {
            id: "html-semantic-3",
            question: "How many <main> elements should a page have?",
            type: "multiple-choice",
            options: [
              "As many as needed",
              "Exactly one",
              "At least two",
              "Zero or one",
            ],
            correct: 1,
            explanation:
              "A page should have exactly one <main> element representing the primary content.",
          },
          {
            id: "html-semantic-4",
            question:
              "Which element is used for content that is tangentially related?",
            type: "multiple-choice",
            options: ["<sidebar>", "<aside>", "<related>", "<secondary>"],
            correct: 1,
            explanation:
              "<aside> is used for content that is related but not central to the main content.",
          },
          {
            id: "html-semantic-5",
            question: "What does the <article> element represent?",
            type: "multiple-choice",
            options: [
              "Any text content",
              "Self-contained, reusable content",
              "News articles only",
              "The main page content",
            ],
            correct: 1,
            explanation:
              "<article> represents self-contained content that could be distributed independently.",
          },
          {
            id: "html-semantic-6",
            question:
              "Which element groups related content with a thematic purpose?",
            type: "multiple-choice",
            options: ["<group>", "<section>", "<theme>", "<division>"],
            correct: 1,
            explanation:
              "<section> groups related content that shares a common theme or purpose.",
          },
          {
            id: "html-semantic-7",
            question: "What is the purpose of the <nav> element?",
            type: "multiple-choice",
            options: [
              "To create any list of links",
              "To define major navigation sections",
              "To style navigation menus",
              "To create dropdown menus",
            ],
            correct: 1,
            explanation:
              "<nav> is for major navigation sections, not every group of links.",
          },
          {
            id: "html-semantic-8",
            question: "Which element represents contact information?",
            type: "multiple-choice",
            options: ["<contact>", "<address>", "<info>", "<details>"],
            correct: 1,
            explanation:
              "<address> provides contact information for its nearest ancestor <article> or document.",
          },
          {
            id: "html-semantic-9",
            question: "What does the <time> element represent?",
            type: "multiple-choice",
            options: [
              "Only clock times",
              "Dates and times in a machine-readable format",
              "Time zones",
              "Scheduling information",
            ],
            correct: 1,
            explanation:
              "<time> represents dates, times, or durations in a machine-readable format.",
          },
          {
            id: "html-semantic-10",
            question:
              "Which attribute is required for the <time> element to be machine-readable?",
            type: "multiple-choice",
            options: ["date", "datetime", "time", "value"],
            correct: 1,
            explanation:
              "The datetime attribute provides the machine-readable version of the time.",
          },
          {
            id: "html-semantic-11",
            question: "What is the difference between <header> and <h1>?",
            type: "multiple-choice",
            options: [
              "They are the same",
              "<header> is a container, <h1> is a heading level",
              "<header> is for titles, <h1> is for introductions",
              "<header> is semantic, <h1> is not",
            ],
            correct: 1,
            explanation:
              "<header> is a container for introductory content, while <h1> is specifically the top-level heading.",
          },
          {
            id: "html-semantic-12",
            question: "Can you have multiple <header> elements on a page?",
            type: "multiple-choice",
            options: [
              "No, only one per page",
              "Yes, but not recommended",
              "Yes, each section can have its own header",
              "Only if they have different classes",
            ],
            correct: 2,
            explanation:
              "You can have multiple <header> elements - for the page, articles, sections, etc.",
          },
        ],
      },
      {
        slug: "html-accessibility-quiz",
        title: "HTML Accessibility Quiz",

        tutorialSlug: "html-accessibility",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-accessibility-1",
            question:
              "What is the minimum color contrast ratio for normal text according to WCAG?",
            type: "multiple-choice",
            options: ["3:1", "4.5:1", "7:1", "2:1"],
            correct: 1,
            explanation:
              "WCAG requires a minimum contrast ratio of 4.5:1 for normal text to meet AA standards.",
          },
          {
            id: "html-accessibility-2",
            question: "What does ARIA stand for?",
            type: "multiple-choice",
            options: [
              "Accessible Rich Internet Applications",
              "Advanced Responsive Interface Architecture",
              "Automated Reader Interface Access",
              "Accessible Resource Integration API",
            ],
            correct: 0,
            explanation:
              "ARIA stands for Accessible Rich Internet Applications, a set of attributes to enhance HTML accessibility.",
          },
          {
            id: "html-accessibility-3",
            question:
              "Which ARIA attribute indicates whether a collapsible element is expanded?",
            type: "multiple-choice",
            options: [
              "aria-open",
              "aria-expanded",
              "aria-visible",
              "aria-state",
            ],
            correct: 1,
            explanation:
              "aria-expanded indicates whether a collapsible element is currently expanded (true) or collapsed (false).",
          },
          {
            id: "html-accessibility-4",
            question: "What is the purpose of the skip link?",
            type: "multiple-choice",
            options: [
              "To skip loading images",
              "To allow keyboard users to skip to main content",
              "To skip form validation",
              "To skip advertisements",
            ],
            correct: 1,
            explanation:
              "Skip links allow keyboard users to jump directly to the main content, bypassing navigation.",
          },
          {
            id: "html-accessibility-5",
            question:
              "Which attribute hides decorative content from screen readers?",
            type: "multiple-choice",
            options: [
              "hidden",
              'aria-hidden="true"',
              'role="presentation"',
              'display="none"',
            ],
            correct: 1,
            explanation:
              'aria-hidden="true" hides content from assistive technologies while keeping it visible.',
          },
          {
            id: "html-accessibility-6",
            question: 'What does the role="alert" do?',
            type: "multiple-choice",
            options: [
              "Creates a popup alert",
              "Announces important content changes immediately",
              "Adds error styling",
              "Validates form inputs",
            ],
            correct: 1,
            explanation:
              'role="alert" causes screen readers to announce the content immediately when it appears or changes.',
          },
          {
            id: "html-accessibility-7",
            question: "Which is the best way to create an accessible button?",
            type: "multiple-choice",
            options: [
              '<div onclick="submit()">Submit</div>',
              '<span role="button">Submit</span>',
              "<button>Submit</button>",
              '<a href="#" onclick="submit()">Submit</a>',
            ],
            correct: 2,
            explanation:
              "Native <button> elements are automatically accessible with proper keyboard handling and semantics.",
          },
          {
            id: "html-accessibility-8",
            question: "What does aria-label provide?",
            type: "multiple-choice",
            options: [
              "Visual labels for elements",
              "Accessible names for elements",
              "CSS styling labels",
              "Form validation labels",
            ],
            correct: 1,
            explanation:
              "aria-label provides an accessible name for elements when visible labels are not appropriate.",
          },
          {
            id: "html-accessibility-9",
            question: "Which heading structure is correct?",
            type: "multiple-choice",
            options: [
              "h1 → h3 → h2",
              "h1 → h2 → h4",
              "h1 → h2 → h3",
              "h2 → h1 → h3",
            ],
            correct: 2,
            explanation:
              "Headings should follow a logical hierarchy without skipping levels: h1, then h2, then h3, etc.",
          },
          {
            id: "html-accessibility-10",
            question: "What should alt text describe for a decorative image?",
            type: "multiple-choice",
            options: [
              "The image colors",
              "The image file name",
              'Nothing - use empty alt=""',
              "The image dimensions",
            ],
            correct: 2,
            explanation:
              'Decorative images should have empty alt text (alt="") so screen readers skip them.',
          },
          {
            id: "html-accessibility-11",
            question:
              "Which attribute identifies the element that describes another element?",
            type: "multiple-choice",
            options: [
              "aria-label",
              "aria-describedby",
              "aria-labelledby",
              "aria-details",
            ],
            correct: 1,
            explanation:
              "aria-describedby references elements that provide additional descriptive text.",
          },
          {
            id: "html-accessibility-12",
            question: "What is the purpose of the lang attribute?",
            type: "multiple-choice",
            options: [
              "To set the programming language",
              "To specify the natural language of content",
              "To set the location",
              "To define language preferences",
            ],
            correct: 1,
            explanation:
              "The lang attribute specifies the natural language of content, helping screen readers pronounce text correctly.",
          },
          {
            id: "html-accessibility-13",
            question: "Which is better for form accessibility?",
            type: "multiple-choice",
            options: [
              "Placeholder text only",
              "Label elements properly associated with inputs",
              "Title attributes on inputs",
              "ARIA labels on every element",
            ],
            correct: 1,
            explanation:
              "Proper label elements provide the best accessibility and user experience for forms.",
          },
          {
            id: "html-accessibility-14",
            question: 'What does aria-live="polite" do?',
            type: "multiple-choice",
            options: [
              "Makes content more polite",
              "Announces changes when screen reader is idle",
              "Reduces volume of announcements",
              "Delays all announcements",
            ],
            correct: 1,
            explanation:
              'aria-live="polite" announces content changes when the screen reader finishes current announcements.',
          },
          {
            id: "html-accessibility-15",
            question:
              "Which keyboard key typically activates buttons and links?",
            type: "multiple-choice",
            options: ["Tab", "Enter/Space", "Arrow keys", "Escape"],
            correct: 1,
            explanation:
              "Enter and Space keys activate buttons and links, while Tab navigates between focusable elements.",
          },
        ],
      },
    ];

    // Create quizzes
    for (const quiz of htmlQuizzes) {
      // Find the tutorial this quiz belongs to
      const tutorial = await prisma.tutorial.findUnique({
        where: { slug: quiz.tutorialSlug },
      });

      if (!tutorial) {
        console.warn(`⚠️ Tutorial not found for quiz: ${quiz.slug}`);
        continue;
      }

      const { tutorialSlug, ...quizData } = quiz;
      const createdQuiz = await prisma.quiz.upsert({
        where: { slug: quiz.slug },
        update: {
          title: quizData.title,
          questions: quizData.questions,
          isPremium: quizData.isPremium,
          requiredPlan: quizData.requiredPlan,
        },
        create: {
          ...quizData,
          tutorialId: tutorial.id,
        },
      });

      console.log(`✅ Created/updated quiz: ${createdQuiz.title}`);
    }

    console.log("🎉 HTML tutorials and quizzes seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding HTML tutorials:", error);
    throw error;
  }
}

seedHtmlTutorials();

export default seedHtmlTutorials;
