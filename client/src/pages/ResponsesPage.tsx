import { Link, useParams } from "react-router-dom";
import { useGetFormByIdQuery, useGetResponsesQuery } from "../app/api";

export default function ResponsesPage() {
  const { id = "" } = useParams();

  const {
    data: form,
    isLoading: isFormLoading,
    error: formError,
  } = useGetFormByIdQuery(id);

  const {
    data: responses,
    isLoading: isResponsesLoading,
    error: responsesError,
  } = useGetResponsesQuery(id);

  if (isFormLoading || isResponsesLoading) {
    return <main className="p-6">Loading responses...</main>;
  }

  if (formError || responsesError || !form) {
    return <main className="p-6">Failed to load responses.</main>;
  }

  const questionMap: Record<string, string> = Object.fromEntries(
    form.questions.map((question) => [question.id, question.title]),
  );

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
          <h1 className="text-xl font-bold">Responses</h1>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">{form.title}</h1>

          {form.description && (
            <p className="mt-2 text-gray-600">{form.description}</p>
          )}

          <p className="mt-3 text-sm text-gray-500">
            Total responses: {responses?.length || 0}
          </p>
        </div>

        {!responses?.length ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium">No responses yet</p>
            <p className="mt-2 text-gray-500">
              Submitted answers will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div
                key={response.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-xl font-semibold">
                  Response {index + 1}
                </h2>

                <div className="space-y-3">
                  {response.answers.map((answer) => (
                    <div
                      key={answer.questionId}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <p className="font-medium text-gray-900">
                        {questionMap[answer.questionId] || "Unknown question"}
                      </p>

                      <p className="mt-2 text-gray-600">
                        {answer.value.length
                          ? answer.value.join(", ")
                          : "No answer"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
