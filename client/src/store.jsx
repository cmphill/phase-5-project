import { create } from 'zustand';


const useStore = create (set =>  ({
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

    items: [], 
    addItems: (item) => set(state => ({items: [...state.items, item]})),
    clearItems: () => set({items: []}),

    isFavoriteArticle: false,
    toggleIsFavoriteArticle: () => set((state) => ({isFavoriteArticle: !state.isFavoriteArticle})),
    favoriteArticles: [],
    deleteFavoriteArticle: (articleId) => set(state => ({favoriteArticles: state.favoriteArticles.filter((favoriteArticle) => favoriteArticle.id !== articleId)})),
    addFavoriteArticle: (newFavorite) => set(state => ({favoriteArticles: [...state.favoriteArticles, newFavorite]})), 

    isEditable: false,
    setIsEditable: () => set((state) => ({isEditable: state.isEditable})),

    

}))

export default useStore;