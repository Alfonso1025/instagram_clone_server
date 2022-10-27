class  Curso{
    constructor (titulo, dificultad){
        this.titulo = titulo
        this._dificultad = dificultad
        this.lecciones = []
    }
    get dificultad(){
        return this._dificultad
    }
    set dificultad(nuevaDificultad){
        if(nuevaDificultad === 4){
            this._dificultad = nuevaDificultad
        }
        else {
            console.log('no es 4')
        }
        
    }
    agregarLeccion(leccion){
        this.lecciones.push(leccion)
    }
    deleteLeccion(){
        this.lecciones.pop(leccion)
    }   

    //static variables and methods
    static BaseUrl = 'desarrolloUtil.com/cursos/'
}

const javaScript = new Curso('javascript', 1)
const typeScript = new Curso('typeScript', 3)
javaScript.agregarLeccion('variables')
javaScript.dificultad = 4
console.log(javaScript.dificultad)

class Usuario{
    constructor(nombre, email, contraseña){
        this.nombre = nombre
        this.email = email
        this.contraseña
    }
    saludo(){
        console.log('hola soy', this.nombre)
    }
    login(email, password){
        return this.email === email && this.contraseña === contraseña
    }
}

class Alumno extends Usuario{

}

const pablo = new Usuario('pablo', 'pablo@gmail.com', '123')
const Jose = new Alumno('pablo', 'pablo@gmail.com', '123')

class Like{
    constructor(coll, likedBy, idComment){
        this.coll = coll
        this.likedBy = likedBy
        this.idComment = idComment
        console.log('esta es la clase Like')
    }
    async addLikes(){
        try {
            await client.connect()
            const addLike = await client.db('instagram').collection(this.coll).updateOne(
                {_id : this.idComment}, {$addToSet: {likes : {likedBy : this.likedBy, likes : 1}}})
                
                console.log(addLike)
            } 
        catch (error) {

            console.log(error)
        }
    }
}

app.get('/likes', async (req, res)=>{
    const idComment = new ObjectId(req.body.commentId)
    const likedBy = req.body.likedBy
    const coll = req.body.coll
    const like = new Like(coll, likedBy, idComment )
    await like.addLikes()

})