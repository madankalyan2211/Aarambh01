const mongoose = require('mongoose');
const { Course } = require('./models');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://Aarambh01:Aarambh143$@aarambh.bozwgdv.mongodb.net/aarambh-lms?retryWrites=true&w=majority&appName=Aarambh';

// Enhanced content for specific lessons
const enhancedLessons = {
  'Introduction to Arrays': `
<h1>Introduction to Arrays 📊</h1>

<h2>What is an Array?</h2>
<p>An array is a fundamental data structure that stores elements of the same type in contiguous memory locations. It's one of the most commonly used data structures in programming.</p>

<h2>📚 Key Characteristics</h2>
<ul>
  <li><strong>Fixed Size:</strong> Arrays have a predetermined size that cannot be changed</li>
  <li><strong>Indexed Access:</strong> Elements can be accessed using their index (position)</li>
  <li><strong>Homogeneous:</strong> All elements must be of the same data type</li>
  <li><strong>Continuous Memory:</strong> Elements are stored in adjacent memory locations</li>
</ul>

<h2>🏗️ Array Declaration</h2>
<pre><code>// JavaScript
let numbers = [1, 2, 3, 4, 5];
let fruits = ["apple", "banana", "orange"];

// Python
numbers = [1, 2, 3, 4, 5]
fruits = ["apple", "banana", "orange"]

// Java
int[] numbers = {1, 2, 3, 4, 5};
String[] fruits = {"apple", "banana", "orange"};</code></pre>

<h2>🔍 Accessing Array Elements</h2>
<p>Arrays use zero-based indexing, meaning the first element is at index 0:</p>
<pre><code>let fruits = ["apple", "banana", "orange"];
console.log(fruits[0]);  // Output: "apple"
console.log(fruits[1]);  // Output: "banana"
console.log(fruits[2]);  // Output: "orange"</code></pre>

<h2>⚡ Common Array Operations</h2>

<h3>1. Traversal (Visiting all elements)</h3>
<pre><code>for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}</code></pre>

<h3>2. Insertion</h3>
<pre><code>// Insert at end
fruits.push("grape");

// Insert at beginning
fruits.unshift("mango");

// Insert at specific position
fruits.splice(2, 0, "kiwi");</code></pre>

<h3>3. Deletion</h3>
<pre><code>// Delete from end
fruits.pop();

// Delete from beginning
fruits.shift();

// Delete from specific position
fruits.splice(2, 1);</code></pre>

<h3>4. Searching</h3>
<pre><code>// Find index of element
let index = fruits.indexOf("banana");

// Check if element exists
let exists = fruits.includes("apple");</code></pre>

<h2>⏱️ Time Complexity</h2>
<table>
  <thead>
    <tr>
      <th>Operation</th>
      <th>Time Complexity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Access by index</td>
      <td>O(1)</td>
    </tr>
    <tr>
      <td>Search</td>
      <td>O(n)</td>
    </tr>
    <tr>
      <td>Insertion at end</td>
      <td>O(1)</td>
    </tr>
    <tr>
      <td>Insertion at beginning/middle</td>
      <td>O(n)</td>
    </tr>
    <tr>
      <td>Deletion</td>
      <td>O(n)</td>
    </tr>
  </tbody>
</table>

<h2>💡 Advantages</h2>
<ul>
  <li>Fast random access - O(1) time complexity</li>
  <li>Easy to implement and understand</li>
  <li>Memory efficient for fixed-size collections</li>
  <li>Cache-friendly due to contiguous memory</li>
</ul>

<h2>⚠️ Disadvantages</h2>
<ul>
  <li>Fixed size - cannot grow or shrink dynamically</li>
  <li>Insertion and deletion are expensive (O(n))</li>
  <li>Wasted memory if array is not fully utilized</li>
</ul>

<h2>🎯 Practice Problems</h2>
<ol>
  <li>Find the maximum element in an array</li>
  <li>Reverse an array in place</li>
  <li>Find the second largest element</li>
  <li>Remove duplicates from a sorted array</li>
  <li>Rotate an array by k positions</li>
</ol>

<h2>📝 Summary</h2>
<p>Arrays are the foundation of data structures. Understanding arrays thoroughly is crucial for:</p>
<ul>
  <li>Building more complex data structures</li>
  <li>Solving algorithmic problems efficiently</li>
  <li>Optimizing program performance</li>
  <li>Preparing for technical interviews</li>
</ul>
`,

  'CSS Basics': `
<h1>CSS Basics - Styling the Web 🎨</h1>

<h2>What is CSS?</h2>
<p>CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of HTML documents. It controls how elements are displayed on screen, on paper, or in other media.</p>

<h2>🎯 Why CSS Matters</h2>
<ul>
  <li><strong>Separation of Concerns:</strong> Keep structure (HTML) separate from presentation (CSS)</li>
  <li><strong>Reusability:</strong> Style multiple pages with a single stylesheet</li>
  <li><strong>Maintainability:</strong> Easy to update and modify designs</li>
  <li><strong>Responsive Design:</strong> Adapt layouts for different screen sizes</li>
</ul>

<h2>📝 CSS Syntax</h2>
<pre><code>selector {
  property: value;
  another-property: another-value;
}</code></pre>

<p>Example:</p>
<pre><code>h1 {
  color: #FF69B4;
  font-size: 24px;
  text-align: center;
}</code></pre>

<h2>🔗 Adding CSS to HTML</h2>

<h3>1. Inline CSS (Not Recommended)</h3>
<pre><code>&lt;p style="color: blue; font-size: 16px;"&gt;Text&lt;/p&gt;</code></pre>

<h3>2. Internal CSS</h3>
<pre><code>&lt;head&gt;
  &lt;style&gt;
    p {
      color: blue;
      font-size: 16px;
    }
  &lt;/style&gt;
&lt;/head&gt;</code></pre>

<h3>3. External CSS (Recommended)</h3>
<pre><code>&lt;head&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;</code></pre>

<h2>🎨 Common CSS Properties</h2>

<h3>Text Styling</h3>
<pre><code>p {
  color: #333;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.6;
  text-align: center;
  text-decoration: underline;
}</code></pre>

<h3>Box Model</h3>
<pre><code>.box {
  width: 300px;
  height: 200px;
  padding: 20px;
  margin: 10px;
  border: 2px solid #FF69B4;
  background-color: #f0f0f0;
}</code></pre>

<h3>Layout</h3>
<pre><code>.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}</code></pre>

<h2>🎯 CSS Selectors</h2>

<table>
  <thead>
    <tr>
      <th>Selector</th>
      <th>Example</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Element</td>
      <td>p { }</td>
      <td>Selects all &lt;p&gt; elements</td>
    </tr>
    <tr>
      <td>Class</td>
      <td>.className { }</td>
      <td>Selects elements with class="className"</td>
    </tr>
    <tr>
      <td>ID</td>
      <td>#idName { }</td>
      <td>Selects element with id="idName"</td>
    </tr>
    <tr>
      <td>Universal</td>
      <td>* { }</td>
      <td>Selects all elements</td>
    </tr>
    <tr>
      <td>Descendant</td>
      <td>div p { }</td>
      <td>Selects all &lt;p&gt; inside &lt;div&gt;</td>
    </tr>
  </tbody>
</table>

<h2>🌈 Colors in CSS</h2>
<pre><code>/* Named colors */
color: red;

/* Hexadecimal */
color: #FF69B4;

/* RGB */
color: rgb(255, 105, 180);

/* RGBA (with transparency) */
color: rgba(255, 105, 180, 0.5);

/* HSL */
color: hsl(330, 100%, 71%);</code></pre>

<h2>📦 The Box Model</h2>
<p>Every HTML element is a box consisting of:</p>
<ul>
  <li><strong>Content:</strong> The actual content (text, images)</li>
  <li><strong>Padding:</strong> Space between content and border</li>
  <li><strong>Border:</strong> The edge of the element</li>
  <li><strong>Margin:</strong> Space outside the border</li>
</ul>

<pre><code>.element {
  width: 200px;        /* Content width */
  padding: 20px;       /* Space inside border */
  border: 5px solid;   /* Border thickness */
  margin: 10px;        /* Space outside border */
  
  /* Total width = 200 + 20*2 + 5*2 + 10*2 = 270px */
}</code></pre>

<h2>💡 Best Practices</h2>
<ul>
  <li>Use external stylesheets for better organization</li>
  <li>Keep selectors simple and specific</li>
  <li>Avoid inline styles</li>
  <li>Use classes over IDs for styling</li>
  <li>Organize CSS with comments</li>
  <li>Use meaningful class names</li>
  <li>Follow naming conventions (BEM, SMACSS)</li>
</ul>

<h2>🎓 Practice Exercises</h2>
<ol>
  <li>Create a card component with rounded corners and shadow</li>
  <li>Style a navigation menu with hover effects</li>
  <li>Build a simple button with different states</li>
  <li>Create a centered layout using Flexbox</li>
  <li>Style a form with proper spacing and alignment</li>
</ol>
`,

  'Simple Linear Regression': `
<h1>Linear Regression - Predictive Modeling 📈</h1>

<h2>Introduction</h2>
<p>Linear Regression is one of the most fundamental and widely-used machine learning algorithms. It's used to predict a continuous target variable based on one or more predictor variables.</p>

<h2>🎯 What is Linear Regression?</h2>
<p>Linear regression attempts to model the relationship between variables by fitting a linear equation to observed data. The simplest form, with one predictor variable, is called Simple Linear Regression.</p>

<h3>The Linear Equation</h3>
<pre><code>y = mx + b

Where:
- y = predicted value (dependent variable)
- x = input value (independent variable)
- m = slope (coefficient)
- b = y-intercept (constant)</code></pre>

<p>In machine learning notation:</p>
<pre><code>ŷ = θ₀ + θ₁x₁

Where:
- ŷ = predicted value
- θ₀ = bias/intercept
- θ₁ = weight/coefficient
- x₁ = feature/input</code></pre>

<h2>📊 Types of Linear Regression</h2>

<h3>1. Simple Linear Regression</h3>
<p>Uses one independent variable to predict the dependent variable.</p>
<pre><code>Example: Predicting house price based on size
Price = θ₀ + θ₁ × Size</code></pre>

<h3>2. Multiple Linear Regression</h3>
<p>Uses multiple independent variables.</p>
<pre><code>Example: Predicting house price based on multiple features
Price = θ₀ + θ₁×Size + θ₂×Bedrooms + θ₃×Age</code></pre>

<h2>🎓 How Does It Work?</h2>

<h3>Step 1: Collect Data</h3>
<p>Gather labeled data with features (X) and target values (y).</p>

<h3>Step 2: Plot the Data</h3>
<p>Visualize the relationship between variables using scatter plots.</p>

<h3>Step 3: Find the Best Fit Line</h3>
<p>The algorithm finds the line that minimizes the error between predicted and actual values.</p>

<h3>Step 4: Make Predictions</h3>
<p>Use the learned parameters to predict new values.</p>

<h2>📐 Cost Function (Mean Squared Error)</h2>
<p>We minimize the Mean Squared Error (MSE) to find the best parameters:</p>

<pre><code>MSE = (1/n) × Σ(yᵢ - ŷᵢ)²

Where:
- n = number of samples
- yᵢ = actual value
- ŷᵢ = predicted value</code></pre>

<h2>🔄 Gradient Descent</h2>
<p>An optimization algorithm used to minimize the cost function:</p>

<pre><code>Repeat until convergence:
  θⱼ = θⱼ - α × (∂J/∂θⱼ)

Where:
- α = learning rate
- J = cost function
- ∂J/∂θⱼ = partial derivative</code></pre>

<h2>💻 Implementation in Python</h2>

<h3>Using Scikit-learn</h3>
<pre><code>from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Get parameters
print(f"Slope: {model.coef_[0]}")
print(f"Intercept: {model.intercept_}")

# Evaluate
from sklearn.metrics import r2_score
score = r2_score(y_test, predictions)
print(f"R² Score: {score}")</code></pre>

<h2>📊 Evaluation Metrics</h2>

<h3>1. R² Score (Coefficient of Determination)</h3>
<ul>
  <li>Measures how well the model fits the data</li>
  <li>Range: 0 to 1 (higher is better)</li>
  <li>R² = 1 means perfect fit</li>
</ul>

<h3>2. Mean Absolute Error (MAE)</h3>
<pre><code>MAE = (1/n) × Σ|yᵢ - ŷᵢ|</code></pre>

<h3>3. Root Mean Squared Error (RMSE)</h3>
<pre><code>RMSE = √[(1/n) × Σ(yᵢ - ŷᵢ)²]</code></pre>

<h2>⚠️ Assumptions of Linear Regression</h2>
<ol>
  <li><strong>Linearity:</strong> Relationship between X and y is linear</li>
  <li><strong>Independence:</strong> Observations are independent</li>
  <li><strong>Homoscedasticity:</strong> Constant variance of residuals</li>
  <li><strong>Normality:</strong> Residuals are normally distributed</li>
  <li><strong>No Multicollinearity:</strong> Features are not highly correlated</li>
</ol>

<h2>💡 Advantages</h2>
<ul>
  <li>Simple to understand and interpret</li>
  <li>Fast to train</li>
  <li>Works well for linear relationships</li>
  <li>Provides probabilistic predictions</li>
  <li>Less prone to overfitting</li>
</ul>

<h2>⚠️ Limitations</h2>
<ul>
  <li>Assumes linear relationship</li>
  <li>Sensitive to outliers</li>
  <li>Cannot capture complex patterns</li>
  <li>Requires feature scaling</li>
</ul>

<h2>🎯 Real-World Applications</h2>
<ul>
  <li>House price prediction</li>
  <li>Sales forecasting</li>
  <li>Risk assessment</li>
  <li>Trend analysis</li>
  <li>Medical predictions (drug response)</li>
  <li>Financial modeling</li>
</ul>

<h2>🚀 Next Steps</h2>
<p>After mastering linear regression, explore:</p>
<ul>
  <li>Polynomial Regression (non-linear relationships)</li>
  <li>Ridge Regression (L2 regularization)</li>
  <li>Lasso Regression (L1 regularization)</li>
  <li>Elastic Net (combination of Ridge and Lasso)</li>
</ul>
`,
};

async function enhanceCourseContent() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let updatedCount = 0;

    // Get all courses
    const courses = await Course.find({});
    console.log(`📚 Found ${courses.length} courses\n`);

    for (const course of courses) {
      console.log(`\n📖 Processing: ${course.name}`);
      let courseUpdated = false;

      if (course.modules && course.modules.length > 0) {
        for (const module of course.modules) {
          if (module.lessons && module.lessons.length > 0) {
            for (const lesson of module.lessons) {
              // Check if this lesson has enhanced content
              if (enhancedLessons[lesson.title]) {
                console.log(`   ✨ Enhancing: ${lesson.title}`);
                lesson.content = enhancedLessons[lesson.title];
                courseUpdated = true;
              }
            }
          }
        }
      }

      if (courseUpdated) {
        await course.save();
        updatedCount++;
        console.log(`   ✅ Course updated`);
      } else {
        console.log(`   ⏭️  No enhancements needed`);
      }
    }

    console.log(`\n🎉 Enhanced content added successfully!`);
    console.log(`📊 Updated ${updatedCount} courses`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the script
enhanceCourseContent();
