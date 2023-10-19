export const fieldsCompletionProgress = (requiredFields: (string | number | boolean | null)[]) => {
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionProgressText = `(${completedFields}/${totalFields})`;
  return {
    totalFields,
    completedFields,
    completionProgressText: completionProgressText
  };
}