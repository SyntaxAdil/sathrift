interface IUser{
    _id:string,
    name:string,
    image?:string | null,
    email:string,
    createdAt?:Date
}

export default IUser