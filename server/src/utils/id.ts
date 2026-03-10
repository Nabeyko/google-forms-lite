let formId = 1;
let questionId = 1;
let responseId = 1;

export const generateFormId = () => `form_${formId++}`;

export const generateQuestionId = () => `question_${questionId++}`;

export const generateResponseId = () => `response_${responseId++}`;