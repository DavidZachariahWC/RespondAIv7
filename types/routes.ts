// this file is used to define the routes of the app but is not being used because of type issues

export const Routes = {
  Home: '/Home' as const,
  Intro: '/Intro' as const,
  Settings: '/Settings' as const,
  Context: '/Context' as const,
  CasualChat: '/CasualChat' as const,
  Respond: '/Respond' as const,
  SignIn: '/SignIn' as const,
  SignUp: '/SignUp' as const,
} as const;

export type AppRoutes = typeof Routes[keyof typeof Routes];