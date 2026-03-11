import { QuestionType } from "../types/enums";
import type { Question } from "../types";

type Props = {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
};

export default function QuestionRenderer({ question, value, onChange }: Props) {
  const handleCheckbox = (option: string, checked: boolean) => {
    if (checked) onChange([...value, option]);
    else onChange(value.filter((i) => i !== option));
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50">
      <label className="block text-xl font-bold mb-6 text-gray-800">
        {question.title}
      </label>

      {question.type === QuestionType.TEXT && (
        <input
          className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-2 text-lg transition-colors"
          placeholder="Your answer"
          value={value[0] || ""}
          onChange={(e) => onChange([e.target.value])}
        />
      )}

      {question.type === QuestionType.DATE && (
        <input
          type="date"
          className="w-full p-4 rounded-2xl border-2 border-gray-100 bg-white 
        text-gray-900 font-medium outline-none transition-all
        hover:border-gray-300 hover:bg-gray-50/50
        focus:border-black focus:ring-4 focus:ring-black/5

        [&::-webkit-calendar-picker-indicator]:cursor-pointer
        [&::-webkit-calendar-picker-indicator]:p-1
        [&::-webkit-calendar-picker-indicator]:hover:opacity-70
        [&::-webkit-calendar-picker-indicator]:transition-opacity"
          value={value[0] || ""}
          onChange={(e) => onChange([e.target.value])}
        />
      )}

      {(question.type === QuestionType.MULTIPLE_CHOICE ||
        question.type === QuestionType.CHECKBOX) && (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type={
                  question.type === QuestionType.MULTIPLE_CHOICE
                    ? "radio"
                    : "checkbox"
                }
                name={question.id}
                className="w-5 h-5 accent-black"
                checked={value.includes(option)}
                onChange={(e) =>
                  question.type === QuestionType.MULTIPLE_CHOICE
                    ? onChange([option])
                    : handleCheckbox(option, e.target.checked)
                }
              />
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
