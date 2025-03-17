import bcrypt from 'bcryptjs';

const users=[
    {
        username: "Admin User",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true
    }
]

export default users;