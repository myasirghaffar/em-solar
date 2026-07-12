export interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  image: string;
}

export const LATEST_NEWS: NewsItem[] = [
  {
    id: "visit-china",
    title: "Visit to China",
    date: "September 10, 2024",
    tag: "AE Power",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80",
  },
  {
    id: "csr-ae-power",
    title: "CSR Activity at AE Power",
    date: "August 14, 2024",
    tag: "AE Power",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&q=80",
  },
  {
    id: "alliance-mcb",
    title: "Strategic Alliance with MCB",
    date: "July 29, 2024",
    tag: "AE Power",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1000&q=80",
  },
];
