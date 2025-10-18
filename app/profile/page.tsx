'use client';
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";

export default function Home() {
    const { data: session, status } = useSession({ required: true });
    const [response, setResponse] = useState("{}");

    const getUserDetails = async (useToken: boolean) => {
        try {
            // const response = await axios({
            //     method: "get",
            //     url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/profile/",
            //     withCredentials: true,
            // });
            const response = await axios({
                method: "get",
                url: process.env.NEXT_PUBLIC_BACKEND_URL + "snippets/3/",
                headers: useToken ? {Authorization: "Bearer " + session?.access_token} : {},
            });
            setResponse(JSON.stringify(response.data));
        } catch (error: any) {
            setResponse(error.response.data);
        }
    };

    if (status === "loading") {
        return (
            <div style={{ textAlign: "center", margin: "2rem" }}>
                <span>Loading...</span>
            </div>
        );
    }

    if (session) {
        return (
            <div style={{ margin: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {/* <div>PK: {session.user.pk}</div> */}
                    {/* <div>Username: {session.user.username}</div> */}
                    {/* <div>Email: {session.user.email || "Not provided"}</div> */}
                    <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "4px", overflowX: "auto" }}>
                        {response}
                    </pre>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
                    <button
                        style={{ background: "#3182ce", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}
                        onClick={() => getUserDetails(true)}
                    >
                        User details (with token)
                    </button>
                    <button
                        style={{ background: "#ed8936", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}
                        onClick={() => getUserDetails(false)}
                    >
                        User details (without token)
                    </button>
                    <button
                        style={{ background: "#e53e3e", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        );
    }

    return <></>;
}
