"use server";

export const fetchExercises = async () => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/exercises`);
  if (!response.ok) throw new Error("Failed to fetch exercises");
  const data = await response.json();
  return data.data;
};
