import {packsAPI} from "../api/packs-api";
import {handleServerNetworkError} from "../utils/error-utils";
import {setAppStatus, SetAppStatusActionType} from "./app-reducer";
import {AppThunkType, RootStateType} from "./store";

type InitStateType = {
    cardPacks: PackType[],
    minCardsCount: number,
    maxCardsCount: number,
    queryParams: {
        pageCount: number, // кол-во на странице
        page: number, // текущая
        min: number, // кол-во карт от
        max: number, //кол-во карт до
        user_id: string, // для фильтрации карточек мои / не мои
        packName: string, //для поиска
        sortPacks: string, // для сортировки 0 | 1 и рядом пишем имя поля которое сортируем
    }
}

const initState = {
    cardPacks: [],
    minCardsCount: 0,
    maxCardsCount: 0,
    queryParams: {
        pageCount: 10, // кол-во на странице
        page: 1, // текущая
        min: 0, // кол-во карт от
        max: 10, //кол-во карт до
        user_id: '', // для фильтрации карточек мои / не мои
        packName: '', //для поиска
        sortPacks: '', // для сортировки 0 | 1 и рядом пишем имя поля которое сортируем
    }
};

export const PacksReducer = (state: InitStateType = initState, action: PacksActionsType): InitStateType => {
    switch (action.type) {
        case 'PACKS/SET-PACKS':
            return {...state, cardPacks: action.payload.cardPacks}
        case 'PACKS/SET-SEARCH':
            return {
                ...state, queryParams: {...state.queryParams, packName: action.payload}
            }
        case 'SET_USER_ID':
            return {
                ...state,
                queryParams: {...state.queryParams, user_id: action.payload},
            };
        default: {
            return state;
        }
    }
};

// AC
export const setPacks = (data: PacksType) => ({type: 'PACKS/SET-PACKS', payload: {...data}} as const)
export const setSearch = (packName: string) => ({type: 'PACKS/SET-SEARCH', payload: packName} as const)
export const setUserId = (user_id: string) => ({type: 'SET_USER_ID', payload: user_id} as const);


//types
export type PackType = {
    _id: string;
    user_id: string | null;
    name: string;
    user_name: string;
    cardsCount: number;
    created: string;
    updated: string;
    grade: number;
    rating: number;
    shots: number;
}
type PacksType = {
    cardPacks: PackType[];
    cardPacksTotalCount: number;
    maxCardsCount: number;
    minCardsCount: number;
}
// type InitStateType = typeof initState;
type SetPacksType = ReturnType<typeof setPacks>;
type SetSearchType = ReturnType<typeof setSearch>
type SetUserIdType = ReturnType<typeof setUserId>
// type ResetUserIdType = ReturnType<typeof resetUserId>

type PacksActionsType = SetPacksType | SetAppStatusActionType | SetSearchType | SetUserIdType


//thunks
export const getPacks = (userId?: string): AppThunkType => async (dispatch, getState: () => RootStateType) => {
    dispatch(setAppStatus('loading'))
    console.log(userId)
    console.log(getState().packs)
    try {
        const {pageCount, page, min, max, packName, sortPacks} = getState().packs.queryParams
        console.log({user_id: userId ? userId : ''})
        const res = await packsAPI.getPacks({
            pageCount,
            page,
            min,
            max,
            user_id: userId ? userId : '',
            packName,
            sortPacks
        })
        console.log(res.data)
        dispatch(setPacks(res.data));
        dispatch(setAppStatus('succeeded'))
    } catch (e) {
        dispatch(setAppStatus('failed'))
    } finally {
        dispatch(setAppStatus('idle'))
    }
}
export const deletePack = (packId: string): AppThunkType => async (dispatch) => {
    dispatch(setAppStatus('loading'));
    try {
        await packsAPI.deletePack(packId);
        dispatch(getPacks());
        dispatch(setAppStatus('succeeded'));
    } catch (err: any) {
        handleServerNetworkError(err.response.data.error, dispatch);
        dispatch(setAppStatus('failed'))
    }
};
export const createdPack = (name: string): AppThunkType => async (dispatch) => {
    dispatch(setAppStatus('loading'));
    try {
        await packsAPI.createPack(name);
        dispatch(getPacks());
        dispatch(setAppStatus('succeeded'));
    } catch (err: any) {
        handleServerNetworkError(err.response.data.error, dispatch);
        dispatch(setAppStatus('failed'))
    }
};
export const updatedPack = (id: string, name: string): AppThunkType => async (dispatch) => {
    dispatch(setAppStatus('loading'));
    try {
        await packsAPI.updatedPack(id, name);
        dispatch(getPacks());
        dispatch(setAppStatus('succeeded'));
    } catch (err: any) {
        handleServerNetworkError(err.response.data.error, dispatch);
        dispatch(setAppStatus('failed'))
    }
};
