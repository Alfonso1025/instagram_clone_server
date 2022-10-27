

[
    {
        users:{
            ObjectId:{
                required:true,
                type : ObjectId
            },
            userName: {
                required:true,
                type : String
            },
            email:{
                required:true,
                type : String
            },
            password:{
                required:true,
                type : String
            },
            followers : [ 
                {
                    required : false,
                    type : ObjectId
                }
            ],
            following : [
                required : false,
                type : ObjectId
            ],
            account : {
                public : {
                    required : true,
                    type : Boolean,
                    default : True
                }
            }
        },
        userPost:{
            
                ObjectId:{
                    required:true,
                    type : ObjectId
                },
                postedByUser : {
                    required : true,
                    type : ObjectId
                }
                contentPost: {
                    required:true,
                    type : String
                },
               
                likes:[ 
                    {
                        likedBy:{
                                required:true,
                                type : String
                                },
                        like : {
                            required :true,
                            type : Number
                        }
                    }
                    ]
                   
                    
                },
                date: {
                    required:true,
                    type : date
                }
        },

        comments:{
            ObjectId:{
                required:true,
                type : ObjectId
            },
            relatedPost : {
                required : true,
                type : ObjectId
            },
            commentByUser : {
                required : true,
                type : ObjectId
            }
            commentContent:{
                required:true,
                type : String
            },
            commentLikes: [
                {
                    likedBy:{
                        required:true,
                        type : String
                    },
                    like : {
                        required :true
                        type : number
                    }
                }
            ],

            replies:[
                {
                    repliedBy: { 
                        required: true,
                        type: ObjectId
                    },
                    contentReply:{
                        required:true,
                        type : String
                    },
                    replyLikes:[
                        {
                            likedBy:{
                                required:true,
                                type : String
                            }
                        }
                    ]

                }
            ]
            
        },
        chat : {

            ObjectId: {
                required: true,
                type : ObjectId
            },
           
            
            partcicipants: [ 
                {
                    required : true,
                    type : ObjectId
                }
            ],
            messages : [
                {
                    messageContent : {
                        required : true,
                        type : String
                    },

                    sentByUser : {
                        required : true,
                        type : ObjectId
                    },
                    timeStamp : {
                        required :true,
                        type : date
                    }
                }
            ]
        }
    },
]


