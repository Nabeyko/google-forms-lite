import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetFormByIdQuery, useSubmitResponseMutation } from '../app/api';
import QuestionRenderer from '../components/QuestionRenderer';

export default function FillFormPage() {
  const { id = '' } = useParams();

  const { data: form, isLoading, error } = useGetFormByIdQuery(id);

  const [submitResponse, { isLoading: isSubmitting }] =
    useSubmitResponseMutation();

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (questionId: string, value: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!form) return;

    const answersPayload = form.questions
      .map((question) => ({
        questionId: question.id,
        value: answers[question.id] || [],
      }))
      .filter((answer) => answer.value.length > 0);

    if (!answersPayload.length) {
      setSubmitError('Please answer at least one question.');
      return;
    }

    try {
      await submitResponse({
        formId: form.id,
        answers: answersPayload,
      }).unwrap();

      setIsSubmitted(true);
    } catch {
      setSubmitError('Failed to submit form. Please try again.');
    }
  };

  if (isLoading) {
    return <main className="p-6">Loading form...</main>;
  }

  if (error || !form) {
    return <main className="p-6">Form not found.</main>;
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Form submitted successfully!</h1>
          <p className="mt-2 text-gray-600">Your response has been saved.</p>

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
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">{form.title}</h1>

          {form.description && (
            <p className="mt-2 text-gray-600">{form.description}</p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          {form.questions.map((question) => (
            <QuestionRenderer
              key={question.id}
              question={question}
              value={answers[question.id] || []}
              onChange={(value: string[]) =>
                handleAnswerChange(question.id, value)
              }
            />
          ))}

          {submitError && (
            <p className="text-sm text-red-600">{submitError}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
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