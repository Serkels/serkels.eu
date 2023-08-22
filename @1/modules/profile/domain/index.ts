//

interface Profile {
  id: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Exchange {
  id: number;
  done: boolean;
  type: "proposal";
  is_online: boolean;
  when: Date;
  title: string;
  slug: string;
  location?: string;
  available_places: number;
  places: number;
  in_exchange_of?: Category;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  profile: Profile;
  category?: Category;
}
