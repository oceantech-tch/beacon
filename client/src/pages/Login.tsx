import { useEffect } from "react";
import googleLogin from "../api/auth";

declare global {
    interface Window {
        handleCredentialResponse: (response: any) => void;
        google: any;
    }
}

const Login = () => {
    useEffect(()=> {
        window.handleCredentialResponse = async (response)=> {
            const res = await googleLogin(response.credential);
            console.log(res);
        };

        window.google.accounts.id.initialize({
            client_id: import.meta.env.GOOGLE_CLIENT_ID,
            callback: window.handleCredentialResponse
        });

        window.google.accounts.id.renderButton(
            document.getElementById("googleSignIn")!,
            { theme: "outline", size: "large" }
        );
    }, []);

    return <div id="googleSignIn"></div>;
};
export default Login;