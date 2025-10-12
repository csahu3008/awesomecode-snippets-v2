'use client';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
    const router = useRouter();
    const { data: session, status } = useSession();
    console.log("data",session)

    if (status === "loading") {
        return (
            <div style={{ display: "flex", justifyContent: "center", margin: "2rem" }}>
                <div className="spinner" />
                <style>{`
                    .spinner {
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #3498db;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // If the user is authenticated redirect to `/profile`
    if (session) {
        router.push("profile");
        return null;
    }

    return (
        <div style={{ margin: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <span>You are not authenticated.</span>
                <button
                    style={{
                        backgroundColor: "#3182ce",
                        color: "#fff",
                        padding: "0.5rem 1.5rem",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "1rem"
                    }}
                    onClick={() => signIn(undefined, { callbackUrl: "/profile" })}
                >
                    Sign in Test
                </button>
            </div>
        </div>
    );
}
