export interface StoryEvent {
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface EventDetails {
  title: string;
  time: string;
  date: string;
  location: string;
  address: string;
  dressCode: string;
  icon: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface RSVPData {
  name: string;
  email: string;
  guests: number;
  dietary?: string;
  message?: string;
}

export interface GiftItem {
  name: string;
  description: string;
  price: string;
  image?: string;
  link: string;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TableData {
  id: string;
  number: number;
  capacity: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  shape: 'circle' | 'rectangle';
  type: 'guest' | 'novios' | 'aisle' | 'door';
}

export interface PreGuest {
  id: string;
  name: string;
  guests: number;
  companionNames: string[];
  tableNumber: number;
  confirmed: boolean;
}

export interface ConfirmedGuest {
  id: string;
  name: string;
  email: string;
  guests: number;
  dietary: string;
  message: string;
  songs: string;
  confirmedAt: string;
  tableNumber: number;
  checkedIn: boolean;
  checkedInAt: string;
}

export interface CombinedGuest {
  id: string;
  name: string;
  guests: number;
  companionNames: string[];
  tableNumber: number;
  confirmed: boolean;
  canceled: boolean;
  invitedCount: number;
  attendingCount: number;
  canceledCount: number;
  rsvpStatus: 'pendiente' | 'confirmo' | 'cancelo';
  checkedIn: boolean;
  checkedInAt: string;
  email?: string;
  dietary?: string;
  message?: string;
  songs?: string;
  confirmedAt?: string;
}

export interface FloorTable {
  id: string;
  number: number;
  label: string;
  capacity: number;
  x: number;
  y: number;
  guests: string[];
}
