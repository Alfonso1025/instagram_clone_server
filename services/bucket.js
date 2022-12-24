

const S3= require('aws-sdk/clients/s3')
const fs= require('fs')
const { resolve } = require('path')
require('dotenv').config()



const bucketName= process.env.AWS_BUCKET_NAME
const region= process.env.AWS_REGION
const accessKeyId= process.env.AWS_ACCESS_KEY
const secretAccessKey= process.env.AWS_SECRET_ACCESS_KEY

const s3= new S3({
    region,
    accessKeyId,
    secretAccessKey
    })
    

module.exports = {

   
   uploadProfileImage : async (file, id)=>{
    
        
        const fileStream = fs.createReadStream(file.uri)
        const profileKey = 'testing'
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: profileKey
        }
        return s3.upload(uploadParams).promise()
   },
    uploadMultipleImagesAws :  async (filesArray) =>{

        const insertedObjetsArray = []
        const uploadPromises = []
        

        for(let i = 0; i < filesArray.length; i++ ){

            const file = filesArray[i]
            const fileStream = fs.createReadStream(file.path)
           
            const uploadParams = {

                Bucket : bucketName,
                Body : fileStream,
                Key : file.originalname
            }
         uploadPromises.push( new Promise((resolve, reject) => {
            

            s3.upload(uploadParams, (error, data) => {

                if(error) {
                    isInsertionError = true
                    console.log('error from s3.upload', error)
                    reject(error)
                    
                
                }
                else if (data) {
                    insertedObjetsArray.push(data)
                    
                    resolve(data)
                    
                    
                   
                
                }
            })
         }) )  
            

        }
       
        
       return await  Promise.all(uploadPromises)
        
    },
    downloadImagesAws : async (keysArray) =>{
    
    const downloadedPromises = []

     for(let i = 0; i < keysArray.length; i++ ) {

        const downloadParams = {

            Key:keysArray[i],
            Bucket:bucketName
        }
     downloadedPromises.push(new Promise((resolve, reject)=> {

        s3.getSignedUrlPromise('getObject', downloadParams).then(url => resolve(url))
        .catch(error => reject(error))
     })) 
    
    
     }  
            
         return await Promise.all(downloadedPromises)     
     
    }, 
    deleteImagesAws : async (keysArray)=>{

        const deletetedPromises = []
        const objectDeleteInfo = []

        for( let i = 0; i < keysArray.length; i++){
            deleteParams = {

                Key:keysArray[i],
                Bucket:bucketName
            }
            deletetedPromises.push( new Promise((resolve, reject)=>{

                s3.deleteObject(deleteParams, (error, data)=>{

                    if(error) {
                        console.log(error)
                        reject(error)
                    }
                    
                    objectDeleteInfo.push(data)
                    resolve({data, deleted : true})
                })
            }))
        }
        return await Promise.all(deletetedPromises)
    }
}