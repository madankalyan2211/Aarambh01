import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { FileText, Download, Bot, Loader2 } from 'lucide-react';
import { useToast } from './ui/toast';

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  onGradeSubmit: (score: number, feedback: string) => void;
  onAIAssist: () => void;
  totalPoints: number;
  initialScore?: number | null;
  initialFeedback?: string;
  aiGrading: boolean;
  aiFeedback?: any;
}

export function PDFViewer({
  fileUrl,
  fileName,
  isOpen,
  onClose,
  onGradeSubmit,
  onAIAssist,
  totalPoints,
  initialScore,
  initialFeedback,
  aiGrading,
  aiFeedback
}: PDFViewerProps) {
  const { showToast } = useToast();
  const [score, setScore] = useState(initialScore || 0);
  const [feedback, setFeedback] = useState(initialFeedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Construct the full URL for the PDF with improved logic
  const fullPdfUrl = fileUrl ? 
    (fileUrl.startsWith('http') ? fileUrl : `http://localhost:3001${fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`}`) : 
    '';

  const handleSubmit = async () => {
    if (score < 0 || score > totalPoints) {
      showToast('error', 'Invalid Score', `Score must be between 0 and ${totalPoints}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onGradeSubmit(score, feedback);
      onClose();
    } catch (error) {
      console.error('Error submitting grade:', error);
      showToast('error', 'Error', 'Failed to submit grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (!fullPdfUrl) {
      showToast('error', 'Error', 'No file URL provided');
      return;
    }
    
    // Create a temporary link for direct download
    const link = document.createElement('a');
    link.href = fullPdfUrl;
    link.download = fileName || 'submission.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {fileName}
            </DialogTitle>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="space-y-6">
            <div className="bg-secondary/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">PDF Submission</h3>
              <p className="text-sm text-muted-foreground mb-3">
                A PDF file has been submitted for this assignment. You can download it using the button above.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span>{fileName}</span>
              </div>
            </div>

            {/* Grading Panel */}
            <div>
              <h3 className="font-semibold mb-2">Grade Assignment</h3>
              <p className="text-sm text-muted-foreground">
                Provide a score and feedback for this submission.
              </p>
            </div>

            {/* Score Input */}
            <div className="space-y-2">
              <Label htmlFor="score">Score (0-{totalPoints} points)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max={totalPoints}
                value={score}
                onChange={(e) => setScore(Math.min(totalPoints, Math.max(0, Number(e.target.value))))}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 points</span>
                <span>{totalPoints} points</span>
              </div>
            </div>

            {/* Feedback Textarea */}
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Provide detailed feedback on the submission..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            {/* AI Assistance */}
            <div className="space-y-2">
              <Button
                onClick={onAIAssist}
                disabled={aiGrading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {aiGrading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    Get AI Assistance
                  </>
                )}
              </Button>

              {aiFeedback && (
                <Card className="p-3 bg-blue-50 dark:bg-blue-950/20">
                  <h4 className="font-semibold text-sm mb-1">AI Suggested Score: {aiFeedback.score}</h4>
                  <p className="text-xs">{aiFeedback.feedback}</p>
                  {aiFeedback.suggestions && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">Suggestions:</p>
                      <ul className="text-xs list-disc pl-4 space-y-1">
                        {aiFeedback.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-[#FF69B4] hover:bg-[#FF69B4]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Grade'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}