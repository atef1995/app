import { PrismaClient } from "@prisma/client";
import { seedGithubCategory } from "./seedCategory";

const prisma = new PrismaClient();

const GITHUB_TUTORIALS = [
  // GITHUB CATEGORY - Tutorial 1
  {
    slug: "what-is-github",
    title: "What is GitHub? Version Control for Beginners",
    description:
      "Discover GitHub and version control - the essential tools every developer needs to manage and collaborate on code",
    mdxFile: "github/01-what-is-github",
    category: "github",
    difficulty: 1,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "GitHub Fundamentals Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question: "What is the primary difference between Git and GitHub?",
          options: [
            "Git is newer than GitHub",
            "Git is the version control system, GitHub is the hosting platform",
            "GitHub is faster than Git",
            "They are exactly the same thing",
          ],
          correct: 1,
          explanation:
            "Git is the version control system that runs locally on your computer, while GitHub is a cloud-based platform that hosts Git repositories and adds collaboration features.",
        },
        {
          question: "What is version control best compared to?",
          options: [
            "A backup system",
            "Save points in a video game",
            "A file sharing service",
            "An online storage drive",
          ],
          correct: 1,
          explanation:
            "Version control is like save points in a video game - you can create checkpoints and return to any previous state if something goes wrong.",
        },
        {
          question: "What is a repository in GitHub?",
          options: [
            "A storage location for project files and their version history",
            "A type of programming language",
            "A user's profile page",
            "A backup folder",
          ],
          correct: 0,
          explanation:
            "A repository (or 'repo') is a storage location where your project files live, along with the complete history of all changes made to those files.",
        },
        {
          question: "What does a 'commit' represent in version control?",
          options: [
            "A promise to finish the project",
            "A saved checkpoint with a description of changes",
            "Uploading files to the internet",
            "Deleting old versions of files",
          ],
          correct: 1,
          explanation:
            "A commit is like a snapshot or save point that captures the state of your project at a specific moment, with a message describing what changed.",
        },
        {
          question: "Why is GitHub particularly valuable for developers?",
          options: [
            "It makes code run faster",
            "It automatically fixes bugs",
            "It enables collaboration and serves as a portfolio",
            "It only works with JavaScript",
          ],
          correct: 2,
          explanation:
            "GitHub enables seamless collaboration between developers and serves as a professional portfolio where employers can see your coding skills and projects.",
        },
        {
          question: "What was the main problem before version control systems?",
          options: [
            "Code was too slow",
            "Developers emailed files and manually merged changes",
            "Programming languages didn't exist",
            "Computers were too expensive",
          ],
          correct: 1,
          explanation:
            "Before version control, developers had to email ZIP files back and forth and manually merge different people's changes, which was chaotic and error-prone.",
        },
        {
          question: "What makes GitHub different from just using Git locally?",
          options: [
            "GitHub is faster",
            "GitHub adds cloud storage, collaboration tools, and social features",
            "GitHub works with more programming languages",
            "GitHub is free while Git costs money",
          ],
          correct: 1,
          explanation:
            "While Git handles version control locally, GitHub adds cloud storage, issue tracking, pull requests, project management, and social coding features.",
        },
        {
          question: "What is open source software?",
          options: [
            "Software that costs money",
            "Software with publicly available source code that anyone can contribute to",
            "Software that only works on certain computers",
            "Software that's no longer maintained",
          ],
          correct: 1,
          explanation:
            "Open source software has publicly available source code, allowing developers worldwide to view, modify, and contribute to projects.",
        },
        {
          question: "How does GitHub serve as a developer portfolio?",
          options: [
            "It automatically creates a resume",
            "It shows your projects, contributions, and coding activity to potential employers",
            "It charges employers to see your work",
            "It only shows your best code",
          ],
          correct: 1,
          explanation:
            "GitHub profiles showcase your repositories, contributions to open source, coding frequency, and skill level - serving as a living portfolio for employers.",
        },
        {
          question:
            "What is the biggest benefit of collaborative coding on GitHub?",
          options: [
            "It makes individual developers work faster",
            "Multiple people can work on the same project without conflicts",
            "It automatically writes code for you",
            "It prevents all bugs from occurring",
          ],
          correct: 1,
          explanation:
            "GitHub's collaboration features allow multiple developers to work on the same project simultaneously while managing changes, conflicts, and contributions systematically.",
        },
        {
          question:
            "Why don't developers use tools like email or Dropbox for code collaboration?",
          options: [
            "They're too expensive",
            "They don't track changes, merge conflicts, or provide version history",
            "They're too complicated",
            "They only work with certain file types",
          ],
          correct: 1,
          explanation:
            "General file sharing tools lack version control features like change tracking, conflict resolution, branching, and detailed history that code collaboration requires.",
        },
        {
          question: "What does it mean that JavaScript is 'dynamically typed'?",
          options: [
            "Variables can hold different types of data and change types during execution",
            "JavaScript types data faster than other languages",
            "You must declare variable types explicitly",
            "JavaScript only works with dynamic websites",
          ],
          correct: 0,
          explanation:
            "Dynamic typing means variables can hold different data types and can change types during program execution, without explicit type declarations.",
        },
        {
          question:
            "According to the tutorial, how many developers use GitHub worldwide?",
          options: [
            "Over 100 million",
            "About 10 million",
            "Over 73 million",
            "Exactly 50 million",
          ],
          correct: 2,
          explanation:
            "GitHub hosts over 100 million repositories from 73 million developers worldwide, making it the largest collaborative coding community.",
        },
        {
          question: "What is the most important mindset for learning GitHub?",
          options: [
            "You need to be an expert programmer first",
            "Start simple and gradually learn more features as you grow",
            "Learn everything at once before starting",
            "Only advanced developers should use GitHub",
          ],
          correct: 1,
          explanation:
            "The tutorial emphasizes starting with basics and gradually discovering more features as you grow - like learning to drive a car step by step.",
        },
        {
          question: "What will you learn in the next tutorial?",
          options: [
            "Advanced Git commands",
            "How to create your first GitHub repository and make your first commit",
            "How to contribute to open source projects",
            "How to use GitHub for project management",
          ],
          correct: 1,
          explanation:
            "The next tutorial focuses on hands-on practice: creating your first GitHub repository, setting up your profile, and making your first commit.",
        },
      ],
    },
  },
  // GITHUB CATEGORY - Tutorial 2
  {
    slug: "github-setup-first-repo",
    title: "Your First GitHub Repository",
    description:
      "Create your GitHub account, set up your first repository, and make your debut in the world's largest coding community",
    mdxFile: "github/02-github-setup-first-repo",
    category: "github",
    difficulty: 1,
    order: 2,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "GitHub Repository Setup Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question: "What makes a good GitHub username?",
          options: [
            "Use lots of numbers and special characters",
            "Keep it professional, memorable, and easy to spell",
            "Use your full name with birth year",
            "Make it as short as possible",
          ],
          correct: 1,
          explanation:
            "A good GitHub username should be professional, memorable, and easy to spell since it becomes part of your developer identity and appears on all your work.",
        },
        {
          question:
            "What is special about naming a repository 'username.github.io'?",
          options: [
            "It creates a private repository",
            "It automatically creates a free website",
            "It makes the repository load faster",
            "It adds extra security features",
          ],
          correct: 1,
          explanation:
            "The special naming convention 'username.github.io' automatically creates a free GitHub Pages website that you can access at that URL.",
        },
        {
          question:
            "Why should you always add a README file to your repository?",
          options: [
            "It's required by GitHub",
            "It makes your repository load faster",
            "It's the first thing people see and explains what your project is about",
            "It automatically generates documentation",
          ],
          correct: 2,
          explanation:
            "A README file is like the front door of your project - it's the first thing visitors see and should explain what your project does, how to use it, and why it matters.",
        },
        {
          question: "What does a .gitignore file do?",
          options: [
            "Deletes unwanted files",
            "Tells Git which files to ignore and not track",
            "Hides your repository from search",
            "Creates backup copies of files",
          ],
          correct: 1,
          explanation:
            "A .gitignore file tells Git which files and folders to ignore, like temporary files, passwords, or system files that shouldn't be tracked in version control.",
        },
        {
          question:
            "Which license is recommended for beginners and open source projects?",
          options: ["No license", "MIT License", "GNU GPL", "Creative Commons"],
          correct: 1,
          explanation:
            "MIT License is beginner-friendly and widely used. It basically says 'use this code, just give me credit' and is simple to understand and apply.",
        },
        {
          question: "What makes a good commit message?",
          options: [
            "Short and vague like 'update stuff'",
            "Clear description of what changed and why",
            "Just the file names that changed",
            "As long as possible with every detail",
          ],
          correct: 1,
          explanation:
            "A good commit message clearly describes what changed and why, helping future you and collaborators understand the project's evolution.",
        },
        {
          question:
            "When should you choose 'Public' vs 'Private' for a beginner portfolio repository?",
          options: [
            "Always choose Private for security",
            "Choose Public to showcase your work",
            "It doesn't matter",
            "Private is faster",
          ],
          correct: 1,
          explanation:
            "For portfolio repositories, choose Public so potential employers, collaborators, and the community can see your work and progress.",
        },
        {
          question:
            "What's the most important thing about your first repository?",
          options: [
            "It must be perfect before publishing",
            "It should use the latest technologies",
            "It needs to exist and show your learning journey",
            "It must solve a complex problem",
          ],
          correct: 2,
          explanation:
            "Your first repository doesn't need to be perfect - it needs to exist and demonstrate your learning. You can always improve it over time.",
        },
        {
          question:
            "How often should you update your GitHub profile and repositories?",
          options: [
            "Only when you have something major to add",
            "Every day without fail",
            "Regularly and consistently, even with small improvements",
            "Once a year",
          ],
          correct: 2,
          explanation:
            "Regular, consistent activity (even small improvements) shows you're actively learning and engaged, which is more impressive than sporadic major updates.",
        },
        {
          question: "What should you include in a personal portfolio README?",
          options: [
            "Only your finished projects",
            "Your learning journey, current projects, and how to contact you",
            "Just your contact information",
            "Your resume in full detail",
          ],
          correct: 1,
          explanation:
            "A great portfolio README shows your learning journey, current projects, technologies you're exploring, and ways to contact you - it tells your story as a developer.",
        },
        {
          question:
            "What's the best approach to making your first open source contribution?",
          options: [
            "Start with complex features",
            "Look for 'good-first-issue' labels and small improvements",
            "Only contribute to major projects",
            "Wait until you're an expert",
          ],
          correct: 1,
          explanation:
            "Start small with issues labeled 'good-first-issue', 'beginner-friendly', or simple documentation improvements to learn the contribution process.",
        },
        {
          question:
            "If your GitHub Pages site doesn't appear immediately, what should you do?",
          options: [
            "Delete and recreate the repository",
            "Contact GitHub support",
            "Wait a few minutes as GitHub Pages takes time to update",
            "Change your repository to Private",
          ],
          correct: 2,
          explanation:
            "GitHub Pages can take a few minutes to build and deploy your site. Be patient and check that your repository is named correctly and has an index.html file.",
        },
        {
          question:
            "What's the main benefit of having a professional GitHub profile?",
          options: [
            "It makes your code run faster",
            "It serves as a living portfolio that employers can review",
            "It automatically gets you job offers",
            "It protects your code from being copied",
          ],
          correct: 1,
          explanation:
            "A professional GitHub profile serves as a living portfolio where employers can see your actual code, contribution patterns, and growth as a developer.",
        },
        {
          question:
            "What should you do if you make a typo in a commit message?",
          options: [
            "Delete the entire repository",
            "Don't worry about it, just make better messages going forward",
            "Try to edit it immediately",
            "Make an angry commit about the typo",
          ],
          correct: 1,
          explanation:
            "Typos in commit messages aren't the end of the world. Focus on making better messages going forward rather than trying to fix past mistakes.",
        },
        {
          question: "What's the key to long-term GitHub success?",
          options: [
            "Making perfect commits every time",
            "Only working on large, impressive projects",
            "Consistent activity and continuous learning",
            "Having the most followers",
          ],
          correct: 2,
          explanation:
            "GitHub success comes from consistent activity, continuous learning, and regular contributions - even small ones matter more than sporadic perfection.",
        },
        {
          question:
            "Why should beginners avoid perfectionism when starting with GitHub?",
          options: [
            "Perfect code is not allowed on GitHub",
            "It prevents you from getting started and learning through practice",
            "GitHub charges more for perfect repositories",
            "Other developers don't like perfect code",
          ],
          correct: 1,
          explanation:
            "Perfectionism can paralyze beginners from starting. It's better to begin with imperfect code and improve over time than to never start at all.",
        },
        {
          question:
            "What's the most important thing to remember about your GitHub journey?",
          options: [
            "You must become an expert immediately",
            "Every expert was once a beginner who made their first commit",
            "Only computer science graduates can succeed",
            "You need expensive tools to contribute",
          ],
          correct: 1,
          explanation:
            "Every expert developer started with their first commit. GitHub is about growth and learning, not about being perfect from day one.",
        },
        {
          question: "What will you learn in the next GitHub tutorial?",
          options: [
            "How to delete repositories",
            "Essential Git commands for daily development work",
            "How to become a GitHub administrator",
            "Advanced security features",
          ],
          correct: 1,
          explanation:
            "The next tutorial will cover essential Git commands that developers use every day to manage their code and collaborate with others.",
        },
      ],
    },
  },
  // GITHUB CATEGORY - Tutorial 3
  {
    slug: "basic-git-commands",
    title: "Essential Git Commands Every Developer Needs",
    description:
      "Master the fundamental Git commands that every developer uses daily - clone, add, commit, push, pull, status, and more",
    mdxFile: "github/03-basic-git-commands",
    category: "github",
    difficulty: 1,
    order: 3,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "Essential Git Commands Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question:
            "Why is learning command line Git important for developers?",
          options: [
            "It's just for advanced developers",
            "It's faster, more powerful, and works everywhere",
            "GitHub's web interface is always better",
            "Command line is only needed for servers",
          ],
          correct: 1,
          explanation:
            "Command line Git is faster, gives you access to Git's full power, works everywhere, and is the standard way professional developers work with code.",
        },
        {
          question: "What does the 'git clone' command do?",
          options: [
            "Creates a copy of a file",
            "Downloads a repository with full history and sets up local development",
            "Makes a backup of your code",
            "Copies code to GitHub",
          ],
          correct: 1,
          explanation:
            "Git clone downloads the entire repository including all files, commit history, and sets up the connection to the remote repository for development.",
        },
        {
          question:
            "Which command should you run most frequently to understand your repository state?",
          options: ["git log", "git push", "git status", "git clone"],
          correct: 2,
          explanation:
            "Git status is your best friend - it shows what files have changed, what's staged for commit, and the current state of your repository.",
        },
        {
          question: "What does 'git add .' do?",
          options: [
            "Adds a new file called 'dot'",
            "Stages all changed files for the next commit",
            "Commits all changes immediately",
            "Pushes changes to GitHub",
          ],
          correct: 1,
          explanation:
            "Git add . stages all changed files in the current directory and subdirectories, preparing them to be included in the next commit.",
        },
        {
          question: "What makes a good commit message?",
          options: [
            "Short and vague like 'changes'",
            "A clear action-based description of what changed",
            "Just listing the files that were modified",
            "As many details as possible",
          ],
          correct: 1,
          explanation:
            "Good commit messages use the formula: Action + What + Why if needed. Examples: 'Add user login functionality' or 'Fix mobile navigation bug'.",
        },
        {
          question: "When do you need to use 'git push -u origin main'?",
          options: [
            "Every time you push",
            "Only when pushing to a new repository for the first time",
            "When you want to push faster",
            "When there are merge conflicts",
          ],
          correct: 1,
          explanation:
            "The -u flag sets up tracking between your local main branch and the remote origin/main branch. After the first push, you can just use 'git push'.",
        },
        {
          question: "What should you do before starting work each day?",
          options: ["git push", "git status", "git pull", "git commit"],
          correct: 2,
          explanation:
            "Always git pull before starting work to download any new changes from the remote repository and avoid conflicts later.",
        },
        {
          question: "What does 'git log --oneline' show you?",
          options: [
            "Only the most recent commit",
            "A condensed view of commit history with short hashes and messages",
            "All files in the repository",
            "Your current branch status",
          ],
          correct: 1,
          explanation:
            "Git log --oneline shows a clean, condensed view of commit history with abbreviated commit hashes and commit messages on single lines.",
        },
        {
          question:
            "If 'git push' fails with 'Your branch is behind', what should you do?",
          options: [
            "Force push with --force",
            "Delete your local changes",
            "Run 'git pull' then 'git push' again",
            "Create a new repository",
          ],
          correct: 2,
          explanation:
            "When your branch is behind, it means someone else pushed changes. Pull their changes first with 'git pull', then push your commits.",
        },
        {
          question:
            "What's the difference between 'git add filename' and 'git add .'?",
          options: [
            "No difference - they do the same thing",
            "First adds one specific file, second adds all changed files",
            "First is faster than the second",
            "First creates a file, second deletes files",
          ],
          correct: 1,
          explanation:
            "Git add filename stages only that specific file, while git add . stages all changed files in the current directory and subdirectories.",
        },
        {
          question: "What does the staging area (index) allow you to do?",
          options: [
            "Store files permanently",
            "Choose exactly which changes to include in your next commit",
            "Automatically push to GitHub",
            "Create backups of your files",
          ],
          correct: 1,
          explanation:
            "The staging area lets you carefully select which changes to include in your next commit, allowing you to create focused, logical commits.",
        },
        {
          question: "How do you undo staging a file?",
          options: [
            "git undo filename",
            "git reset filename",
            "git remove filename",
            "git unstage filename",
          ],
          correct: 1,
          explanation:
            "Git reset filename removes the file from the staging area without losing your changes. Use 'git reset' to unstage all files.",
        },
        {
          question: "What's the recommended approach to committing?",
          options: [
            "Make one giant commit at the end of the day",
            "Commit early and often with small, focused changes",
            "Only commit when the project is completely finished",
            "Commit only when someone asks you to",
          ],
          correct: 1,
          explanation:
            "Small, frequent commits are better because they're easier to understand, review, and undo if needed. Each commit should represent one logical change.",
        },
        {
          question: "What does 'git diff' show you?",
          options: [
            "The differences between commits",
            "Unstaged changes in your working directory",
            "Your commit history",
            "Files that are staged for commit",
          ],
          correct: 1,
          explanation:
            "Git diff shows the specific line-by-line changes in your working directory that haven't been staged yet. Use 'git diff --cached' for staged changes.",
        },
        {
          question:
            "How do you create and switch to a new branch in one command?",
          options: [
            "git branch new-branch",
            "git checkout new-branch",
            "git checkout -b new-branch",
            "git switch new-branch",
          ],
          correct: 2,
          explanation:
            "Git checkout -b new-branch creates a new branch and switches to it immediately. It's equivalent to 'git branch new-branch' followed by 'git checkout new-branch'.",
        },
        {
          question:
            "What should you do if you make a typo in your last commit message?",
          options: [
            "Delete the commit and start over",
            "git commit --amend -m 'Corrected message'",
            "Push anyway and ignore it",
            "Create a new commit explaining the typo",
          ],
          correct: 1,
          explanation:
            "Git commit --amend allows you to modify your most recent commit, including changing the commit message, without creating a new commit.",
        },
        {
          question: "What happens during a merge conflict?",
          options: [
            "Git automatically chooses the best changes",
            "Your repository is permanently broken",
            "Git marks conflicting sections for you to manually resolve",
            "You lose all your work",
          ],
          correct: 2,
          explanation:
            "During a merge conflict, Git marks the conflicting sections in your files with special markers. You manually choose which changes to keep, then add and commit the resolved files.",
        },
        {
          question: "What does 'git remote -v' show you?",
          options: [
            "Your current branch",
            "Recent commits",
            "The URL(s) of your remote repositories",
            "Files that have been modified",
          ],
          correct: 2,
          explanation:
            "Git remote -v shows the URLs of your remote repositories (like GitHub), displaying both fetch and push URLs for each remote.",
        },
        {
          question: "What's the purpose of a .gitignore file?",
          options: [
            "To delete files from your repository",
            "To tell Git which files and folders to not track",
            "To ignore other developers' changes",
            "To make your repository private",
          ],
          correct: 1,
          explanation:
            "A .gitignore file specifies which files and directories Git should ignore, like temporary files, build artifacts, or sensitive information that shouldn't be tracked.",
        },
        {
          question:
            "What's the difference between 'git checkout' and 'git switch'?",
          options: [
            "They are exactly the same",
            "git switch is newer and clearer for branch switching",
            "git checkout is faster",
            "git switch only works with GitHub",
          ],
          correct: 1,
          explanation:
            "Git switch is a newer, more intuitive command specifically for switching branches, while git checkout has multiple purposes and can be confusing for beginners.",
        },
        {
          question:
            "What's the first thing you should do when you encounter a Git error?",
          options: [
            "Delete the repository and start over",
            "Run 'git status' to understand the current state",
            "Force push to fix everything",
            "Ask someone else to fix it",
          ],
          correct: 1,
          explanation:
            "Always run 'git status' first when confused or encountering errors. It shows you exactly what's happening and often suggests what to do next.",
        },
        {
          question: "What will you learn in the next GitHub tutorial?",
          options: [
            "Advanced Git internals and low-level commands",
            "GitHub workflow, branching strategies, and pull requests",
            "How to delete your GitHub account",
            "Database management with Git",
          ],
          correct: 1,
          explanation:
            "The next tutorial will cover GitHub's collaborative features: branching workflows, pull requests, code reviews, and professional team development practices.",
        },
      ],
    },
  },
  // GITHUB CATEGORY - Tutorial 4
  {
    slug: "github-workflow-basics",
    title: "GitHub Workflow: From Idea to Code",
    description:
      "Master the complete GitHub workflow with issues, branching, pull requests, and merging - the professional way to build software",
    mdxFile: "github/04-github-workflow-basics",
    category: "github",
    difficulty: 1,
    order: 4,
    published: true,
    isPremium: true,
    requiredPlan: "VIBED",
    quiz: {
      title: "GitHub Workflow Mastery Quiz",
      isPremium: true,
      requiredPlan: "VIBED",
      questions: [
        {
          question: "What is the primary purpose of GitHub Issues?",
          options: [
            "To store code files",
            "To track bugs, plan features, and manage project tasks",
            "To merge code changes",
            "To create repositories"
          ],
          correct: 1,
          explanation:
            "GitHub Issues serve as a centralized place to track bugs, plan features, manage tasks, and facilitate discussions about the project."
        },
        {
          question: "What should be included in a well-written issue?",
          options: [
            "Just the title",
            "Problem description, proposed solution, and acceptance criteria",
            "Only code snippets",
            "Personal opinions about the project"
          ],
          correct: 1,
          explanation:
            "A good issue includes a clear problem description, proposed solution, acceptance criteria, and any relevant context like screenshots or reproduction steps."
        },
        {
          question: "What is the main branch (main/master) used for?",
          options: [
            "Experimental features and testing",
            "Production-ready, deployable code",
            "Personal development work",
            "Storing old versions"
          ],
          correct: 1,
          explanation:
            "The main branch should always contain production-ready, deployable code. It's protected in professional teams to ensure stability."
        },
        {
          question: "What is the correct workflow for creating a feature branch?",
          options: [
            "Start from any branch and create a new one",
            "Start from main, pull latest changes, then create feature branch",
            "Create branch directly on GitHub website",
            "Copy files to a new folder"
          ],
          correct: 1,
          explanation:
            "Always start from main branch, pull the latest changes to ensure you're up to date, then create your feature branch from that clean state."
        },
        {
          question: "Which branch naming convention is most professional?",
          options: [
            "fix-bug",
            "fix/login-validation-error",
            "mybranch",
            "temp"
          ],
          correct: 1,
          explanation:
            "Professional branch names are descriptive and often include prefixes like 'fix/', 'feature/', or 'hotfix/' followed by a clear description of the work."
        },
        {
          question: "What is a Pull Request (PR)?",
          options: [
            "A request to delete code",
            "A request to review and merge code changes from a branch",
            "A request for help with coding",
            "A request to create a new repository"
          ],
          correct: 1,
          explanation:
            "A Pull Request is a way to propose code changes, request review from team members, and merge those changes into the main branch after approval."
        },
        {
          question: "What should be included in a good PR description?",
          options: [
            "Just the title",
            "What changed, why it changed, how to test, and links to related issues",
            "Personal thoughts about the code",
            "Unrelated project updates"
          ],
          correct: 1,
          explanation:
            "A good PR description explains what was changed, why, how to test the changes, includes screenshots if applicable, and links to related issues."
        },
        {
          question: "How do you automatically close an issue when a PR is merged?",
          options: [
            "Delete the issue manually",
            "Use keywords like 'Closes #123' in the PR description",
            "Send an email to the team",
            "Issues close automatically"
          ],
          correct: 1,
          explanation:
            "Use keywords like 'Closes #123', 'Fixes #456', or 'Resolves #789' in your PR description to automatically close related issues when the PR merges."
        },
        {
          question: "What is the 'Squash and Merge' strategy best used for?",
          options: [
            "When you want to keep all individual commits",
            "When you want to combine multiple commits into one clean commit",
            "When you want to delete the branch",
            "When there are merge conflicts"
          ],
          correct: 1,
          explanation:
            "Squash and Merge combines all commits from a feature branch into one clean commit, which keeps the main branch history simple and organized."
        },
        {
          question: "What should you do immediately after merging a PR?",
          options: [
            "Create another PR",
            "Delete the feature branch and pull latest changes to main",
            "Nothing, you're done",
            "Start working on the same branch"
          ],
          correct: 1,
          explanation:
            "After merging, delete the feature branch (GitHub offers this option), switch to main locally, and pull the latest changes to sync your local repository."
        },
        {
          question: "What is a Draft PR used for?",
          options: [
            "PRs that are ready to merge",
            "Getting early feedback and sharing progress before completion",
            "Deleting code",
            "Creating issues"
          ],
          correct: 1,
          explanation:
            "Draft PRs allow you to share work-in-progress, get early feedback on your approach, and collaborate with team members before the feature is complete."
        },
        {
          question: "How should you handle code review feedback?",
          options: [
            "Ignore it if you disagree",
            "Make requested changes and push commits to the same branch",
            "Create a new PR",
            "Argue with the reviewer"
          ],
          correct: 1,
          explanation:
            "Professional developers welcome feedback. Make the requested changes, push commits to the same branch (which updates the PR), and respond to comments constructively."
        },
        {
          question: "What causes merge conflicts?",
          options: [
            "Using the wrong branch name",
            "Multiple people modifying the same lines of code",
            "Creating too many commits",
            "Working on different files"
          ],
          correct: 1,
          explanation:
            "Merge conflicts occur when multiple people modify the same lines of code in different ways, and Git cannot automatically determine which changes to keep."
        },
        {
          question: "What is the professional way to start each development day?",
          options: [
            "Start coding immediately",
            "Check out main, pull latest changes, and review notifications",
            "Delete old branches",
            "Create random commits"
          ],
          correct: 1,
          explanation:
            "Professional developers start by checking out main, pulling latest changes, checking Git status, and reviewing GitHub notifications to stay synchronized with the team."
        },
        {
          question: "Why should you avoid working directly on the main branch?",
          options: [
            "It's slower than feature branches",
            "It can break production code and makes collaboration difficult",
            "GitHub doesn't allow it",
            "It uses more storage"
          ],
          correct: 1,
          explanation:
            "Working directly on main can break production code, makes collaboration difficult, prevents proper code review, and eliminates the safety net that branching provides."
        },
        {
          question: "What is the benefit of small, focused commits?",
          options: [
            "They take less time to make",
            "They're easier to understand, review, and revert if needed",
            "They use less storage",
            "They're required by GitHub"
          ],
          correct: 1,
          explanation:
            "Small, focused commits are easier to understand, review, and debug. If you need to revert a change, you can target the specific commit without losing other work."
        },
        {
          question: "How do you keep your feature branch up to date with main?",
          options: [
            "Delete and recreate the branch",
            "Merge or rebase main into your feature branch",
            "Create a new repository",
            "Copy files manually"
          ],
          correct: 1,
          explanation:
            "To keep your feature branch updated, you can merge main into your feature branch (git merge main) or rebase your branch on top of main (git rebase main)."
        },
        {
          question: "What is the purpose of protected branches?",
          options: [
            "To make branches load faster",
            "To require reviews and prevent direct pushes to critical branches",
            "To hide branches from other developers",
            "To automatically delete old branches"
          ],
          correct: 1,
          explanation:
            "Protected branches require pull request reviews before merging, prevent direct pushes, and can require status checks to pass - ensuring code quality and team collaboration."
        },
        {
          question: "What should you do when working on a feature that depends on another developer's work?",
          options: [
            "Wait until they finish completely",
            "Create your branch from their feature branch and coordinate timing",
            "Copy their code to your branch",
            "Work on a completely different feature"
          ],
          correct: 1,
          explanation:
            "When your feature depends on another's work, create your branch from their feature branch, coordinate merge timing, and consider pair programming for complex integrations."
        },
        {
          question: "What will you learn in the next GitHub tutorial?",
          options: [
            "How to delete your GitHub account",
            "Working with teams, contributing to open source, and advanced collaboration",
            "Basic HTML and CSS",
            "Database management"
          ],
          correct: 1,
          explanation:
            "The next tutorial will dive deeper into collaboration - working effectively with teams, contributing to open source projects, and managing complex multi-developer workflows."
        }
      ]
    }
  },
];

