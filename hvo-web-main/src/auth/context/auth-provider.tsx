"use client";

import { useMemo, useEffect, useReducer, useCallback } from "react";
import {
  signOut,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import { AuthContext } from "./auth-context";
import { AuthUserType, ActionMapType, AuthStateType, UserRole } from "../types";
import { auth } from "@/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { useCookies } from "next-client-cookies";
import { getUserProfile } from "@/apis/user";
import { UserProfileDTO } from "hvo-shared";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";

const AUTH = auth;

enum Types {
  INITIAL = "INITIAL",
  PROFILE_REFRESH = "PROFILE_REFRESH",
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
    role?: UserRole;
    profile?: UserProfileDTO | null;
  };
  [Types.PROFILE_REFRESH]: {
    profile: UserProfileDTO;
  };
};

type Action = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
  role: null,
  profile: null,
};

const reducer = (state: AuthStateType, action: Action) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
      role: action.payload.role,
      profile: action.payload.profile,
    };
  } else if (action.type === Types.PROFILE_REFRESH) {
    return {
      ...state,
      profile: action.payload.profile,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const { set: setCookie, remove: removeCookie, get } = useCookies();
  const queryClient = useQueryClient();

  const initialize = useCallback(() => {
    try {
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          const idToken = await user.getIdToken();
          setCookie("__session", JSON.stringify({ idToken }));

          const tokenResult = await user.getIdTokenResult();
          const userRole = tokenResult.claims.role as UserRole;

          // Get user profile
          const userProfile = await getUserProfile(user.email!);

          dispatch({
            type: Types.INITIAL,
            payload: {
              user,
              role: userRole || null,
              profile: userProfile,
            },
          });
          // const userId = user.uid;
          // queryClient
          //   .fetchQuery({
          //     queryKey: ["user", userId],
          //     queryFn: async () => await getUser(userId),
          //   })
          //   .then((data) => {
          //     dispatch({
          //       type: Types.INITIAL,
          //       payload: {
          //         user: {
          //           id: user.uid,
          //           ...data,
          //         },
          //       },
          //     });
          //   })
          //   .catch((error) => {
          //     dispatch({
          //       type: Types.INITIAL,
          //       payload: {
          //         user: null,
          //       },
          //     });
          //   });
        } else {
          // Delete session from cookies
          const cookies = get("__session") || "";
          let session = {};
          if (cookies) {
            session = JSON.parse(cookies);
            delete session["idToken"];
          }
          setCookie("__session", JSON.stringify(session));

          dispatch({
            type: Types.INITIAL,
            payload: {
              user: null,
              role: null,
              profile: null,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(AUTH, email, password);
  }, []);

  // const loginWithGoogle = useCallback(async () => {
  //   const provider = new GoogleAuthProvider();

  //   await signInWithPopup(AUTH, provider);
  // }, []);

  // const loginWithGithub = useCallback(async () => {
  //   const provider = new GithubAuthProvider();

  //   await signInWithPopup(AUTH, provider);
  // }, []);

  // const loginWithTwitter = useCallback(async () => {
  //   const provider = new TwitterAuthProvider();

  //   await signInWithPopup(AUTH, provider);
  // }, []);

  const signInWithToken = useCallback(async (token: string) => {
    await signInWithCustomToken(AUTH, token);
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    await signOut(AUTH);
    router.replace(paths.auth.login);
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(AUTH, email);
  }, []);

  const verifyCurrentPassword = useCallback(
    async (password: string) => {
      if (!auth.currentUser?.email) throw new Error("No user email found");

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );

      try {
        await reauthenticateWithCredential(auth.currentUser!, credential);
        return true;
      } catch (error) {
        console.error("Error verifying password:", error);
        throw error;
      }
    },
    [state.user]
  );

  const _updatePassword = useCallback(
    async (password: string) => {
      await updatePassword(auth.currentUser!, password);
    },
    [state.user]
  );

  const refreshProfile = useCallback(async () => {
    if (state.user?.email) {
      try {
        const userProfile = await getUserProfile(state.user.email);
        console.log("GOt user profile", userProfile);
        dispatch({
          type: Types.PROFILE_REFRESH,
          payload: {
            profile: userProfile,
          },
        });
      } catch (error) {
        console.error("Failed to refresh profile:", error);
      }
    }
  }, [state.user?.email]);

  // ----------------------------------------------------------------------

  // const checkAuthenticated = state.user?.emailVerified ? "authenticated" : "unauthenticated";
  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      role: state.role || null,
      method: "firebase",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      //
      login,
      logout,
      // register,
      forgotPassword,
      signInWithToken,
      verifyCurrentPassword,
      updatePassword: _updatePassword,
      profile: state.profile || null,
      refreshProfile,
      // loginWithGoogle,
      // loginWithGithub,
      // loginWithTwitter,
    }),
    [
      state,
      status,
      state.user,
      //
      login,
      logout,
      // register,
      forgotPassword,
      signInWithToken,
      verifyCurrentPassword,
      _updatePassword,
      refreshProfile,
      // loginWithGithub,
      // loginWithGoogle,
      // loginWithTwitter,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
