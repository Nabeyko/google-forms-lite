import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateFormMutation } from "../app/api";
import QuestionEditor, {
  type DraftQuestion,
} from "../components/QuestionEditor";
import type { QuestionType } from "../types";

const createEmptyQuestion = (): DraftQuestion => ({
  title: "",
  type: "TEXT",
  options: [],
});

export default function NewFormPage() {
  const navigate = useNavigate();
  const [createForm, { isLoading, error }] = useCreateFormMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    createEmptyQuestion(),
  ]);

  const updateQuestionTitle = (index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === index ? { ...question, title: value } : question,
      ),
    );
  };

  const updateQuestionType = (index: number, type: QuestionType) => {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === index
          ? {
              ...question,
              type,
              options:
                type === "MULTIPLE_CHOICE" || type === "CHECKBOX"
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
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const addOption = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === questionIndex
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
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map((option, j) =>
                j === optionIndex ? value : option,
              ),
            }
          : question,
      ),
    );
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.filter((_, j) => j !== optionIndex),
            }
          : question,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }

    const cleanQuestions = questions
      .filter((question) => question.title.trim())
      .map((question) => ({
        title: question.title.trim(),
        type: question.type,
        options:
          question.type === "MULTIPLE_CHOICE" || question.type === "CHECKBOX"
            ? question.options.filter((option) => option.trim())
            : [],
      }));

    try {
      await createForm({
        title: title.trim(),
        description: description.trim(),
        questions: cleanQuestions,
      }).unwrap();

      navigate("/");
    } catch {
      setFormError("Failed to create form. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Create New Form</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter form title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter form description"
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Questions</h2>

              <button
                type="button"
                onClick={addQuestion}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Add Question
              </button>
            </div>

            {questions.map((question, index) => (
              <QuestionEditor
                key={index}
                index={index}
                question={question}
                canRemove={questions.length > 1}
                onRemove={() => removeQuestion(index)}
                onTitleChange={(value) => updateQuestionTitle(index, value)}
                onTypeChange={(type) => updateQuestionType(index, type)}
                onAddOption={() => addOption(index)}
                onOptionChange={(optionIndex, value) =>
                  updateOption(index, optionIndex, value)
                }
                onRemoveOption={(optionIndex) =>
                  removeOption(index, optionIndex)
                }
              />
            ))}
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          {Boolean(error) && (
            <p className="text-sm text-red-600">
              Something went wrong while saving the form.
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Form"}
            </button>

            <Link
              to="/"
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
