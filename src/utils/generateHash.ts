import bcrypt, { hash } from 'bcrypt'

function generateHash(data: string){
    const hash = bcrypt.hashSync(data, 10);

    return hash;
}

export default generateHash