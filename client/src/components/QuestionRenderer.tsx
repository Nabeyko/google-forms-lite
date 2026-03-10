type Question = {
  id: string;
  title: string;
  type: 'TEXT' | 'DATE' | 'MULTIPLE_CHOICE' | 'CHECKBOX';
  options?: string[];
};

type Props = {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
};

export default function QuestionRenderer({
  question,
  value,
  onChange,
}: Props) {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...value, option]);
      return;
    }

    onChange(value.filter((item) => item !== option));
  };

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <label className="mb-3 block font-medium">{question.title}</label>

      {question.type === 'TEXT' && (
        <input
          className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
          value={value[0] || ''}
          onChange={(e) => onChange([e.target.value])}
          placeholder="Enter your answer"
        />
      )}

      {question.type === 'DATE' && (
        <input
          type="date"
          className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
          value={value[0] || ''}
          onChange={(e) => onChange([e.target.value])}
        />
      )}

      {question.type === 'MULTIPLE_CHOICE' && (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name={question.id}
                checked={value[0] === option}
                onChange={() => onChange([option])}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'CHECKBOX' && (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={(e) =>
                  handleCheckboxChange(option, e.target.checked)
                }
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}