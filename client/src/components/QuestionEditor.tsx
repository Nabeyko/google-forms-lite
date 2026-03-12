import { QuestionType } from "../types/enums";

export type DraftQuestion = {
  title: string;
  type: QuestionType;
  options: string[];
};

type Props = {
  index: number;
  question: DraftQuestion;
  canRemove: boolean;
  onRemove: () => void;
  onTitleChange: (value: string) => void;
  onTypeChange: (type: QuestionType) => void;
  onAddOption: () => void;
  onOptionChange: (optionIndex: number, value: string) => void;
  onRemoveOption: (optionIndex: number) => void;
};

export default function QuestionEditor({
  index,
  question,
  canRemove,
  onRemove,
  onTitleChange,
  onTypeChange,
  onAddOption,
  onOptionChange,
  onRemoveOption,
}: Props) {
  const showOptions =
    question.type === QuestionType.MULTIPLE_CHOICE ||
    question.type === QuestionType.CHECKBOX;

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Question {index + 1}
        </h3>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            Remove Question
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">
            Question Title
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 outline-none focus:border-black focus:bg-white transition-all"
            value={question.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="What do you want to ask?"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">
            Type
          </label>
          <select
            className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-3 outline-none focus:border-black focus:bg-white transition-all cursor-pointer"
            value={question.type}
            onChange={(e) => onTypeChange(e.target.value as QuestionType)}
          >
            {Object.values(QuestionType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showOptions && (
        <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-gray-700">
              Options
            </label>
            <button
              type="button"
              onClick={onAddOption}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-tight"
            >
              + Add Option
            </button>
          </div>

          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-gray-300 bg-white p-2.5 text-sm outline-none focus:border-black"
                  value={option}
                  onChange={(e) => onOptionChange(optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                />

                <button
                  type="button"
                  onClick={() => onRemoveOption(optionIndex)}
                  className="flex items-center justify-center rounded-lg border border-transparent px-3 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove option"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
