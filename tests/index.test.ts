
const axios2 = require("axios");
const BACKEND_URL = "http://localhost:3000";


const axios = {
    post: async (...args) => {
        try {
            const res = await axios2.post(...args);
            return res;
        } catch (e) {
            return e.response;
        }
    },
    get: async (...args) => {
        try {
            const res = await axios2.get(...args);
            return res;
        } catch (e) {
            return e.response;
        }
    },
    put: async (...args) => {
        try {
            const res = await axios2.put(...args);
            return res;
        } catch (e) {
            return e.response;
        }
    },
    delete: async (...args) => {
        try {
            const res = await axios2.delete(...args);
            return res;
        } catch (e) {
            return e.response;
        }
    },
};


describe("Authentication", () => {
    test("Authentication done only once", async () => {
        const username = "Akarsh" + Math.random();
        const password = "12341234";
        const res = await axios.post(`${BACKEND_URL}/signup`, {
            username,
            password
        })
        // console.log(res.data);
        expect(res.status).toBe(200);
        const res2 = await axios.post(`${BACKEND_URL}/signup`, {
            username,
            password
        })
  
        expect(res2.status).toBe(411);

    })
    test("Authentication done with only correct credentials", async () => {
        const username = "Akarsh" + Math.random();
        const password = "12341234";
        const res = await axios.post(`${BACKEND_URL}/signup`, {
            username,
            password
        })
        
       
        const res2 = await axios.post(`${BACKEND_URL}/signin`, {
            username,
            password
        })
  
        expect(res2.status).toBe(200);
        const username2="Akarsh"+Math.random();
        const res3 = await axios.post(`${BACKEND_URL}/signin`, {
            username2,
            password
        })
  
        expect(res3.status).toBe(403);

    })
})

