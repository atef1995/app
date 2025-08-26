import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedHtmlTutorials() {
  console.log("🌐 Seeding HTML tutorials...");

  try {
    // HTML Tutorials
    const htmlTutorials = [
      {
        slug: "html-basics",
        title: "HTML Fundamentals: Building Your First Web Page",
        description:
          "Learn the essential HTML elements and structure to create your first web page",
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
        difficulty: 1,
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
        difficulty: 1,
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
        difficulty: 2,
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
        difficulty: 2,
        order: 5,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        slug: "html-tables-data",
        title: "HTML Tables: Organizing and Displaying Data",
        description:
          "Master HTML tables to effectively organize, display, and make data accessible with proper structure and semantic markup",
        mdxFile: "html/06-html-tables-data",
        category: "html",
        estimatedTime: 50.0,
        difficulty: 1,
        order: 6,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        slug: "html-links-navigation",
        title: "HTML Links and Navigation: Connecting the Web",
        description:
          "Master HTML links, navigation patterns, and create intuitive user experiences with proper anchor tags and navigation structures",
        mdxFile: "html/07-html-links-navigation",
        category: "html",
        estimatedTime: 55.0,
        difficulty: 1,
        order: 7,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        slug: "html-lists-organization",
        title: "HTML Lists: Organizing Content Effectively",
        description:
          "Master HTML lists to structure information clearly with ordered lists, unordered lists, and definition lists for better content organization",
        mdxFile: "html/08-html-lists-organization",
        category: "html",
        estimatedTime: 40.0,
        difficulty: 1,
        order: 8,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        slug: "html-document-head",
        title: "HTML Document Head: SEO and Meta Information",
        description:
          "Master the HTML head section with meta tags, SEO optimization, social media integration, and performance enhancements for better web presence",
        mdxFile: "html/09-html-document-head",
        category: "html",
        estimatedTime: 60.0,
        difficulty: 2,
        order: 9,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        slug: "html-responsive-basics",
        title: "HTML Responsive Design Basics: Mobile-First Web Development",
        description:
          "Learn responsive design fundamentals with HTML and CSS, including viewport configuration, flexible layouts, and mobile-first development principles",
        mdxFile: "html/10-html-responsive-basics",
        category: "html",
        estimatedTime: 65.0,
        difficulty: 2,
        order: 10,
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
      {
        slug: "html-tables-data-quiz",
        title: "HTML Tables Quiz",
        tutorialSlug: "html-tables-data",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-tables-1",
            question: "What is the main purpose of HTML tables?",
            type: "multiple-choice",
            options: [
              "To create page layouts",
              "To display tabular data",
              "To style content",
              "To create navigation menus",
            ],
            correct: 1,
            explanation:
              "HTML tables should be used for displaying tabular data, not for layout purposes.",
          },
          {
            id: "html-tables-2", 
            question: "Which element represents a table header cell?",
            type: "multiple-choice",
            options: ["<td>", "<th>", "<header>", "<head>"],
            correct: 1,
            explanation:
              "<th> represents table header cells, which are typically bold and centered by default.",
          },
          {
            id: "html-tables-3",
            question: "What does the colspan attribute do?",
            type: "multiple-choice",
            options: [
              "Colors a column",
              "Makes a cell span multiple columns",
              "Counts columns",
              "Creates a new column",
            ],
            correct: 1,
            explanation:
              "The colspan attribute makes a cell span across multiple columns.",
          },
          {
            id: "html-tables-4",
            question: "Which element groups table body rows?",
            type: "multiple-choice",
            options: ["<tbody>", "<body>", "<tgroup>", "<rows>"],
            correct: 0,
            explanation:
              "<tbody> groups the body rows of a table, separate from header and footer.",
          },
          {
            id: "html-tables-5",
            question: "What is the purpose of the <caption> element?",
            type: "multiple-choice",
            options: [
              "To add a border",
              "To provide a table title or description",
              "To create columns",
              "To style the table",
            ],
            correct: 1,
            explanation:
              "The <caption> element provides a title or description for the table.",
          },
          {
            id: "html-tables-6",
            question: 'What does scope="col" indicate?',
            type: "multiple-choice",
            options: [
              "The header applies to the column",
              "The header applies to the row", 
              "The header has column styling",
              "The header spans columns",
            ],
            correct: 0,
            explanation:
              'scope="col" indicates that a header cell applies to the entire column.',
          },
          {
            id: "html-tables-7",
            question: "Which is better for table accessibility?",
            type: "multiple-choice",
            options: [
              "Using div elements",
              "Proper semantic table elements with headers",
              "Only CSS styling",
              "JavaScript interactions",
            ],
            correct: 1,
            explanation:
              "Using proper semantic table elements with appropriate headers provides the best accessibility.",
          },
          {
            id: "html-tables-8", 
            question: "What does the rowspan attribute do?",
            type: "multiple-choice",
            options: [
              "Spans across rows",
              "Counts rows", 
              "Creates new rows",
              "Styles rows",
            ],
            correct: 0,
            explanation:
              "The rowspan attribute makes a cell span vertically across multiple rows.",
          },
          {
            id: "html-tables-9",
            question: "Which element contains table footer content?",
            type: "multiple-choice",
            options: ["<tfooter>", "<tfoot>", "<footer>", "<bottom>"],
            correct: 1,
            explanation:
              "<tfoot> contains footer rows that typically show summaries or totals.",
          },
          {
            id: "html-tables-10",
            question: "What makes tables responsive on mobile?",
            type: "multiple-choice",
            options: [
              "Making them smaller",
              "CSS techniques like horizontal scrolling or stacking",
              "Removing columns",
              "Using JavaScript",
            ],
            correct: 1,
            explanation:
              "CSS techniques like overflow scrolling or transforming tables into cards make them mobile-friendly.",
          },
          {
            id: "html-tables-11",
            question: "Which is NOT appropriate for tables?",
            type: "multiple-choice",
            options: [
              "Financial data",
              "Schedules",
              "Page layout structure",
              "Product comparisons",
            ],
            correct: 2,
            explanation:
              "Tables should never be used for page layout - use CSS Grid or Flexbox instead.",
          },
          {
            id: "html-tables-12",
            question: "What should complex tables include for accessibility?",
            type: "multiple-choice",
            options: [
              "More colors",
              "Proper headers with id and headers attributes",
              "Larger fonts",
              "More borders",
            ],
            correct: 1,
            explanation:
              "Complex tables should use id and headers attributes to clearly associate data cells with their headers.",
          },
        ],
      },
      {
        slug: "html-links-navigation-quiz",
        title: "HTML Links and Navigation Quiz", 
        tutorialSlug: "html-links-navigation",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-links-1",
            question: "Which attribute specifies the destination of a link?",
            type: "multiple-choice",
            options: ["src", "href", "link", "to"],
            correct: 1,
            explanation:
              "The href attribute specifies the URL or destination of a hyperlink.",
          },
          {
            id: "html-links-2",
            question: "What does target=\"_blank\" do?",
            type: "multiple-choice",
            options: [
              "Blanks the current page",
              "Opens link in new window/tab",
              "Clears the link",
              "Hides the link",
            ],
            correct: 1,
            explanation:
              'target="_blank" opens the linked document in a new window or tab.',
          },
          {
            id: "html-links-3",
            question: "Why should you use rel=\"noopener\" with target=\"_blank\"?",
            type: "multiple-choice",
            options: [
              "For better SEO",
              "To prevent security vulnerabilities",
              "To improve styling",
              "To make links faster",
            ],
            correct: 1,
            explanation:
              'rel="noopener" prevents security vulnerabilities and performance issues when opening new windows.',
          },
          {
            id: "html-links-4",
            question: "How do you link to a section within the same page?",
            type: "multiple-choice",
            options: [
              'href="#sectionid"',
              'href="sectionid"',
              'href="/sectionid"',
              'href="section#id"',
            ],
            correct: 0,
            explanation:
              'Use href="#id" where id matches the id attribute of the target element.',
          },
          {
            id: "html-links-5",
            question: "What is the correct format for an email link?",
            type: "multiple-choice",
            options: [
              'href="email:user@domain.com"',
              'href="mailto:user@domain.com"',
              'href="mail:user@domain.com"',
              'href="@user@domain.com"',
            ],
            correct: 1,
            explanation:
              'href="mailto:email" creates a link that opens the user\'s email client.',
          },
          {
            id: "html-links-6",
            question: "Which creates a phone number link?",
            type: "multiple-choice",
            options: [
              'href="phone:123-456-7890"',
              'href="call:123-456-7890"',
              'href="tel:123-456-7890"',
              'href="number:123-456-7890"',
            ],
            correct: 2,
            explanation:
              'href="tel:number" creates a link that can dial the phone number on mobile devices.',
          },
          {
            id: "html-links-7",
            question: "What makes a good navigation structure?",
            type: "multiple-choice",
            options: [
              "Lots of colors",
              "Semantic HTML with proper roles and labels",
              "Complex animations",
              "Many nested levels",
            ],
            correct: 1,
            explanation:
              "Good navigation uses semantic HTML, proper ARIA labels, and clear hierarchy.",
          },
          {
            id: "html-links-8",
            question: "What are skip links for?",
            type: "multiple-choice",
            options: [
              "Skipping animations",
              "Allowing keyboard users to skip to main content",
              "Skipping broken links",
              "Bypassing login",
            ],
            correct: 1,
            explanation:
              "Skip links help keyboard users jump directly to main content, bypassing navigation.",
          },
          {
            id: "html-links-9",
            question: "Which is better for link accessibility?",
            type: "multiple-choice",
            options: [
              "Click here",
              "Read more", 
              "Download the 2024 Annual Report PDF",
              "Link",
            ],
            correct: 2,
            explanation:
              "Descriptive link text that makes sense out of context is best for accessibility.",
          },
          {
            id: "html-links-10",
            question: "What does the download attribute do?",
            type: "multiple-choice",
            options: [
              "Downloads faster",
              "Forces download instead of navigation", 
              "Downloads in background",
              "Compresses downloads",
            ],
            correct: 1,
            explanation:
              "The download attribute forces the browser to download the file instead of navigating to it.",
          },
          {
            id: "html-links-11",
            question: "Which navigation pattern is best for mobile?",
            type: "multiple-choice",
            options: [
              "Always horizontal menus",
              "Hamburger menu with collapsible navigation",
              "Very small text links",
              "No navigation",
            ],
            correct: 1,
            explanation:
              "Hamburger menus with collapsible navigation work well for mobile's limited screen space.",
          },
          {
            id: "html-links-12",
            question: "What should breadcrumb navigation show?",
            type: "multiple-choice",
            options: [
              "All website pages",
              "The user's path through the site hierarchy",
              "Popular pages only",
              "Random pages",
            ],
            correct: 1,
            explanation:
              "Breadcrumbs should show the user's current location in the site hierarchy.",
          },
          {
            id: "html-links-13",
            question: "How do you indicate the current page in navigation?",
            type: "multiple-choice",
            options: [
              'class="current"',
              'aria-current="page"',
              'id="current"',
              'current="true"',
            ],
            correct: 1,
            explanation:
              'aria-current="page" is the proper way to indicate the current page for screen readers.',
          },
          {
            id: "html-links-14",
            question: "What makes links touch-friendly on mobile?",
            type: "multiple-choice",
            options: [
              "Bright colors",
              "Minimum 44px touch targets",
              "Animations",
              "Icons only",
            ],
            correct: 1,
            explanation:
              "Touch targets should be at least 44px to be easily tappable on mobile devices.",
          },
          {
            id: "html-links-15",
            question: "Which is best for external links?",
            type: "multiple-choice",
            options: [
              "No indication",
              "Different color only",
              'target="_blank" with visual indicator',
              "JavaScript popup",
            ],
            correct: 2,
            explanation:
              "External links should open in new tabs and have visual indicators so users know what to expect.",
          },
        ],
      },
      {
        slug: "html-lists-organization-quiz",
        title: "HTML Lists Quiz",
        tutorialSlug: "html-lists-organization", 
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-lists-1",
            question: "Which element creates an unordered list?",
            type: "multiple-choice", 
            options: ["<ol>", "<ul>", "<list>", "<unordered>"],
            correct: 1,
            explanation:
              "<ul> creates unordered lists with bullet points, while <ol> creates ordered lists with numbers.",
          },
          {
            id: "html-lists-2",
            question: "What's the difference between <ol> and <ul>?",
            type: "multiple-choice",
            options: [
              "No difference",
              "<ol> is for numbered lists, <ul> is for bulleted lists",
              "<ol> is older than <ul>",
              "<ol> is for text, <ul> is for links",
            ],
            correct: 1,
            explanation:
              "<ol> creates ordered (numbered) lists while <ul> creates unordered (bulleted) lists.",
          },
          {
            id: "html-lists-3", 
            question: "Which element represents individual list items?",
            type: "multiple-choice",
            options: ["<item>", "<li>", "<list-item>", "<point>"],
            correct: 1,
            explanation:
              "<li> (list item) is used for individual items within both ordered and unordered lists.",
          },
          {
            id: "html-lists-4",
            question: "What does the start attribute do in ordered lists?",
            type: "multiple-choice",
            options: [
              "Starts the list",
              "Sets the starting number",
              "Starts at the top",
              "Begins numbering",
            ],
            correct: 1,
            explanation:
              "The start attribute specifies the starting number for an ordered list.",
          },
          {
            id: "html-lists-5",
            question: "Which list type is best for step-by-step instructions?", 
            type: "multiple-choice",
            options: [
              "Unordered list",
              "Ordered list",
              "Definition list",
              "Table",
            ],
            correct: 1,
            explanation:
              "Ordered lists are perfect for step-by-step instructions because the sequence matters.",
          },
          {
            id: "html-lists-6",
            question: "What are definition lists used for?",
            type: "multiple-choice",
            options: [
              "Defining CSS styles",
              "Term-definition pairs like glossaries",
              "Defining functions",
              "List definitions only",
            ],
            correct: 1,
            explanation:
              "Definition lists (<dl>) are used for term-definition pairs like glossaries and FAQs.",
          },
          {
            id: "html-lists-7",
            question: "In a definition list, what does <dt> represent?",
            type: "multiple-choice",
            options: [
              "Data type",
              "Date time",
              "Definition term",
              "Document title",
            ],
            correct: 2,
            explanation:
              "<dt> (definition term) contains the term being defined in a definition list.",
          },
          {
            id: "html-lists-8",
            question: "What does <dd> represent in definition lists?",
            type: "multiple-choice",
            options: [
              "Due date",
              "Definition description",
              "Data description", 
              "Document details",
            ],
            correct: 1,
            explanation:
              "<dd> (definition description) contains the definition or description of the term.",
          },
          {
            id: "html-lists-9",
            question: "Can you nest lists inside other lists?",
            type: "multiple-choice",
            options: [
              "No, never",
              "Yes, to create hierarchical structures",
              "Only with JavaScript",
              "Only unordered lists",
            ],
            correct: 1,
            explanation:
              "Lists can be nested to create hierarchical structures with sub-items.",
          },
          {
            id: "html-lists-10",
            question: "What's the best use for navigation menus?",
            type: "multiple-choice", 
            options: [
              "Ordered lists",
              "Unordered lists",
              "Definition lists",
              "No lists",
            ],
            correct: 1,
            explanation:
              "Navigation menus should use unordered lists since menu order usually doesn't indicate sequence.",
          },
          {
            id: "html-lists-11",
            question: "Which attribute reverses the numbering in ordered lists?",
            type: "multiple-choice",
            options: ["reverse", "backwards", "desc", "opposite"],
            correct: 0,
            explanation:
              "The reversed attribute makes ordered lists count backwards (5, 4, 3, 2, 1).",
          },
          {
            id: "html-lists-12",
            question: "How should you style list markers?",
            type: "multiple-choice",
            options: [
              "HTML attributes only",
              "CSS list-style properties",
              "JavaScript",
              "Images only",
            ],
            correct: 1,
            explanation:
              "CSS list-style properties like list-style-type and list-style-image control list markers.",
          },
        ],
      },
      {
        slug: "html-document-head-quiz",
        title: "HTML Document Head Quiz",
        tutorialSlug: "html-document-head",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-head-1",
            question: "What must be the first element in the HTML head?",
            type: "multiple-choice",
            options: [
              "<title>",
              '<meta charset="UTF-8">',
              "<style>", 
              "<link>",
            ],
            correct: 1,
            explanation:
              "The charset declaration should be within the first 1024 bytes and is typically placed first.",
          },
          {
            id: "html-head-2",
            question: "What does the viewport meta tag control?",
            type: "multiple-choice",
            options: [
              "Page title",
              "How the page is displayed on mobile devices",
              "Page description",
              "Page language",
            ],
            correct: 1,
            explanation:
              "The viewport meta tag controls how web pages are displayed on mobile devices.",
          },
          {
            id: "html-head-3",
            question: "What is the recommended length for page titles?",
            type: "multiple-choice", 
            options: [
              "10-20 characters",
              "50-60 characters",
              "100+ characters",
              "No limit",
            ],
            correct: 1,
            explanation:
              "Page titles should be 50-60 characters to display properly in search results.",
          },
          {
            id: "html-head-4",
            question: "What does the meta description do?",
            type: "multiple-choice",
            options: [
              "Describes the HTML structure",
              "Appears in search engine results",
              "Defines page layout",
              "Controls page styling",
            ],
            correct: 1,
            explanation:
              "Meta descriptions appear in search engine results and should be 150-160 characters.",
          },
          {
            id: "html-head-5",
            question: "What is Open Graph used for?",
            type: "multiple-choice",
            options: [
              "Opening web pages",
              "Social media sharing previews",
              "Graph databases",
              "Chart creation",
            ],
            correct: 1,
            explanation:
              "Open Graph meta tags control how content appears when shared on social media.",
          },
          {
            id: "html-head-6",
            question: "Which link relation prevents duplicate content issues?",
            type: "multiple-choice",
            options: [
              'rel="duplicate"',
              'rel="canonical"',
              'rel="original"',
              'rel="unique"',
            ],
            correct: 1,
            explanation:
              'rel="canonical" specifies the preferred URL for content to prevent duplicate content issues.',
          },
          {
            id: "html-head-7",
            question: "What does dns-prefetch do?",
            type: "multiple-choice",
            options: [
              "Fetches DNS records",
              "Resolves domain names early to improve performance",
              "Prevents DNS lookup",
              "Caches domain names",
            ],
            correct: 1,
            explanation:
              "DNS prefetch resolves domain names early, reducing latency when loading external resources.",
          },
          {
            id: "html-head-8",
            question: "What's the purpose of the favicon?",
            type: "multiple-choice",
            options: [
              "Page decoration",
              "Icon shown in browser tabs and bookmarks",
              "Favorite page marker",
              "Image optimization",
            ],
            correct: 1,
            explanation:
              "Favicons are small icons displayed in browser tabs, bookmarks, and browser history.",
          },
          {
            id: "html-head-9",
            question: "Which Twitter Card type shows large images?",
            type: "multiple-choice",
            options: [
              "summary",
              "summary_large_image",
              "large_image",
              "photo",
            ],
            correct: 1,
            explanation:
              "summary_large_image Twitter Card type displays content with prominent large images.",
          },
          {
            id: "html-head-10", 
            question: "What does preload do for resources?",
            type: "multiple-choice",
            options: [
              "Loads resources after page load",
              "Loads critical resources early in page load",
              "Prevents resource loading",
              "Compresses resources",
            ],
            correct: 1,
            explanation:
              "Preload tells the browser to fetch critical resources early in the page load process.",
          },
          {
            id: "html-head-11",
            question: "What should the lang attribute specify?",
            type: "multiple-choice",
            options: [
              "Programming language",
              "Natural language of the content",
              "Server language",
              "Browser language",
            ],
            correct: 1,
            explanation:
              "The lang attribute specifies the natural language of the content for accessibility and SEO.",
          },
          {
            id: "html-head-12",
            question: "Which meta tag helps with security?",
            type: "multiple-choice",
            options: [
              "Content-Security-Policy",
              "security-level",
              "protection-mode",
              "safe-browsing",
            ],
            correct: 0,
            explanation:
              "Content-Security-Policy header helps prevent XSS attacks and other security vulnerabilities.",
          },
          {
            id: "html-head-13",
            question: "What does theme-color meta tag do?",
            type: "multiple-choice",
            options: [
              "Sets page background color",
              "Colors the browser UI on mobile devices",
              "Defines CSS theme",
              "Sets text color",
            ],
            correct: 1,
            explanation:
              "theme-color sets the color of browser UI elements like the address bar on mobile devices.",
          },
          {
            id: "html-head-14",
            question: "Why include structured data in the head?",
            type: "multiple-choice",
            options: [
              "For styling purposes",
              "To help search engines understand content",
              "For faster loading",
              "For mobile compatibility",
            ],
            correct: 1,
            explanation:
              "Structured data helps search engines understand and display your content in rich results.",
          },
          {
            id: "html-head-15",
            question: "What happens if you don't include a viewport meta tag?",
            type: "multiple-choice",
            options: [
              "Page loads faster",
              "Mobile browsers use desktop layout",
              "Better SEO",
              "No difference",
            ],
            correct: 1,
            explanation:
              "Without a viewport tag, mobile browsers assume desktop layout and zoom out to fit.",
          },
          {
            id: "html-head-16",
            question: "Which is better for performance?",
            type: "multiple-choice",
            options: [
              "All CSS in external files",
              "Critical CSS inline, non-critical external",
              "All CSS inline",
              "No CSS in head",
            ],
            correct: 1,
            explanation:
              "Inlining critical CSS and loading non-critical CSS asynchronously provides the best performance.",
          },
          {
            id: "html-head-17",
            question: "What does the robots meta tag control?",
            type: "multiple-choice",
            options: [
              "Robot behavior on site",
              "Search engine crawling and indexing",
              "Automated testing",
              "Bot detection",
            ],
            correct: 1,
            explanation:
              "The robots meta tag tells search engines whether to index the page and follow links.",
          },
          {
            id: "html-head-18",
            question: "Which resource hint prefetches likely next pages?",
            type: "multiple-choice",
            options: [
              "preload",
              "prefetch", 
              "preconnect",
              "dns-prefetch",
            ],
            correct: 1,
            explanation:
              "prefetch loads resources that are likely to be needed for future navigations.",
          },
        ],
      },
      {
        slug: "html-responsive-basics-quiz",
        title: "HTML Responsive Design Quiz",
        tutorialSlug: "html-responsive-basics",
        isPremium: false,
        requiredPlan: "FREE",
        questions: [
          {
            id: "html-responsive-1",
            question: "What is responsive web design?",
            type: "multiple-choice",
            options: [
              "Design that responds to user clicks",
              "Web pages that adapt to different screen sizes",
              "Faster loading websites",
              "Interactive web applications",
            ],
            correct: 1,
            explanation:
              "Responsive design makes web pages render well on all devices by adapting to different screen sizes.",
          },
          {
            id: "html-responsive-2",
            question: "What does the viewport meta tag do?",
            type: "multiple-choice",
            options: [
              "Sets the page title",
              "Controls how pages display on mobile devices",
              "Adds responsive images",
              "Creates media queries",
            ],
            correct: 1,
            explanation:
              "The viewport meta tag controls the layout viewport on mobile browsers.",
          },
          {
            id: "html-responsive-3",
            question: "What is mobile-first design?",
            type: "multiple-choice", 
            options: [
              "Designing only for mobile",
              "Starting with mobile design, then enhancing for larger screens",
              "Making mobile versions first",
              "Testing on mobile devices first",
            ],
            correct: 1,
            explanation:
              "Mobile-first means designing for mobile devices first, then progressively enhancing for larger screens.",
          },
          {
            id: "html-responsive-4",
            question: "Which CSS unit is best for responsive typography?",
            type: "multiple-choice",
            options: [
              "px (pixels)",
              "pt (points)", 
              "em/rem",
              "cm (centimeters)",
            ],
            correct: 2,
            explanation:
              "em and rem units scale relative to font sizes, making typography more responsive.",
          },
          {
            id: "html-responsive-5",
            question: "What does the srcset attribute do for images?",
            type: "multiple-choice",
            options: [
              "Sets image source",
              "Provides multiple image sources for different conditions",
              "Sets image style",
              "Sources images from different servers",
            ],
            correct: 1,
            explanation:
              "srcset allows browsers to choose the best image source based on screen size and resolution.",
          },
          {
            id: "html-responsive-6",
            question: "What is the minimum touch target size for mobile?",
            type: "multiple-choice",
            options: [
              "24px",
              "32px",
              "44px",
              "64px",
            ],
            correct: 2,
            explanation:
              "Touch targets should be at least 44px to be easily tappable with fingers.",
          },
          {
            id: "html-responsive-7",
            question: "Which approach is best for responsive tables?",
            type: "multiple-choice",
            options: [
              "Always horizontal scrolling",
              "CSS techniques like horizontal scroll or card transformation",
              "Removing columns",
              "Making text smaller",
            ],
            correct: 1,
            explanation:
              "Different CSS techniques like horizontal scrolling or transforming to cards work for different table types.",
          },
          {
            id: "html-responsive-8", 
            question: "What does CSS Grid's auto-fit do?",
            type: "multiple-choice",
            options: [
              "Automatically fits content",
              "Creates responsive columns that collapse when too narrow",
              "Fits grid to screen",
              "Auto-sizes grid items",
            ],
            correct: 1,
            explanation:
              "auto-fit creates responsive columns that collapse into fewer columns on smaller screens.",
          },
          {
            id: "html-responsive-9",
            question: "Which meta attribute prevents zooming?",
            type: "multiple-choice",
            options: [
              'initial-scale=1.0',
              'user-scalable=no',
              'maximum-scale=1.0',
              'zoom=disabled',
            ],
            correct: 1,
            explanation:
              'user-scalable=no prevents zooming, but this hurts accessibility and should be avoided.',
          },
          {
            id: "html-responsive-10",
            question: "What is a breakpoint in responsive design?",
            type: "multiple-choice",
            options: [
              "Where the code breaks",
              "Specific screen widths where layout changes",
              "Page loading points",
              "User interaction points",
            ],
            correct: 1,
            explanation:
              "Breakpoints are specific screen widths where the layout adapts using media queries.",
          },
          {
            id: "html-responsive-11",
            question: "Which is better for responsive images?",
            type: "multiple-choice",
            options: [
              "Fixed width and height",
              'max-width: 100%; height: auto;',
              "Always full width",
              "Fixed aspect ratios only",
            ],
            correct: 1,
            explanation:
              'max-width: 100% and height: auto make images scale down while maintaining aspect ratio.',
          },
          {
            id: "html-responsive-12",
            question: "What does CSS clamp() do for responsive design?",
            type: "multiple-choice",
            options: [
              "Clamps elements together",
              "Provides fluid sizing with minimum and maximum values",
              "Fixes element positions",
              "Prevents content overflow",
            ],
            correct: 1,
            explanation:
              "clamp() allows fluid sizing between minimum and maximum values, perfect for responsive typography.",
          },
          {
            id: "html-responsive-13",
            question: "How should navigation work on mobile?",
            type: "multiple-choice",
            options: [
              "Same as desktop",
              "Collapsible menu with touch-friendly targets",
              "No navigation",
              "Only icons",
            ],
            correct: 1,
            explanation:
              "Mobile navigation should collapse to save space and have touch-friendly target sizes.",
          },
          {
            id: "html-responsive-14",
            question: "What does the picture element provide?",
            type: "multiple-choice",
            options: [
              "Better image quality",
              "Art direction and different images for different conditions", 
              "Faster image loading",
              "Image compression",
            ],
            correct: 1,
            explanation:
              "The picture element allows art direction by providing different images for different screen conditions.",
          },
          {
            id: "html-responsive-15",
            question: "Which CSS layout method is best for responsive design?",
            type: "multiple-choice",
            options: [
              "Tables",
              "Floats",
              "Flexbox and CSS Grid",
              "Absolute positioning",
            ],
            correct: 2,
            explanation:
              "Flexbox and CSS Grid provide the most flexible and powerful tools for responsive layouts.",
          },
          {
            id: "html-responsive-16",
            question: "Why test on real devices?",
            type: "multiple-choice",
            options: [
              "Browser dev tools are perfect",
              "Real devices show actual performance and interaction",
              "It's required by law",
              "Virtual testing is impossible",
            ],
            correct: 1,
            explanation:
              "Real devices reveal performance issues, touch interactions, and actual user experience that simulators miss.",
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
