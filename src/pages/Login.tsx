import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiImage, EuiPanel, EuiProvider, EuiSpacer, EuiText, EuiTextColor } from '@elastic/eui'
import React from 'react';
import animation from "../assets/animation.gif";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { firebaseAuth, userRef } from '../utils/FirebaseConfig';
import { addDoc, getDocs, query,where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setUser } from '../app/slices/AuthSlice';

function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    onAuthStateChanged(firebaseAuth,(currentUser)=>{
        if(currentUser) navigate("/")
    })

    const login = async () => {
        const provider = new GoogleAuthProvider();
        const {user:{displayName,email,uid},}
         = await signInWithPopup(firebaseAuth,provider);
         if (email) {
            const firestoreQuery = query(userRef,where("uid","==",uid));
            const fetchedUsers = await getDocs(firestoreQuery);
            if (fetchedUsers.docs.length===0) {
                await addDoc(userRef,{
                    uid,
                    name: displayName,
                    email,
                });
            }
         }
        dispatch(setUser({uid,name:displayName,email}))
       navigate("/");
    }

    return (
        <EuiProvider colorMode="dark">
            <EuiFlexGroup alignItems='center' justifyContent='center'
                style={{ width: "100vw", height: "100vh" }}>
                <EuiFlexItem grow={false}>
                    <EuiPanel paddingSize='xl'>
                        <EuiFlexGroup justifyContent='center' alignItems='center'>
                            <EuiFlexItem>
                                <EuiImage src={animation} alt='logo' />
                            </EuiFlexItem>
                            <EuiSpacer size='xs' />
                            <EuiButton size='m' fill onClick={login}>Login with Google</EuiButton>
                            <EuiSpacer size='xl' />
                        </EuiFlexGroup>

                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiProvider>
    )
}

export default Login