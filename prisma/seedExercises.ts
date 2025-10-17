import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedExercises() {
  console.log("🏋️ Seeding Exercises...");

  const exercises = [
    {
      slug: "html-button-styling",
      title: "Style an HTML Button",
      description:
        "Learn basic HTML and CSS by creating and styling a button element.",
      difficulty: "beginner",
      category: "HTML & CSS",
      estimatedTime: 10,
      instructions: `Create a button element with custom styling.

Requirements:
- Add a button with the text "Click me"
- Style it with a blue background
- Add some padding and rounded corners
- Change the cursor to pointer on hover
- Add a subtle hover effect (e.g., darker color)`,
      initialHtml: `<button>Click me</button>`,
      initialCss: `button {
  /* Add your styles here */
}`,
      showHtmlEditor: true,
      showCssEditor: true,
      showJsEditor: false,
      testCases: [
        {
          description: "Button has padding",
          validate: `(html, css) => css.includes('padding')`,
        },
        {
          description: "Button has rounded corners",
          validate: `(html, css) => css.includes('border-radius')`,
        },
        {
          description: "Button has background color",
          validate: `(html, css) => css.includes('background')`,
        },
        {
          description: "Button has cursor pointer",
          validate: `(html, css) => css.includes('cursor')`,
        },
      ],
      hints: [
        "Use the padding property to add space inside the button",
        "border-radius: 5px; will make rounded corners",
        "background-color: blue; sets the background",
        "cursor: pointer; changes the cursor on hover",
      ],
      solution: {
        html: `<button>Click me</button>`,
        css: `button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}`,
      },
      topics: ["HTML", "CSS", "Styling"],
      isPremium: false,
      requiredPlan: "FREE",
      published: true,
      order: 1,
    },
    {
      slug: "css-flexbox-layout",
      title: "Create a Flexbox Layout",
      description:
        "Master CSS Flexbox by creating a responsive navigation bar.",
      difficulty: "intermediate",
      category: "CSS",
      estimatedTime: 20,
      instructions: `Create a responsive navigation bar using CSS Flexbox.

Requirements:
- Create a nav with 4 links (Home, About, Services, Contact)
- Use flexbox to display items horizontally
- Add space between items
- Make it responsive (stack vertically on mobile)
- Style the active link differently`,
      initialHtml: `<nav>
  <a href="#" class="active">Home</a>
  <a href="#">About</a>
  <a href="#">Services</a>
  <a href="#">Contact</a>
</nav>`,
      initialCss: `nav {
  /* Add flexbox styles */
}

a {
  /* Style your links */
}

a.active {
  /* Style the active link */
}

@media (max-width: 768px) {
  /* Mobile styles */
}`,
      showHtmlEditor: true,
      showCssEditor: true,
      showJsEditor: false,
      testCases: [
        {
          description: "Uses flexbox display",
          validate: `(html, css) => css.includes('display: flex') || css.includes('display:flex')`,
        },
        {
          description: "Has justify-content property",
          validate: `(html, css) => css.includes('justify-content')`,
        },
        {
          description: "Has media query for mobile",
          validate: `(html, css) => css.includes('@media')`,
        },
        {
          description: "Styles the active class",
          validate: `(html, css) => css.includes('.active') || css.includes('active')`,
        },
      ],
      hints: [
        "display: flex; enables flexbox on the parent",
        "justify-content: space-between; distributes items",
        "flex-direction: column; stacks items vertically",
        "Use @media queries for responsive design",
      ],
      solution: {
        html: `<nav>
  <a href="#" class="active">Home</a>
  <a href="#">About</a>
  <a href="#">Services</a>
  <a href="#">Contact</a>
</nav>`,
        css: `nav {
  display: flex;
  justify-content: space-around;
  background-color: #333;
  padding: 15px;
  gap: 10px;
}

a {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  transition: background-color 0.3s;
}

a:hover {
  background-color: #555;
  border-radius: 3px;
}

a.active {
  background-color: #007bff;
  border-radius: 3px;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
  }
}`,
      },
      topics: ["CSS", "Flexbox", "Responsive Design"],
      isPremium: false,
      requiredPlan: "FREE",
      published: true,
      order: 2,
    },
    {
      slug: "javascript-dom-manipulation",
      title: "DOM Manipulation with JavaScript",
      description: "Learn to interact with HTML elements using JavaScript.",
      difficulty: "beginner",
      category: "JavaScript",
      estimatedTime: 15,
      instructions: `Create an interactive to-do list item adder.

Requirements:
- Create an input field and button
- When the button is clicked, add the input value to a list
- Clear the input after adding
- Each item should have a delete button
- Show/hide the list based on items count`,
      initialHtml: `<div class="container">
  <input type="text" id="taskInput" placeholder="Add a task...">
  <button onclick="addTask()">Add</button>
  <ul id="taskList"></ul>
</div>`,
      initialCss: `body {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 50px auto;
}

.container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #f5f5f5;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}`,
      initialJs: `function addTask() {
  const input = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  
  if (input.value.trim() === '') return;
  
  const li = document.createElement('li');
  li.innerHTML = \`
    <span>\${input.value}</span>
    <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
  \`;
  
  taskList.appendChild(li);
  input.value = '';
  input.focus();
}

function deleteTask(btn) {
  btn.parentElement.remove();
}`,
      showHtmlEditor: true,
      showCssEditor: true,
      showJsEditor: true,
      testCases: [
        {
          description: "Has an addTask function",
          validate: `(html, css, js) => js.includes('function addTask')`,
        },
        {
          description: "Gets elements by ID",
          validate: `(html, css, js) => js.includes('getElementById')`,
        },
        {
          description: "Creates list items dynamically",
          validate: `(html, css, js) => js.includes('createElement')`,
        },
        {
          description: "Has a deleteTask function",
          validate: `(html, css, js) => js.includes('deleteTask')`,
        },
      ],
      hints: [
        "Use document.getElementById() to access elements",
        "Use createElement('li') to create new elements",
        "appendChild() adds elements to the DOM",
        "Use innerHTML to set the content of elements",
      ],
      solution: {
        html: `<div class="container">
  <input type="text" id="taskInput" placeholder="Add a task...">
  <button onclick="addTask()">Add</button>
  <ul id="taskList"></ul>
</div>`,
        css: `body {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 50px auto;
}

.container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #f5f5f5;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}`,
        js: `function addTask() {
  const input = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  
  if (input.value.trim() === '') return;
  
  const li = document.createElement('li');
  li.innerHTML = \`
    <span>\${input.value}</span>
    <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
  \`;
  
  taskList.appendChild(li);
  input.value = '';
  input.focus();
}

function deleteTask(btn) {
  btn.parentElement.remove();
}`,
      },
      topics: ["JavaScript", "DOM", "Events"],
      isPremium: false,
      requiredPlan: "FREE",
      published: true,
      order: 3,
    },
    {
      slug: "javascript-calculator",
      title: "Build a Simple Calculator",
      description: "Create a functioning calculator with basic operations.",
      difficulty: "intermediate",
      category: "JavaScript",
      estimatedTime: 25,
      instructions: `Build a calculator that performs basic arithmetic operations.

Requirements:
- Display input/output on screen
- Support +, -, *, / operations
- Include Clear (C) button
- Include Equals (=) button
- Validate input (prevent division by zero)
- Handle decimal numbers`,
      initialHtml: `<div class="calculator">
  <input type="text" id="display" readonly>
  <div class="buttons">
    <button onclick="appendNumber('7')">7</button>
    <button onclick="appendNumber('8')">8</button>
    <button onclick="appendNumber('9')">9</button>
    <button onclick="appendOperator('/')">÷</button>
    
    <button onclick="appendNumber('4')">4</button>
    <button onclick="appendNumber('5')">5</button>
    <button onclick="appendNumber('6')">6</button>
    <button onclick="appendOperator('*')">×</button>
    
    <button onclick="appendNumber('1')">1</button>
    <button onclick="appendNumber('2')">2</button>
    <button onclick="appendNumber('3')">3</button>
    <button onclick="appendOperator('-')">−</button>
    
    <button onclick="appendNumber('0')">0</button>
    <button onclick="appendNumber('.')">.</button>
    <button onclick="calculate()">=</button>
    <button onclick="appendOperator('+')">+</button>
    
    <button onclick="clearDisplay()" class="clear">C</button>
  </div>
</div>`,
      initialCss: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: Arial, sans-serif;
}

.calculator {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

#display {
  width: 100%;
  padding: 15px;
  font-size: 24px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: right;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

button {
  padding: 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e0e0e0;
}

button.clear {
  background-color: #ff6b6b;
  color: white;
  grid-column: span 2;
}

button.clear:hover {
  background-color: #ff5252;
}`,
      initialJs: `// Initialize variables to track calculator state
let display = document.getElementById('display');
let currentInput = '';
let operator = null;
let previousValue = '';

/**
 * Called when a number button is clicked
 * Should add the number to the current input and update the display
 */
function appendNumber(num) {
  // Prevent multiple decimal points
  if (num === '.' && currentInput.includes('.')) return;

  currentInput += num;
  updateDisplay();
}

/**
 * Called when an operator button (+, -, *, /) is clicked
 * Should store the current value and operator for calculation
 */
function appendOperator(op) {
  if (currentInput === '') return;

  if (previousValue !== '') {
    calculate();
  }

  previousValue = currentInput;
  currentInput = '';
  operator = op;
}

/**
 * Called when the equals button is clicked
 * Should perform the calculation and display the result
 * HINT: Use parseFloat() to convert strings to numbers
 * HINT: Don't forget to handle division by zero!
 */
function calculate() {
  if (!operator || !currentInput || !previousValue) return;

  const prev = parseFloat(previousValue);
  const current = parseFloat(currentInput);
  let result;

  // TODO: Implement the calculation logic for each operator (+, -, *, /)
  // Remember to check for division by zero!

  currentInput = result.toString();
  operator = null;
  previousValue = '';
  updateDisplay();
}

/**
 * Called when the clear button is clicked
 * Should reset all calculator state
 */
function clearDisplay() {
  currentInput = '';
  previousValue = '';
  operator = null;
  updateDisplay();
}

/**
 * Updates the display with the current input
 */
function updateDisplay() {
  display.value = currentInput;
}`,
      showHtmlEditor: true,
      showCssEditor: true,
      showJsEditor: true,
      testCases: [
        {
          description: "Addition works correctly (5 + 3 = 8)",
          validate: `(html, css, js, iframeWindow) => {
  if (!iframeWindow) return false;
  try {
    const win = iframeWindow;
    if (!win.clearDisplay || !win.appendNumber || !win.appendOperator || !win.calculate) return false;
    win.clearDisplay();
    win.appendNumber('5');
    win.appendOperator('+');
    win.appendNumber('3');
    win.calculate();
    const display = win.document.getElementById('display');
    return display && parseFloat(display.value) === 8;
  } catch(e) { return false; }
}`,
        },
        {
          description: "Subtraction works correctly (10 - 4 = 6)",
          validate: `(html, css, js, iframeWindow) => {
  if (!iframeWindow) return false;
  try {
    const win = iframeWindow;
    if (!win.clearDisplay || !win.appendNumber || !win.appendOperator || !win.calculate) return false;
    win.clearDisplay();
    win.appendNumber('1');
    win.appendNumber('0');
    win.appendOperator('-');
    win.appendNumber('4');
    win.calculate();
    const display = win.document.getElementById('display');
    return display && parseFloat(display.value) === 6;
  } catch(e) { return false; }
}`,
        },
        {
          description: "Multiplication works correctly (6 * 7 = 42)",
          validate: `(html, css, js, iframeWindow) => {
  if (!iframeWindow) return false;
  try {
    const win = iframeWindow;
    if (!win.clearDisplay || !win.appendNumber || !win.appendOperator || !win.calculate) return false;
    win.clearDisplay();
    win.appendNumber('6');
    win.appendOperator('*');
    win.appendNumber('7');
    win.calculate();
    const display = win.document.getElementById('display');
    return display && parseFloat(display.value) === 42;
  } catch(e) { return false; }
}`,
        },
        {
          description: "Division works correctly (20 / 4 = 5)",
          validate: `(html, css, js, iframeWindow) => {
  if (!iframeWindow) return false;
  try {
    const win = iframeWindow;
    if (!win.clearDisplay || !win.appendNumber || !win.appendOperator || !win.calculate) return false;
    win.clearDisplay();
    win.appendNumber('2');
    win.appendNumber('0');
    win.appendOperator('/');
    win.appendNumber('4');
    win.calculate();
    const display = win.document.getElementById('display');
    return display && parseFloat(display.value) === 5;
  } catch(e) { return false; }
}`,
        },
        {
          description: "Prevents division by zero",
          validate: `(html, css, js, iframeWindow) => {
  if (!iframeWindow) return js.includes('=== 0') || js.includes('== 0');
  try {
    const win = iframeWindow;
    if (!win.clearDisplay || !win.appendNumber || !win.appendOperator || !win.calculate) return false;
    win.clearDisplay();
    win.appendNumber('5');
    win.appendOperator('/');
    win.appendNumber('0');
    const displayBefore = win.document.getElementById('display').value;
    win.calculate();
    const displayAfter = win.document.getElementById('display').value;
    // Display should either show error message or remain unchanged (not show Infinity or NaN)
    return displayAfter !== 'Infinity' && displayAfter !== 'NaN' && !displayAfter.includes('Infinity');
  } catch(e) { return false; }
}`,
        },
        {
          description: "Decimal numbers are supported",
          validate: `(html, css, js, iframeWindow) => {
  if (!iframeWindow) return js.includes("includes('.')");
  try {
    const win = iframeWindow;
    if (!win.clearDisplay || !win.appendNumber) return false;
    win.clearDisplay();
    win.appendNumber('3');
    win.appendNumber('.');
    win.appendNumber('5');
    const display = win.document.getElementById('display');
    return display && display.value.includes('.');
  } catch(e) { return false; }
}`,
        },
        {
          description: "Clear button resets calculator state",
          validate: `(html, css, js, iframeWindow) => {
  if (!iframeWindow) return js.includes('clearDisplay');
  try {
    const win = iframeWindow;
    if (!win.clearDisplay || !win.appendNumber) return false;
    win.appendNumber('5');
    win.clearDisplay();
    const display = win.document.getElementById('display');
    return display && display.value === '';
  } catch(e) { return false; }
}`,
        },
      ],
      hints: [
        "Store previous value, current value, and operator separately",
        "Use parseFloat() to convert strings to numbers",
        "Check if current is 0 before dividing",
        "Clear all variables after calculating",
      ],
      solution: {
        html: `<div class="calculator">
  <input type="text" id="display" readonly>
  <div class="buttons">
    <button onclick="appendNumber('7')">7</button>
    <button onclick="appendNumber('8')">8</button>
    <button onclick="appendNumber('9')">9</button>
    <button onclick="appendOperator('/')">÷</button>
    
    <button onclick="appendNumber('4')">4</button>
    <button onclick="appendNumber('5')">5</button>
    <button onclick="appendNumber('6')">6</button>
    <button onclick="appendOperator('*')">×</button>
    
    <button onclick="appendNumber('1')">1</button>
    <button onclick="appendNumber('2')">2</button>
    <button onclick="appendNumber('3')">3</button>
    <button onclick="appendOperator('-')">−</button>
    
    <button onclick="appendNumber('0')">0</button>
    <button onclick="appendNumber('.')">.</button>
    <button onclick="calculate()">=</button>
    <button onclick="appendOperator('+')">+</button>
    
    <button onclick="clearDisplay()" class="clear">C</button>
  </div>
</div>`,
        css: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: Arial, sans-serif;
}

.calculator {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

#display {
  width: 100%;
  padding: 15px;
  font-size: 24px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: right;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

button {
  padding: 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e0e0e0;
}

button.clear {
  background-color: #ff6b6b;
  color: white;
  grid-column: span 2;
}

button.clear:hover {
  background-color: #ff5252;
}`,
        js: `let display = document.getElementById('display');
let currentInput = '';
let operator = null;
let previousValue = '';

function appendNumber(num) {
  if (num === '.' && currentInput.includes('.')) return;
  currentInput += num;
  updateDisplay();
}

function appendOperator(op) {
  if (currentInput === '') return;
  if (previousValue === '') {
    previousValue = currentInput;
    currentInput = '';
    operator = op;
  } else {
    calculate();
    operator = op;
  }
}

function calculate() {
  if (operator && currentInput && previousValue) {
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentInput);
    
    if (operator === '+') result = prev + current;
    else if (operator === '-') result = prev - current;
    else if (operator === '*') result = prev * current;
    else if (operator === '/') {
      if (current === 0) {
        alert('Cannot divide by zero');
        return;
      }
      result = prev / current;
    }
    
    currentInput = result.toString();
    operator = null;
    previousValue = '';
    updateDisplay();
  }
}

function clearDisplay() {
  currentInput = '';
  previousValue = '';
  operator = null;
  updateDisplay();
}

function updateDisplay() {
  display.value = currentInput;
}`,
      },
      topics: ["JavaScript", "State Management", "Calculator"],
      isPremium: false,
      requiredPlan: "FREE",
      published: true,
      order: 4,
    },
    {
      slug: "form-validation",
      title: "Form Validation with JavaScript",
      description: "Create a form with real-time validation for common input types.",
      difficulty: "intermediate",
      category: "JavaScript",
      estimatedTime: 20,
      instructions: `Build a registration form with client-side validation.

Requirements:
- Validate email format (must contain @ and .)
- Validate password (minimum 8 characters)
- Validate password confirmation (must match password)
- Show error messages below invalid fields
- Disable submit button if form is invalid
- Show success message on valid submission`,
      initialHtml: `<div class="form-container">
  <h2>Registration Form</h2>
  <form id="registrationForm">
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" placeholder="Enter your email">
      <span class="error" id="emailError"></span>
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" placeholder="Minimum 8 characters">
      <span class="error" id="passwordError"></span>
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password:</label>
      <input type="password" id="confirmPassword" placeholder="Re-enter password">
      <span class="error" id="confirmError"></span>
    </div>

    <button type="submit" id="submitBtn">Register</button>
    <div class="success" id="successMessage"></div>
  </form>
</div>`,
      initialCss: `body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
}

.form-container {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input.invalid {
  border-color: #ff4444;
}

input.valid {
  border-color: #00C851;
}

.error {
  color: #ff4444;
  font-size: 12px;
  display: block;
  margin-top: 5px;
  min-height: 18px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success {
  color: #00C851;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}`,
      initialJs: `// Get form elements
const form = document.getElementById('registrationForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');

// Add event listeners for real-time validation
emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);
confirmInput.addEventListener('input', validateConfirmPassword);

form.addEventListener('submit', handleSubmit);

function validateEmail() {
  const email = emailInput.value;
  const emailError = document.getElementById('emailError');

  // TODO: Check if email contains @ and .
  // TODO: Update error message and input styling
  // TODO: Return true if valid, false if invalid
}

function validatePassword() {
  const password = passwordInput.value;
  const passwordError = document.getElementById('passwordError');

  // TODO: Check if password is at least 8 characters
  // TODO: Update error message and input styling
  // TODO: Return true if valid, false if invalid
}

function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  const confirmError = document.getElementById('confirmError');

  // TODO: Check if passwords match
  // TODO: Update error message and input styling
  // TODO: Return true if valid, false if invalid
}

function updateSubmitButton() {
  // TODO: Enable/disable submit button based on form validity
}

function handleSubmit(e) {
  e.preventDefault();

  // TODO: Validate all fields
  // TODO: If valid, show success message
  // TODO: Clear form
}`,
      showHtmlEditor: true,
      showCssEditor: true,
      showJsEditor: true,
      testCases: [
        {
          description: "Has validateEmail function",
          validate: `(html, css, js) => js.includes('function validateEmail')`,
        },
        {
          description: "Has validatePassword function",
          validate: `(html, css, js) => js.includes('function validatePassword')`,
        },
        {
          description: "Checks email format with @ symbol",
          validate: `(html, css, js) => js.includes('@') && (js.includes('includes') || js.includes('indexOf'))`,
        },
        {
          description: "Checks password length (minimum 8)",
          validate: `(html, css, js) => js.includes('.length') && (js.includes('8') || js.includes('>='))`,
        },
        {
          description: "Validates password confirmation matches",
          validate: `(html, css, js) => js.includes('validateConfirm') || js.includes('match')`,
        },
        {
          description: "Handles form submission with preventDefault",
          validate: `(html, css, js) => js.includes('preventDefault')`,
        },
      ],
      hints: [
        "Use .includes('@') and .includes('.') to check email format",
        "Use password.length >= 8 to check minimum length",
        "Compare password and confirm values with === operator",
        "Add/remove CSS classes 'valid' and 'invalid' to inputs",
        "Use form.reset() to clear the form after submission",
      ],
      solution: {
        html: `<div class="form-container">
  <h2>Registration Form</h2>
  <form id="registrationForm">
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" placeholder="Enter your email">
      <span class="error" id="emailError"></span>
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" placeholder="Minimum 8 characters">
      <span class="error" id="passwordError"></span>
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password:</label>
      <input type="password" id="confirmPassword" placeholder="Re-enter password">
      <span class="error" id="confirmError"></span>
    </div>

    <button type="submit" id="submitBtn">Register</button>
    <div class="success" id="successMessage"></div>
  </form>
</div>`,
        css: `body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
}

.form-container {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input.invalid {
  border-color: #ff4444;
}

input.valid {
  border-color: #00C851;
}

.error {
  color: #ff4444;
  font-size: 12px;
  display: block;
  margin-top: 5px;
  min-height: 18px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success {
  color: #00C851;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}`,
        js: `const form = document.getElementById('registrationForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');

emailInput.addEventListener('input', () => {
  validateEmail();
  updateSubmitButton();
});

passwordInput.addEventListener('input', () => {
  validatePassword();
  validateConfirmPassword();
  updateSubmitButton();
});

confirmInput.addEventListener('input', () => {
  validateConfirmPassword();
  updateSubmitButton();
});

form.addEventListener('submit', handleSubmit);

function validateEmail() {
  const email = emailInput.value;
  const emailError = document.getElementById('emailError');

  if (!email.includes('@') || !email.includes('.')) {
    emailError.textContent = 'Please enter a valid email address';
    emailInput.classList.add('invalid');
    emailInput.classList.remove('valid');
    return false;
  }

  emailError.textContent = '';
  emailInput.classList.add('valid');
  emailInput.classList.remove('invalid');
  return true;
}

function validatePassword() {
  const password = passwordInput.value;
  const passwordError = document.getElementById('passwordError');

  if (password.length < 8) {
    passwordError.textContent = 'Password must be at least 8 characters';
    passwordInput.classList.add('invalid');
    passwordInput.classList.remove('valid');
    return false;
  }

  passwordError.textContent = '';
  passwordInput.classList.add('valid');
  passwordInput.classList.remove('invalid');
  return true;
}

function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  const confirmError = document.getElementById('confirmError');

  if (confirm !== password) {
    confirmError.textContent = 'Passwords do not match';
    confirmInput.classList.add('invalid');
    confirmInput.classList.remove('valid');
    return false;
  }

  confirmError.textContent = '';
  confirmInput.classList.add('valid');
  confirmInput.classList.remove('invalid');
  return true;
}

function updateSubmitButton() {
  const isValid = validateEmail() && validatePassword() && validateConfirmPassword();
  submitBtn.disabled = !isValid;
}

function handleSubmit(e) {
  e.preventDefault();

  if (validateEmail() && validatePassword() && validateConfirmPassword()) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = 'Registration successful!';
    form.reset();

    emailInput.classList.remove('valid', 'invalid');
    passwordInput.classList.remove('valid', 'invalid');
    confirmInput.classList.remove('valid', 'invalid');

    submitBtn.disabled = true;

    setTimeout(() => {
      successMessage.textContent = '';
    }, 3000);
  }
}

updateSubmitButton();`,
      },
      topics: ["JavaScript", "Form Validation", "DOM Events"],
      isPremium: false,
      requiredPlan: "FREE",
      published: true,
      order: 5,
    },
    {
      slug: "css-grid-gallery",
      title: "CSS Grid Photo Gallery",
      description: "Build a responsive image gallery using CSS Grid layout.",
      difficulty: "intermediate",
      category: "CSS",
      estimatedTime: 20,
      instructions: `Create a responsive photo gallery with CSS Grid.

Requirements:
- Use CSS Grid for layout
- Display 3 columns on desktop
- Display 2 columns on tablet
- Display 1 column on mobile
- Add hover effects to images
- Include image captions
- Make images scale properly`,
      initialHtml: `<div class="gallery">
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=1" alt="Image 1">
    <div class="caption">Scenic Landscape</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=2" alt="Image 2">
    <div class="caption">Urban Architecture</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=3" alt="Image 3">
    <div class="caption">Nature Close-up</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=4" alt="Image 4">
    <div class="caption">Abstract Art</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=5" alt="Image 5">
    <div class="caption">Wildlife Photography</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=6" alt="Image 6">
    <div class="caption">Street Scene</div>
  </div>
</div>`,
      initialCss: `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f0f0f0;
}

.gallery {
  /* Add CSS Grid styles */
}

.gallery-item {
  /* Style the gallery items */
}

img {
  /* Make images responsive */
}

.caption {
  /* Style the captions */
}

/* Tablet styles (max-width: 768px) */
@media (max-width: 768px) {

}

/* Mobile styles (max-width: 480px) */
@media (max-width: 480px) {

}`,
      showHtmlEditor: true,
      showCssEditor: true,
      showJsEditor: false,
      testCases: [
        {
          description: "Uses CSS Grid display",
          validate: `(html, css) => css.includes('display: grid') || css.includes('display:grid')`,
        },
        {
          description: "Has grid-template-columns property",
          validate: `(html, css) => css.includes('grid-template-columns')`,
        },
        {
          description: "Has gap or grid-gap property",
          validate: `(html, css) => css.includes('gap') || css.includes('grid-gap')`,
        },
        {
          description: "Has tablet media query (768px)",
          validate: `(html, css) => css.includes('@media') && css.includes('768')`,
        },
        {
          description: "Has mobile media query (480px)",
          validate: `(html, css) => css.includes('@media') && css.includes('480')`,
        },
        {
          description: "Images are set to fill container",
          validate: `(html, css) => css.includes('width: 100%') || css.includes('width:100%')`,
        },
      ],
      hints: [
        "Use display: grid on the .gallery container",
        "grid-template-columns: repeat(3, 1fr) creates 3 equal columns",
        "Use gap property to add space between items",
        "Set img width to 100% and object-fit: cover",
        "In media queries, change grid-template-columns to 2fr then 1fr",
      ],
      solution: {
        html: `<div class="gallery">
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=1" alt="Image 1">
    <div class="caption">Scenic Landscape</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=2" alt="Image 2">
    <div class="caption">Urban Architecture</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=3" alt="Image 3">
    <div class="caption">Nature Close-up</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=4" alt="Image 4">
    <div class="caption">Abstract Art</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=5" alt="Image 5">
    <div class="caption">Wildlife Photography</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/400/300?random=6" alt="Image 6">
    <div class="caption">Street Scene</div>
  </div>
</div>`,
        css: `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f0f0f0;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  background-color: white;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.15);
}

img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}

.caption {
  padding: 15px;
  text-align: center;
  color: #333;
  font-weight: bold;
}

@media (max-width: 768px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .gallery {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}`,
      },
      topics: ["CSS", "Grid", "Responsive Design", "Gallery"],
      isPremium: false,
      requiredPlan: "FREE",
      published: true,
      order: 6,
    },
    {
      slug: "dropdown-menu",
      title: "Interactive Dropdown Menu",
      description: "Create a dropdown navigation menu with smooth animations.",
      difficulty: "beginner",
      category: "HTML & CSS",
      estimatedTime: 15,
      instructions: `Build an interactive dropdown menu that appears on hover.

Requirements:
- Create a navigation bar with menu items
- Add dropdown items under "Products" and "Services"
- Show dropdown on hover
- Add smooth CSS transitions
- Style the active/hover states
- Make it keyboard accessible`,
      initialHtml: `<nav class="navbar">
  <ul class="nav-menu">
    <li class="nav-item">
      <a href="#" class="nav-link">Home</a>
    </li>
    <li class="nav-item dropdown">
      <a href="#" class="nav-link">Products ▾</a>
      <ul class="dropdown-menu">
        <li><a href="#" class="dropdown-link">Product 1</a></li>
        <li><a href="#" class="dropdown-link">Product 2</a></li>
        <li><a href="#" class="dropdown-link">Product 3</a></li>
      </ul>
    </li>
    <li class="nav-item dropdown">
      <a href="#" class="nav-link">Services ▾</a>
      <ul class="dropdown-menu">
        <li><a href="#" class="dropdown-link">Service 1</a></li>
        <li><a href="#" class="dropdown-link">Service 2</a></li>
      </ul>
    </li>
    <li class="nav-item">
      <a href="#" class="nav-link">Contact</a>
    </li>
  </ul>
</nav>`,
      initialCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}

.navbar {
  background-color: #333;
  /* Add navbar styles */
}

.nav-menu {
  list-style: none;
  display: flex;
  /* Add menu styles */
}

.nav-item {
  position: relative;
  /* Style nav items */
}

.nav-link {
  /* Style navigation links */
}

.dropdown-menu {
  /* Style dropdown menus */
  /* Initially hide them */
}

.dropdown:hover .dropdown-menu {
  /* Show dropdown on hover */
}

.dropdown-link {
  /* Style dropdown links */
}`,
      showHtmlEditor: true,
      showCssEditor: true,
      showJsEditor: false,
      testCases: [
        {
          description: "Navigation uses flexbox",
          validate: `(html, css) => css.includes('display: flex') || css.includes('display:flex')`,
        },
        {
          description: "Dropdown menu has position styling",
          validate: `(html, css) => css.includes('position: absolute') || css.includes('position:absolute')`,
        },
        {
          description: "Dropdown is initially hidden",
          validate: `(html, css) => css.includes('display: none') || css.includes('opacity: 0') || css.includes('visibility: hidden')`,
        },
        {
          description: "Has hover state for dropdown",
          validate: `(html, css) => css.includes(':hover') && css.includes('dropdown')`,
        },
        {
          description: "Uses transition for smooth animation",
          validate: `(html, css) => css.includes('transition')`,
        },
      ],
      hints: [
        "Use display: flex on .nav-menu for horizontal layout",
        "Set position: relative on .nav-item for dropdown positioning",
        "Use position: absolute on .dropdown-menu to position it below",
        "Hide dropdown with display: none or opacity: 0",
        "Use .dropdown:hover .dropdown-menu to show on hover",
        "Add transition property for smooth animations",
      ],
      solution: {
        html: `<nav class="navbar">
  <ul class="nav-menu">
    <li class="nav-item">
      <a href="#" class="nav-link">Home</a>
    </li>
    <li class="nav-item dropdown">
      <a href="#" class="nav-link">Products ▾</a>
      <ul class="dropdown-menu">
        <li><a href="#" class="dropdown-link">Product 1</a></li>
        <li><a href="#" class="dropdown-link">Product 2</a></li>
        <li><a href="#" class="dropdown-link">Product 3</a></li>
      </ul>
    </li>
    <li class="nav-item dropdown">
      <a href="#" class="nav-link">Services ▾</a>
      <ul class="dropdown-menu">
        <li><a href="#" class="dropdown-link">Service 1</a></li>
        <li><a href="#" class="dropdown-link">Service 2</a></li>
      </ul>
    </li>
    <li class="nav-item">
      <a href="#" class="nav-link">Contact</a>
    </li>
  </ul>
</nav>`,
        css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}

.navbar {
  background-color: #333;
  padding: 0 20px;
}

.nav-menu {
  list-style: none;
  display: flex;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: block;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #555;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #444;
  list-style: none;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-link {
  display: block;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
}

.dropdown-link:hover {
  background-color: #555;
}`,
      },
      topics: ["HTML", "CSS", "Navigation", "Dropdown", "Hover Effects"],
      isPremium: false,
      requiredPlan: "FREE",
      published: true,
      order: 7,
    },
    {
      slug: "responsive-card",
      title: "Responsive Card Component",
      description: "Design a modern, responsive card component with image and content.",
      difficulty: "beginner",
      category: "HTML & CSS",
      estimatedTime: 15,
      instructions: `Create a professional-looking card component.

Requirements:
- Include an image at the top
- Add a title, description, and button
- Make it responsive (stack on mobile)
- Add hover effects (scale, shadow)
- Use modern CSS features (border-radius, box-shadow)
- Include proper spacing and typography`,
      initialHtml: `<div class="card">
  <img src="https://picsum.photos/400/250" alt="Card image" class="card-image">
  <div class="card-content">
    <h2 class="card-title">Card Title</h2>
    <p class="card-description">
      This is a description of the card. It provides context about the content and helps users understand what this card is about.
    </p>
    <button class="card-button">Learn More</button>
  </div>
</div>`,
      initialCss: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
  padding: 20px;
}

