export function baseReducer<T>(state: T, action: T): T {
    console.log(action, state)
    return action
}