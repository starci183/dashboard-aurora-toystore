import { createContext } from "react";
import { SWRResponse } from "swr";

export interface ContextValue {
  meSwr: SWRResponse<any, any, any>;
}
export const RootContext = createContext<ContextValue | null>(null);