.card {
  /* Add card styles */
}

.card-image {
  /* Style the image */
}

.card-content {
  /* Style the content area */
}

.card-title {
  /* Style the title */
}

.card-description {
  /* Style the description */
}

.card-button {
  /* Style the button */
}

/* Add hover effects */

/* Mobile responsive (max-width: 480px) */
@media (max-width: 480px) {

}`,
      showHtmlEditor: true,
      showCssEditor: true,
      showJsEditor: false,
      testCases: [
        {
          description: "Card has border-radius",
          validate: `(html, css) => css.includes('border-radius')`,
        },
        {
          description: "Card has box-shadow",
          validate: `(html, css) => css.includes('box-shadow')`,
        },
        {
          description: "Has hover effect with transform or transition",
          validate: `(html, css) => css.includes(':hover') && (css.includes('transform') || css.includes('transition'))`,
        },
        {
          description: "Image is responsive",
          validate: `(html, css) => css.includes('width: 100%') || css.includes('width:100%')`,
        },
        {
          description: "Has media query for mobile",
          validate: `(html, css) => css.includes('@media')`,
        },
      ],
      hints: [
        "Set max-width on the card (e.g., 400px)",
        "Use overflow: hidden to clip the image to border-radius",
        "Set image width to 100% and height to auto",
        "Add padding to .card-content for spacing",
        "Use transform: translateY() or scale() for hover effect",
        "Add transition to make animations smooth",
      ],
      solution: {
        html: `<div class="card">
  <img src="https://picsum.photos/400/250" alt="Card image" class="card-image">
  <div class="card-content">
    <h2 class="card-title">Card Title</h2>
    <p class="card-description">
      This is a description of the card. It provides context about the content and helps users understand what this card is about.
    </p>
    <button class="card-button">Learn More</button>
  </div>
