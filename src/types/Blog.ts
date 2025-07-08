export interface Blog {
  _id: string;
  userId: string;
  content: string;
  address: string;
  images: { url: string; publicId: string; uploadedAt: Date }[];
  videos: { url: string; publicId: string; uploadedAt: Date }[];
  isAd: boolean;
  adTargetUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
