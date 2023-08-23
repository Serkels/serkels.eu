//

import { Entity } from "@1/core";

//

interface Profile {
  id: number;
  firstname: string;
  lastname: string;
  university: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ExchangeProps {
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

export class Exchange extends Entity<ExchangeProps> {}
