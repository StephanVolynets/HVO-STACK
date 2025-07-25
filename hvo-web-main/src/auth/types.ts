import { UserProfileDTO } from "hvo-shared";

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type UserRole =
  | null
  | "ADMIN"
  | "VENDOR"
  | "STAFF"
  | "CREATOR"
  | "ADMIN_ASSISTANT"
  | "VENDOR_ASSISTANT"
  | "CREATOR_ASSISTANT";

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUserType;
  role: UserRole;
  profile: UserProfileDTO | null;
};

// ----------------------------------------------------------------------

type CanRemove = {
  login?: (email: string, password: string) => Promise<void>;
  // register?: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  //
  // loginWithGoogle?: () => Promise<void>;
  //
  confirmRegister?: (email: string, code: string) => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  resendCodeRegister?: (email: string) => Promise<void>;
  newPassword?: (email: string, code: string, password: string) => Promise<void>;
  updatePassword?: (password: string) => Promise<void>;
};

export type FirebaseContextType = CanRemove & {
  user: AuthUserType;
  profile: UserProfileDTO | null;
  role: UserRole;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  // loginWithGoogle: () => Promise<void>;
  // loginWithGithub: () => Promise<void>;
  // loginWithTwitter: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  signInWithToken: (token: string) => Promise<void>;
  verifyCurrentPassword: (password: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  // register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
};
