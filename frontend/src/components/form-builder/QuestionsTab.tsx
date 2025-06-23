import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { Question, QuestionType } from "../../types/question.types";
import { QuestionCard } from "./QuestionCard";
import { AddQuestionPanel } from "./AddQuestionPanel";

interface QuestionsTabProps {
  questions: Question[];
  onAddQuestion: (type: QuestionType) => void;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onReorderQuestions: (dragIndex: number, dropIndex: number) => void;
}

export const QuestionsTab: React.FC<QuestionsTabProps> = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onReorderQuestions,
}) => {
  const questionCounts = questions.reduce((acc, question) => {
    acc[question.type] = (acc[question.type] || 0) + 1;
    return acc;
  }, {} as Record<QuestionType, number>);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            onUpdate={onUpdateQuestion}
            onDelete={onDeleteQuestion}
            onDuplicate={onDuplicateQuestion}
            onMove={onReorderQuestions}
          />
        ))}

        <AddQuestionPanel
          questionCounts={questionCounts}
          onAddQuestion={onAddQuestion}
        />
      </div>
    </DndProvider>
  );
};
