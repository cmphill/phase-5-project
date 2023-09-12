import { create } from 'zustand';


const useStore = create(set =>  ({
    users: [],
    addUser: (user) => set(state => ({users: [...state.users, user]})),
    current_user : [],
    setCurrentUser: (user) => set(({current_user: user})),
    logoutCurrentUser: () => set(({current_user: null})),

    loginErrors: [],
    addLoginErrors: (error) => set(state => ({loginErrors: [...state.loginErrors, error]})),
    clearLoginErrors: () => set({loginErrors: []}),

    signupErrors: [],
    addSignupErrors: (error) => set(state => ({signupErrors: [...state.signupErrors, error]})),
    clearSignupErrors: () => set({signupErrors: []}),

}))

export default useStore;