import { Link } from 'react-router-dom';
import { useGetFormsQuery } from '../app/api';

export default function HomePage() {
  const { data: forms, isLoading, error } = useGetFormsQuery();

  if (isLoading) {
    return <main className="p-6 text-lg">Loading forms...</main>;
  }

  if (error) {
    return (
      <main className="p-6 text-lg text-red-600">
        Failed to load forms.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Google Forms Lite
            </h1>
            <p className="mt-2 text-gray-600">
              Create forms, fill them, and view responses.
            </p>
          </div>

          <Link
            to="/forms/new"
            className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:opacity-90"
          >
            Create New Form
          </Link>
        </div>

        {!forms?.length ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-lg font-medium text-gray-800">No forms yet</p>
            <p className="mt-2 text-gray-500">
              Create your first form to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {form.title}
                </h2>

                {form.description && (
                  <p className="mt-2 text-gray-600">{form.description}</p>
                )}

                <p className="mt-3 text-sm text-gray-500">
                  Questions: {form.questions.length}
                </p>

                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/forms/${form.id}/fill`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Fill Form
                  </Link>

                  <Link
                    to={`/forms/${form.id}/responses`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    View Responses
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}