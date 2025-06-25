export interface IUserStatistics {
  questions_created: number;
  collections_created: number;
  shared_items_count: number;
  favorites_count: number;
  total_responses: number;
  correct_responses: number;
  accuracy_percentage: number;
  recent_questions: IRecentQuestion[];
  recent_collections: IRecentCollection[];
  most_used_tags: IMostUsedTag[];
  collections_with_access?: number;
  questions_with_access?: number;
}

export interface IRecentQuestion {
  id: string;
  title: string;
  statment: string;
  date: string;
  author_name: string;
  tags: string[];
  is_liked: boolean;
  profile_picture: string;
  type: string;
  is_owned: boolean;
}

export interface IRecentCollection {
  id: string;
  title: string;
  statment: string;
  date: string;
  author_name: string;
  tags: string[];
  is_liked: boolean;
  profile_picture: string;
  type: string;
  is_owned: boolean;
}

export interface IMostUsedTag {
    id: string;
    name: string;
    usage_count: number;
  }
