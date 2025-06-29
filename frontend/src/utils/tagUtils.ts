export interface TagData {
  id: string;
  name: string;
}

export interface TagWithRelation {
  tag: TagData;
}

export type TagItem = TagData | TagWithRelation;

/**
 * Safely extract tag data from different tag structures
 * Handles both { tag: { id, name } } and { id, name } formats
 */
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

/**
 * Process an array of tags and return consistent TagData objects
 */
export const processTags = (tags: any[]): TagData[] => {
  if (!Array.isArray(tags)) {
    console.warn("processTags: Expected array, got:", typeof tags);
    return [];
  }

  return tags.map(extractTagData).filter((tag): tag is TagData => tag !== null);
};

/**
 * Get safe tags with a limit
 */
export const getSafeTags = (tags: any[], limit?: number): TagData[] => {
  const processedTags = processTags(tags);
  return limit ? processedTags.slice(0, limit) : processedTags;
};

/**
 * Check if a tag structure is valid
 */
export const isValidTagStructure = (tagItem: any): boolean => {
  return extractTagData(tagItem) !== null;
};

/**
 * Transform tags for API requests (converts to string array)
 */
export const tagsForAPI = (tags: TagData[]): string[] => {
  return tags.map((tag) => tag.name);
};

/**
 * Transform tags from API response to consistent format
 */
export const tagsFromAPI = (apiTags: any[]): TagData[] => {
  return processTags(apiTags);
};

/**
 * Debug function to log tag structure for troubleshooting
 */
export const debugTagStructure = (
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