async function seedGithubTutorials() {
  try {
    console.log("🌱 Starting GitHub tutorial seeding...");

    for (const tutorialData of GITHUB_TUTORIALS) {
      const { quiz, category, ...tutorial } = tutorialData;

      // const categoryRecord = await seedGithubCategory();
      const categoryRecord = await prisma.category.findFirst({
        where: { slug: category },
      });

      if (!categoryRecord) {
        throw Error("no category found");
      }
      // Create or update tutorial
      const createdTutorial = await prisma.tutorial.upsert({
        where: { slug: tutorial.slug },
        update: {
          ...tutorial,
          categoryId: categoryRecord.id,
          published: true,
        },
        create: {
          ...tutorial,
          categoryId: categoryRecord.id,
          published: true,
        },
      });

      console.log(
        `✅ Tutorial created/updated: ${createdTutorial.title} (Category: ${categoryRecord.title})`
      );

      if (quiz) {
        // Create or update quiz
        const quizSlug = `${tutorial.slug}-quiz`;
        const createdQuiz = await prisma.quiz.upsert({
          where: { slug: quizSlug },
          update: {
            title: quiz.title,
            tutorialId: createdTutorial.id,
            questions: quiz.questions,
            isPremium: quiz.isPremium,
            requiredPlan: quiz.requiredPlan,
          },
          create: {
            title: quiz.title,
            slug: quizSlug,
            tutorialId: createdTutorial.id,
            questions: quiz.questions,
            isPremium: quiz.isPremium,
            requiredPlan: quiz.requiredPlan,
          },
        });

        console.log(
          `✅ Quiz created/updated: ${createdQuiz.title} with ${quiz.questions.length} questions`
        );
      }
    }

    console.log("🎉 GitHub tutorial seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Total GitHub tutorials: ${GITHUB_TUTORIALS.length}`);
    console.log(
      `   - Free tutorials: ${
        GITHUB_TUTORIALS.filter((t) => !t.isPremium).length
      }`
    );
    console.log(
      `   - Premium tutorials: ${
        GITHUB_TUTORIALS.filter((t) => t.isPremium).length
      }`
    );
  } catch (error) {
    console.error("❌ Error seeding GitHub tutorials:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedGithubTutorials().catch((e) => {
  console.error(e);
  process.exit(1);
});

export { seedGithubTutorials, GITHUB_TUTORIALS };
