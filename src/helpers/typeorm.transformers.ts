// src/helpers/typeorm.transformers.ts
export const decimalToNumber = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value !== null ? Number(value) : null),
};
