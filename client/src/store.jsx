import { create } from 'zustand';


const useStore = create (set =>  ({
    users: [],
    addUser: (user) => set(state => ({users: [...state.users, user]})),
    current_user : {},
    setCurrentUser: (state) => set({current_user: state}),
    logoutCurrentUser: () => set({current_user: null}),

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
    deleteFavoriteArticle: (favoriteId) => set(state => ({
        favoriteArticles: state.favoriteArticles.filter(favorite => favorite.id !== favoriteId)
        // const favoriteToDelete = state.favoriteArticles.find (
        //     favorite => favorite.articleId == articleId && favorite.user_id == userId)
        // let newFavoriteArticles = state.favoriteArticles.filter (
        //     favorite => favorite.id !== favoriteToDelete.id
        // )
        // return {favoriteArticles: newFavoriteArticles}
    })),
    addFavoriteArticle: (newFavorite) => set(state => ({favoriteArticles: [...state.favoriteArticles, newFavorite]})), 

    isEditable: false,
    setIsEditable: () => set((state) => ({isEditable: !state.isEditable})),


    isCurrentEventKey: false,
    setIsCurrentEventKey: (value) => set({isCurrentEventKey: value }),

    userNotes: [],
    userNoteText: null,
    setUserNoteText: (value) => set({userNoteText: value}),
    userNoteTitle: null,
    setUserNoteTitle: (value) => set({userNoteTitle: value}),
    setUserNotes: (value) => set(state => ({userNotes: [...state.userNotes, value]}))


    

}))

export default useStore;