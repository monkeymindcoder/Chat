export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string | null;
  email: string;
  lastActive: any; // ServerTimestamp
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: Record<string, {
    displayName: string;
    photoURL: string | null;
  }>;
  lastMessage?: string;
  updatedAt: any;
  createdAt: any;
}

export interface Message {
  id?: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  createdAt: any;
  type: 'user' | 'ai';
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
