export interface TagData {
  id: string;
  name: string;
}

export interface TagWithRelation {
  tag: TagData;
}

export type TagItem = TagData | TagWithRelation;

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractTagData = (tagItem: any): TagData | null => {
  try {
    // Handle structure: { tag: { id, name } }
    if (tagItem?.tag && typeof tagItem.tag === "object") {
      const { id, name } = tagItem.tag;
      if (id && name) {
        return { id, name };
      }
    }

    // Handle structure: { id, name }
    if (tagItem?.id && tagItem?.name) {
      return {
        id: tagItem.id,
        name: tagItem.name,
      };
    }

    return null;
  } catch (error) {
    console.warn("Error extracting tag data:", tagItem, error);
    return null;
  }
};

//eslint-disable-next-line
export const processTags = (tags: any[]): TagData[] => {
  if (!Array.isArray(tags)) {
    console.warn("processTags: Expected array, got:", typeof tags);
    return [];
  }

  return tags.map(extractTagData).filter((tag): tag is TagData => tag !== null);
};

//eslint-disable-next-line
export const getSafeTags = (tags: any[], limit?: number): TagData[] => {
  const processedTags = processTags(tags);
  return limit ? processedTags.slice(0, limit) : processedTags;
};

//eslint-disable-next-line
export const isValidTagStructure = (tagItem: any): boolean => {
  return extractTagData(tagItem) !== null;
};

export const tagsForAPI = (tags: TagData[]): string[] => {
  return tags.map((tag) => tag.name);
};

//eslint-disable-next-line
export const tagsFromAPI = (apiTags: any[]): TagData[] => {
  return processTags(apiTags);
};

export const debugTagStructure = (
  //eslint-disable-next-line
  tags: any[],
  context: string = "unknown"
): void => {
  if (process.env.NODE_ENV === "development") {
    console.group(`🏷️ Tag Structure Debug - ${context}`);
    console.log("Raw tags:", tags);
    console.log("Is Array:", Array.isArray(tags));
    console.log("Length:", tags?.length);

    if (Array.isArray(tags) && tags.length > 0) {
      console.log("First item:", tags[0]);
      console.log("First item structure:", Object.keys(tags[0] || {}));
      console.log("Processed first item:", extractTagData(tags[0]));
    }

    const processed = processTags(tags);
    console.log("Processed tags:", processed);
    console.groupEnd();
  }
};