describe("Space Queries",()=>{
    test("False user can not fetch space", async ()=>{
        const username="Akarsh"+Math.random();
        const password="123123";

        const res=await axios.get(`${BACKEND_URL}/space`);
        expect(res.status).toBe(403);
    })
    test("Only user can fetch space", async ()=>{
        const username="Akarsh"+Math.random();
        const password="123123213";
        const user= await axios.post(`${BACKEND_URL}/signup`,{
            username,
            password
        })
         const userSignInResponse= await axios.post(`${BACKEND_URL}/signin`,{
            username,
            password
        })
    
        const space=await axios.post(`${BACKEND_URL}/space`,{
            language:"cpp",
        },
        {
            headers:{"authorization":userSignInResponse.data.token}}
        )
     
        const res=await axios.get(`${BACKEND_URL}/space`,
            {
                headers:{"authorization":userSignInResponse.data.token}
            }
            );
      
        expect(res.status).toBe(200);
    })
    test("Only user can create space", async ()=>{
        const username="Akarsh"+Math.random();
        const password="123123213";
        const user= await axios.post(`${BACKEND_URL}/signup`,{
            username,
            password
        })
         const userSignInResponse= await axios.post(`${BACKEND_URL}/signin`,{
            username,
            password
        })
    
        const space=await axios.post(`${BACKEND_URL}/space`,{
            language:"cpp",
        },
        {
            headers:{"authorization":userSignInResponse.data.token}}
        )
     
       
        expect(space.status).toBe(200);
    })
    test("Only user can delete space", async ()=>{
        const username="Akarsh"+Math.random();
        const password="123123213";
        const user= await axios.post(`${BACKEND_URL}/signup`,{
            username,
            password
        })
         const userSignInResponse= await axios.post(`${BACKEND_URL}/signin`,{
            username,
            password
        })
        const token=userSignInResponse.data.token;

        const space=await axios.post(`${BACKEND_URL}/space`,{
            language:"cpp",
        },
        {
            headers:{"authorization":token}
        }
        )
    
        const deleteSpaceResponse= await axios.delete(`${BACKEND_URL}/space/${space.data.id}`,
        {
            headers:{"authorization":token}
        }
        )
    
        expect(deleteSpaceResponse.status).toBe(200);
    })
    test("User can add another user to it's code space", async ()=>{
        const username="Akarsh"+Math.random();
        const password="123345234";
        const user=await axios.post(`${BACKEND_URL}/signup`,{
            username,
            password
        })

        const userSignInResponse=await axios.post(`${BACKEND_URL}/signin`,{
            username,
            password
        })
        const username2="Akars6h"+Math.random();
        const password2="231231311";
        const user2=await axios.post(`${BACKEND_URL}/signup`,{
            username:username2,
            password:password2
        })
       
        const userSignInResponse2=await axios.post(`${BACKEND_URL}/signin`,{
            username:username2,
            password:password2
        })
        const token1=userSignInResponse.data.token;
        const token2=userSignInResponse2.data.token;
        const spaceCreateResponse= await axios.post(`${BACKEND_URL}/space`,{
            language:"python"
        },{
            headers:{
                "authorization":token1
            }
        })
      
        const addUserToSpaceResponse= await axios.post(`${BACKEND_URL}/space/addUser`,{
            userId:userSignInResponse2.data.id,
            spaceId:spaceCreateResponse.data.id,
            role:"VIEWER"
        },{
            headers:{
                "authorization":token1
            }
        })
        const fetchSpaceToConfirm= await axios.get(`${BACKEND_URL}/space`,{
            headers:{
                "authorization":token1
            }
        })
        
        const spaces = fetchSpaceToConfirm.data.spaces;

// user2 id (from signin response)
const user2Id = userSignInResponse2.data.id;


const space = spaces.find((s) => s.id === spaceCreateResponse.data.id);

expect(space).toBeDefined();

expect(space?.members.some(m => m.userId === user2Id)).toBe(true);
        expect(addUserToSpaceResponse.status).toBe(200);
    })
})
describe("User Queries",()=>{
    let username="";
    let password="";
    let username2="";
    let password2="";
    let userSignupResponse;
    let userSignupResponse2;
    let userSignInResponse;
    let userSignInResponse2;
    let userId1="";
    let userId2="";
    let token1="";
    let token2="";
    let spaceId="";
    beforeEach(async ()=>{
         username="Akarsh"+Math.random();
         password="123345234";
         userSignupResponse=await axios.post(`${BACKEND_URL}/signup`,{
            username,
            password
        })

         userSignInResponse=await axios.post(`${BACKEND_URL}/signin`,{
            username,
            password
        })
        userId1=userSignInResponse.data.id;
         username2="Akars6h"+Math.random();
         password2="231231311";
         userSignupResponse2=await axios.post(`${BACKEND_URL}/signup`,{
            username:username2,
            password:password2
        })
       
         userSignInResponse2=await axios.post(`${BACKEND_URL}/signin`,{
            username:username2,
            password:password2
        })
         token1=userSignInResponse.data.token;
         token2=userSignInResponse2.data.token;
            const space=await axios.post(`${BACKEND_URL}/space`,{
            language:"cpp",
        },
        {
            headers:{"authorization":token1}
        }
        )
        userId2=userSignInResponse2.data.id;
        spaceId=space.data.id;
         const addUserToSpaceResponse= await axios.post(`${BACKEND_URL}/space/addUser`,{
            userId:userId2,
            spaceId:spaceId,
            role:"VIEWER"
        },{
            headers:{
                "authorization":token1
            }
        })
    })
    test("Authorized User can fetch Metadata",async()=>{
        const response= await axios.get(`${BACKEND_URL}/user/metadata`,{
            headers:{
                "authorization":token1
            }
        })

        expect(response.status).toBe(200);
    })
    test("Unauthorized User can not fetch Metadata",async()=>{
        const response= await axios.get(`${BACKEND_URL}/user/metadata`,{
            headers:{
                "authorization":"fsdfjiks"
            }
        })

        expect(response.status).toBe(403);
    })
    test("Authorized User can change Metadata but it should be unique",async()=>{
        const updatedUsername=username+Math.random();
        const response= await axios.post(`${BACKEND_URL}/user/metadata`,{
            username:updatedUsername

            },{
            headers:{
                "authorization":token1
            }}
        )

        expect(response.status).toBe(200);
    })
    test("Authorized User can not change Metadata if it is not unique",async()=>{
        const updatedUsername=username+Math.random();
        const response= await axios.post(`${BACKEND_URL}/user/metadata`,{
            username:username2

            },{
            headers:{
                "authorization":token1
            }}
        )
      
        expect(response.status).toBe(403);
    })
    test("Unauthorized User can not change Metadata",async()=>{
        const updatedUsername=username+Math.random();
        const response= await axios.get(`${BACKEND_URL}/user/metadata`,{
            username:updatedUsername

            },{
            headers:{
                "authorization":"fsdfjiks"
            }
        })

        expect(response.status).toBe(403);
    })
    test("User can not change role of another user if it is not OWNER or member of that space", async()=>{
        const response=await axios.post(`${BACKEND_URL}/user/changeRole`,{
            spaceId:spaceId,
            userId:userId1,
            role:"EDITOR"
        },{
            headers:{
                "authorization":token2
            }
        })

        expect(response.status).toBe(403);
    })
    test("User can change role of another user if it is OWNER ", async()=>{
        const response=await axios.post(`${BACKEND_URL}/user/changeRole`,{
            spaceId:spaceId,
            userId:userId2,
            role:"EDITOR"
        },{
            headers:{
                "authorization":token1
            }
        })

        expect(response.status).toBe(200);
    })
    test("User can fetch friends",async ()=> {
        const response=await axios.get(`${BACKEND_URL}/user/friends`,{
            headers:{
                "authorization":token1
            }
        })
     
        expect(response.status).toBe(200);
    })
    test("User can add friends",async ()=> {
        const response=await axios.post(`${BACKEND_URL}/user/friends`,{
            userId:userId2
        },{
            headers:{
                "authorization":token1
            }
        })
        
       
          const response2=await axios.get(`${BACKEND_URL}/user/friends`,{
            headers:{
                "authorization":token1
            }
        })
      
        expect(response2.status).toBe(200);
    })
    test("User can delete friends",async ()=> {
        const response1=await axios.post(`${BACKEND_URL}/user/friends`,{
            userId:userId2
        },{
            headers:{
                "authorization":token1
            }
        })
        
       
        const response=await axios.post(`${BACKEND_URL}/user/deletefriends`,{
            userId:userId2
        },{
            headers:{
                "authorization":token1
            }
        })
         const response2=await axios.get(`${BACKEND_URL}/user/friends`,{
            headers:{
                "authorization":token1
            }
        })
     
        
        console.log(response.data)
        expect(response2.data.friends.length).toBe(0);
        expect(response.status).toBe(200);
    })
})
describe("Websocket Queries",()=>{
    
})