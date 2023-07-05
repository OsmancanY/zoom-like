import { createSlice } from "@reduxjs/toolkit";

interface authInitialState {
    userInfo:
      | undefined
      | {
          uid: string;
          email: string;
          name: string;
        };
   isDarkTheme:boolean,
  }


const initialState: authInitialState = {
    userInfo: undefined,
    isDarkTheme:false,
};

export const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers: {
            changeTheme: (state,action)=>{
                state.isDarkTheme = action.payload.isDarkTheme;
            },
            setUser: (state, action) => {
                state.userInfo = action.payload;
            }
        }
    }
);

export const { setUser,changeTheme} = authSlice.actions;