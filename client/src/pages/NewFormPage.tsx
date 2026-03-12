import { useState } from "react";
import { Link } from "react-router-dom";
import { useCreateFormMutation } from "../app/api";
import QuestionEditor, {
  type DraftQuestion,
} from "../components/QuestionEditor";
import { QuestionType } from "../types/enums";
import { cleanQuestions, createEmptyQuestion } from "../utils/formHelpers";

export default function NewFormPage() {
  const [createForm, { isLoading }] = useCreateFormMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    createEmptyQuestion(),
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateQuestionTitle = (index: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, qIndex) =>
        qIndex === index ? { ...question, title: value } : question,
      ),
    );
  };

  const updateQuestionType = (index: number, type: QuestionType) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, qIndex) =>
        qIndex === index
          ? {
              ...question,
              type,
              options: [
                QuestionType.MULTIPLE_CHOICE,
                QuestionType.CHECKBOX,
              ].includes(type)
                ? question.options.length
                  ? question.options
                  : [""]
                : [],
            }
          : question,
      ),
    );
  };

  const addQuestion = () => {
    setQuestions((previousQuestions) => [
      ...previousQuestions,
      createEmptyQuestion(),
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((previousQuestions) =>
      previousQuestions.filter((_, questionIndex) => questionIndex !== index),
    );
  };

  const addOption = (questionIndex: number) => {
    setQuestions((previousQuestions) =>
      previousQuestions.map((question, index) =>
        index === questionIndex
          ? { ...question, options: [...question.options, ""] }
          : question,
      ),
    );
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions((previousQuestions) =>
      previousQuestions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, jIndex) =>
                jIndex === optionIndex ? value : option,
              ),
            }
          : question,
      ),
    );
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((previousQuestions) =>
      previousQuestions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.filter(
                (_, jIndex) => jIndex !== optionIndex,
              ),
            }
          : question,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Form title is required");
      return;
    }

    for (const question of questions) {
      if (!question.title.trim()) {
        setFormError("Each question must have a title");
        return;
      }
    }

    const cleanedQuestions = cleanQuestions(questions);

    try {
      await createForm({
        title: title.trim(),
        description: description.trim(),
        questions: cleanedQuestions,
      }).unwrap();
      setIsSubmitted(true);
    } catch (caughtError: unknown) {
      let message = "Something went wrong";

      if (
        typeof caughtError === "object" &&
        caughtError !== null &&
        "data" in caughtError
      ) {
        const errorWithData = caughtError as {
          data?: {
            errors?: Array<{ message?: string }>;
          };
        };

        message = errorWithData.data?.errors?.[0]?.message || message;
      } else if (caughtError instanceof Error) {
        message = caughtError.message;
      }

      setFormError(message);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Form published!</h1>
          <p className="mt-2 text-gray-600">
            Your new form is live and ready to accept responses.
          </p>

          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
          >
            Back to forms
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold">Create New Form</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <input
              type="text"
              placeholder="Untitled Form"
              className="w-full text-3xl font-bold outline-none placeholder:text-gray-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Form description"
              className="mt-4 w-full text-lg outline-none placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionEditor
                key={index}
                index={index}
                question={question}
                canRemove={questions.length > 1}
                onRemove={() => removeQuestion(index)}
                onTitleChange={(val) => updateQuestionTitle(index, val)}
                onTypeChange={(type) => updateQuestionType(index, type)}
                onAddOption={() => addOption(index)}
                onOptionChange={(optIdx, val) =>
                  updateOption(index, optIdx, val)
                }
                onRemoveOption={(optIdx) => removeOption(index, optIdx)}
              />
            ))}
          </div>

          {formError && (
            <p className="text-red-600 text-sm font-medium">{formError}</p>
          )}

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={addQuestion}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-medium hover:bg-gray-50 transition-colors"
            >
              + Add Question
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-black px-10 py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isLoading ? "Saving..." : "Publish Form"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
