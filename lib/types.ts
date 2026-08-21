export type TravelCard = {
  title: string;
  time?: string;
  location?: string;
  address?: string;
  note?: string;
  source?: string;
};

export type TravelList = {
  title: string;
  cards: TravelCard[];
};

export type TravelBoard = {
  title: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  lists: TravelList[];
};
