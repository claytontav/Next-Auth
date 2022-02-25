import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {
                
                const response = await fetch("http://localhost:3333/api/auth/signin", {
                    method: 'POST',                    
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password
                    }),
                });

                const user = await response.json();
                
                if(!user || !user.username || !user.email || !user.accessToken || !user.id){
                    return null;
                }

                return user;
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {

            const isSinIn = !!user;
            const actualDateInSeconds = Math.floor(Date.now() / 1000);

            //Tem que ser o mesmo tempo de expiração do token da api
            const tokenExpirationInSections = Math.floor(7 * 24 * 60 * 60);

            if(isSinIn){

                if(!user || !user.username || !user.email || !user.accessToken || !user.id){
                    return Promise.resolve({});
                }

                token.id = user.id;
                token.accessToken = user.accessToken;
                token.username = user.username;
                token.email = user.email;
                token.expiration = Math.floor(actualDateInSeconds + tokenExpirationInSections);

            }else{

                if(!token?.expiration) return Promise.resolve({});
                if(actualDateInSeconds > token.expiration) return Promise.resolve({});

            }          

            return Promise.resolve(token);
        },
        session: async ({ session, token }) => {

            if(!token?.accessToken || !token.id || !token.username || !token.email){
                return null;
            }

            session.accessToken = token.accessToken;
            session.user = {
                id: token.id,
                username: token.username,
                email: token.email
            }
            
            return {...session};
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        jwt: true,        
        maxAge: 7 * 24 * 60 * 60, //Tem que ser o mesmo tempo de expiração do token da api
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true
    }
});