</div>`,
        css: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
  padding: 20px;
}

.card {
  max-width: 400px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.15);
}

.card-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}

.card-content {
  padding: 24px;
}

.card-title {
  font-size: 24px;
  color: #333;
  margin: 0 0 12px 0;
}

.card-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.card-button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.card-button:hover {
  background-color: #0056b3;
}

@media (max-width: 480px) {
  .card {
    max-width: 100%;
  }

  .card-content {
    padding: 16px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-description {
    font-size: 14px;
  }
}`,
      },
      topics: ["HTML", "CSS", "Card Design", "Responsive", "Hover Effects"],
      isPremium: false,
      requiredPlan: "FREE",
      published: true,
      order: 8,
    },
    {
      slug: "async-data-fetch",
      title: "Fetch API - Display User Data",
      description: "Learn to fetch and display data from an API using modern JavaScript.",
      difficulty: "intermediate",
      category: "JavaScript",
      estimatedTime: 20,
      instructions: `Fetch user data from an API and display it in a list.

Requirements:
- Fetch data from JSONPlaceholder API
- Display loading state while fetching
- Show user cards with name, email, and company
- Handle errors gracefully
- Add a refresh button to reload data
- Style the user cards nicely`,
      initialHtml: `<div class="container">
  <div class="header">
    <h1>User Directory</h1>
    <button id="refreshBtn" onclick="fetchUsers()">Refresh</button>
  </div>
  <div id="loading" class="loading">Loading...</div>
  <div id="error" class="error"></div>
  <div id="userList" class="user-list"></div>
</div>`,
      initialCss: `body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
  margin: 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  color: #333;
  margin: 0;
}

#refreshBtn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

#refreshBtn:hover {
  background-color: #0056b3;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
  display: none;
}

.error {
  background-color: #ff4444;
  color: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  display: none;
}

.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.user-card p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.user-card strong {
  color: #333;
}`,
      initialJs: `// API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Get DOM elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const userListEl = document.getElementById('userList');

// Fetch users on page load
fetchUsers();

async function fetchUsers() {
  // TODO: Show loading state
  // TODO: Hide error and clear user list

  try {
    // TODO: Fetch data from API
    // TODO: Check if response is ok
    // TODO: Parse JSON data
    // TODO: Display users
  } catch (error) {
    // TODO: Handle errors
  } finally {
    // TODO: Hide loading state
  }
}

function displayUsers(users) {
  // TODO: Loop through users
  // TODO: Create card for each user
  // TODO: Add user info (name, email, company)
  // TODO: Append to userList
}

function showError(message) {
  // TODO: Display error message
}`,
      showHtmlEditor: true,
      showCssEditor: true,
      showJsEditor: true,
      testCases: [
        {
          description: "Uses async/await syntax",
          validate: `(html, css, js) => js.includes('async') && js.includes('await')`,
        },
        {
          description: "Uses fetch API",
          validate: `(html, css, js) => js.includes('fetch(')`,
        },
        {
          description: "Has try-catch for error handling",
          validate: `(html, css, js) => js.includes('try') && js.includes('catch')`,
        },
        {
          description: "Handles loading state",
          validate: `(html, css, js) => js.includes('loading') && (js.includes('.style.display') || js.includes('classList'))`,
        },
        {
          description: "Creates user cards dynamically",
          validate: `(html, css, js) => js.includes('createElement') || js.includes('innerHTML')`,
        },
        {
          description: "Has a refresh function",
          validate: `(html, css, js) => js.includes('function fetchUsers') || js.includes('fetchUsers =')`,
        },
      ],
      hints: [
        "Use async/await with fetch() for cleaner code",
        "Show loading with: loadingEl.style.display = 'block'",
        "Parse response with: await response.json()",
        "Loop through users with forEach or map",
        "Create elements with createElement and innerHTML",
        "Always hide loading in the finally block",
      ],
      solution: {
        html: `<div class="container">
  <div class="header">
    <h1>User Directory</h1>
    <button id="refreshBtn" onclick="fetchUsers()">Refresh</button>
  </div>
  <div id="loading" class="loading">Loading...</div>
  <div id="error" class="error"></div>
  <div id="userList" class="user-list"></div>
</div>`,
        css: `body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
  margin: 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  color: #333;
  margin: 0;
}

#refreshBtn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

#refreshBtn:hover {
  background-color: #0056b3;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
  display: none;
}

.error {
  background-color: #ff4444;
  color: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  display: none;
}

.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.user-card p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.user-card strong {
  color: #333;
}`,
        js: `const API_URL = 'https://jsonplaceholder.typicode.com/users';

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const userListEl = document.getElementById('userList');

fetchUsers();

async function fetchUsers() {
  loadingEl.style.display = 'block';
  errorEl.style.display = 'none';
  userListEl.innerHTML = '';

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    showError('Failed to load users. Please try again.');
    console.error('Error:', error);
  } finally {
    loadingEl.style.display = 'none';
  }
}

function displayUsers(users) {
  users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = \`
      <h3>\${user.name}</h3>
      <p><strong>Email:</strong> \${user.email}</p>
      <p><strong>Company:</strong> \${user.company.name}</p>
      <p><strong>City:</strong> \${user.address.city}</p>
    \`;
    userListEl.appendChild(card);
  });
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}`,
      },
      topics: ["JavaScript", "Fetch API", "Async/Await", "API", "JSON"],
      isPremium: false,
      requiredPlan: "FREE",
      published: true,
      order: 9,
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      update: {
        title: exercise.title,
        description: exercise.description,
        difficulty: exercise.difficulty,
        category: exercise.category,
        estimatedTime: exercise.estimatedTime,
        instructions: exercise.instructions,
        initialHtml: exercise.initialHtml,
        initialCss: exercise.initialCss,
        initialJs: exercise.initialJs,
        showHtmlEditor: exercise.showHtmlEditor,
        showCssEditor: exercise.showCssEditor,
        showJsEditor: exercise.showJsEditor,
        testCases: exercise.testCases,
        hints: exercise.hints,
        solution: exercise.solution,
        topics: exercise.topics,
        isPremium: exercise.isPremium,
        requiredPlan: exercise.requiredPlan,
        published: exercise.published,
        order: exercise.order,
      },
      create: {
        ...exercise,
        testCases: exercise.testCases,
        solution: exercise.solution,
      },
    });
  }

  console.log(`✅ Seeded ${exercises.length} exercises`);
}

seedExercises();
