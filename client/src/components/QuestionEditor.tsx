import type { QuestionType } from '../types';

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
    question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOX';

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Question {index + 1}</h3>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Question Title</label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
          value={question.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter question title"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Type</label>
        <select
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
          value={question.type}
          onChange={(e) => onTypeChange(e.target.value as QuestionType)}
        >
          <option value="TEXT">Text</option>
          <option value="DATE">Date</option>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="CHECKBOX">Checkbox</option>
        </select>
      </div>

      {showOptions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Options</label>

            <button
              type="button"
              onClick={onAddOption}
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
            >
              Add Option
            </button>
          </div>

          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
                value={option}
                onChange={(e) => onOptionChange(optionIndex, e.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
              />

              <button
                type="button"
                onClick={() => onRemoveOption(optionIndex)}
                className="rounded-lg border border-red-300 px-3 text-red-600 hover:bg-red-50"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}