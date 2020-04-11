interface IdleStatus {
  status: "idle"
}

interface LoadingStatus {
  status: "loading"
}

interface LoadedStatus<T> {
  status: "loaded"
  value: T
}

interface ErrorStatus {
  status: "error"
  message: string
}

export type Loadable<T = void> =
  | IdleStatus
  | LoadingStatus
  | LoadedStatus<T>
  | ErrorStatus

export const Loadable = {
  idle: { status: "idle" } as IdleStatus,
  loading: { status: "loading" } as LoadingStatus,
  loaded<T>(value: T) {
    return { status: "loaded", value } as LoadedStatus<T>
  },
  error(message: string) {
    return { status: "error", message } as ErrorStatus
  },
}
