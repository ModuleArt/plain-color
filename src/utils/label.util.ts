export const sanitizeLabel = (label: string) => {
  return label.trim().replace(/\s\s+/g, ' ')
}
