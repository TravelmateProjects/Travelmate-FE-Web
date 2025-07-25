// Define a reusable User interface based on the backend User model
export interface User {
  _id: string;
  fullName: string;
  email: string;
  dob?: string;
  job?: string;
  phone?: string;
  address?: string;
  hometown?: string;
  cccd?: string;
  hobbies?: string[];
  description?: string;
  rate?: number;
  avatar?: { url?: string; publicId?: string };
  coverImage?: { url?: string; publicId?: string };
  travelStatus?: boolean;
  currentLocation?: string;
  payment?: string;
  connections?: string[];
  createdAt?: string;
  updatedAt?: string;
  gender?: string;
}
