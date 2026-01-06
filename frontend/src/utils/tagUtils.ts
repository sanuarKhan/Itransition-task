import type { Tag } from "../types";

export const getSafeTags = (tags: { tag: Tag }[] | Tag[], limit?: number) => {
  if (!Array.isArray(tags)) return [];

  const tagArray = tags.map((t) => ("tag" in t ? t.tag : t)).filter(Boolean);

  return limit ? tagArray.slice(0, limit) : tagArray;
};
