const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Extract text content from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} Extracted text content
 */
async function extractPDFText(filePath) {
  try {
    console.log('📄 Extracting text from PDF:', filePath);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error(`PDF file not found: ${filePath}`);
    }
    
    // Read PDF file
    const dataBuffer = await fs.readFile(filePath);
    
    // Parse PDF
    const data = await pdfParse(dataBuffer);
    
    console.log(`✅ Extracted ${data.text.length} characters from PDF`);
    return data.text;
  } catch (error) {
    console.error('❌ Error extracting PDF text:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Grade assignment content using Gemini AI
 * @param {string} content - Assignment content to grade
 * @param {object} assignment - Assignment details
 * @returns {Promise<object>} Grading result with score and feedback
 */
async function gradeAssignmentWithAI(content, assignment) {
  try {
    if (!genAI) {
      throw new Error('Gemini API key not configured');
    }
    
    console.log('🤖 Grading assignment with Gemini AI');
    console.log('  Content length:', content.length, 'characters');
    console.log('  Assignment:', assignment.title);
    
    // Initialize the model with a working model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    
    // Create grading prompt
    const prompt = `
    You are an expert educator grading a student assignment.
    
    Assignment Title: ${assignment.title}
    Assignment Description: ${assignment.description}
    Total Points: ${assignment.totalPoints}
    Passing Score: ${assignment.passingScore}
    
    Student Submission:
    ${content}
    
    Please provide:
    1. A numerical score out of ${assignment.totalPoints} points
    2. Detailed feedback explaining the score
    3. 3 specific suggestions for improvement
    
    Format your response as JSON:
    {
      "score": number,
      "feedback": string,
      "suggestions": string[]
    }
    
    Ensure the score is realistic and based on the content quality.
    `;

    console.log('📤 Sending request to Gemini API');
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📥 Received response from Gemini API');
    
    // Extract JSON from response
    let gradingResult;
    try {
      // Try to parse as JSON directly
      gradingResult = JSON.parse(text);
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*({.*?})\s*```/s);
      if (jsonMatch) {
        gradingResult = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not extract JSON from AI response');
      }
    }
    
    // Validate the result
    if (!gradingResult || typeof gradingResult.score !== 'number' || !gradingResult.feedback) {
      throw new Error('Invalid grading result format from AI');
    }
    
    // Ensure score is within valid range
    gradingResult.score = Math.max(0, Math.min(assignment.totalPoints, Math.round(gradingResult.score)));
    
    console.log('✅ AI grading completed successfully');
    return gradingResult;
  } catch (error) {
    console.error('❌ Error grading assignment with AI:', error);
    throw new Error(`AI grading failed: ${error.message}`);
  }
}

/**
 * Process PDF submission and grade it
 * @param {object} submission - Submission object with PDF attachments
 * @param {object} assignment - Assignment details
 * @returns {Promise<object>} Grading result
 */
async function processAndGradePDFSubmission(submission, assignment) {
  try {
    console.log('📄 Processing PDF submission for grading');
    console.log('  Submission ID:', submission._id);
    console.log('  Attachments:', submission.attachments.length);
    
    // Check if there are PDF attachments
    const pdfAttachments = submission.attachments.filter(att => 
      att.type === 'application/pdf' || att.name.toLowerCase().endsWith('.pdf')
    );
    
    if (pdfAttachments.length === 0) {
      throw new Error('No PDF attachments found in submission');
    }
    
    // For now, process only the first PDF attachment
    const pdfAttachment = pdfAttachments[0];
    // Fix the file path - the URL starts with /uploads/, so we need to construct the correct path
    const filePath = path.join(__dirname, '..', 'uploads', path.basename(pdfAttachment.url));
    
    console.log('  Processing PDF:', pdfAttachment.name);
    console.log('  File path:', filePath);
    
    // Extract text from PDF
    const pdfContent = await extractPDFText(filePath);
    
    // If PDF is empty, use a placeholder
    const contentToGrade = pdfContent.trim() || `[Note: PDF file "${pdfAttachment.name}" appears to be empty or contains no extractable text]`;
    
    // Grade the content
    const gradingResult = await gradeAssignmentWithAI(contentToGrade, assignment);
    
    return {
      ...gradingResult,
      pdfProcessed: true,
      pdfName: pdfAttachment.name,
      contentLength: pdfContent.length
    };
  } catch (error) {
    console.error('❌ Error processing PDF submission:', error);
    throw new Error(`PDF processing failed: ${error.message}`);
  }
}

module.exports = {
  extractPDFText,
  gradeAssignmentWithAI,
  processAndGradePDFSubmission
};