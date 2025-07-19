
export const shouldShowPremiumPrompt = () => {
  const last = localStorage.getItem("campusplug-last-premium-prompt");
  if (!last) return true;

  const lastDate = new Date(last);
  const now = new Date();
  const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);

  return diffDays >= 2;
};

export const updatePremiumPromptDate = () => {
  localStorage.setItem("campusplug-last-premium-prompt", new Date().toISOString());
};
