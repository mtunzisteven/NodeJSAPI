# Talent Share API

This is a NodeJS API developed to provide a backend logic for interacting with a database. It provides the backend logic for an app that serves as a repository of users and their respective talents or skills.

### [Base Url](http://3.84.116.201/)

# Usage

## All user operations: */auth*




### Sign-up for a user account

PUT:*/signup*

```
{
    email: "string",
    password:"string",   
    name:"string",    
    surname: "string",    
    memberId:"string",
    ward:  "string",    
    stake:  "string",
    age:  "string",
    whatsApp: "string"
}
```
Expected result - status:201

```
    {
        message:'User Created successfully!', 
        userId:userId
    }
```

### Login to existing account

POST:*/login*
```
{

    email: "string",
    
    password: "string"
    
}
```
Expected result - status:200
```
    {
        token:token,
        
        userId:userId
    }
```

### Fetch all users

GET:*/users*
```
{ 

}
```
Expected result: status:200
```
    {
        message:"Users retrieved!",
        
        users:users
    }
```
### Fetch user by id

GET:*/users/:userId*
```
{ 

}
```
Expected result - status:200
```
    {
        message:"User retrieved successfully!",
        
        user: user
    }
```

### Udate user details: *auth-token required*

PUT:*/users/:userId*
```
{ 

    email: "string",
    
    password:"string",
    
    name:"string",    
    
    surname: "string",
    
    memberId:"string",
    
    ward:  "string",
    
    stake:  "string",
    
    age:  "string",
    
    whatsApp: "string"
    
}
```
Expected result - status:201
```
    {
        message:'User updated successfully!'
    }
```

### User Model:
```
{

    email: {
    
        type: String,
        
        required: true,
        
    },
    
    password: {
    
        type: String,
        
        required: true,
        
    },
    name: {
        type: String,
        required: true,
    },        
    surname: {
    
        type: String,
        
        required: true,
        
    },
    memberId: {
    
        type: String,
        
        required: true,
        
    },
    
    ward: {
        type: String,
        required: true,
    },
    
    stake: {
    
        type: String,
        
        required: true,
        
    },
    
    age: {
    
        type: String,
        
        required: true,
        
    },
    whatsApp: {
        type: String,
        required: true,
    }
        
}
```

## All talent operations: */talent*

### Add a new talent. *Requirements {admin = true & auth-token}*

POST:*/*
```
{

    title: "string"
    
}
```
Expected result - status:201
```
    {
    
        message:'Talent created successfully!',
        
        Talent: Talent,
        
        result: result 
        
    }
```

### Fetch all talents

GET:*/*
```
{ 

}
```
Expected result - status:200
```
    {
        message: 'Fetched talents successfully', 
        
        Talents:talents
    }
```

### Fetch talent by id

GET:*/:talentId*
```
{ 

}
```
Expected result - status:200
```
    {
        Talent: talent
    }
```

### Update a talent by id. *Requirements {admin = true & auth-token}*

PUT:*/:talentId*
```
{
    title: "string"
}
```
Expected result - status:201
```
    {
        massage:"Talent updated successfully", 
        
        talent:result
    }
```

### Add talent to user by talent id. *Auth-token*

PUT:*/:talentId*
```
{

}
```

Expected result - status:201
```
    {
        message:'Talent added successfully!',
        
        Talent: talent,
        
        result: result
    }
```

### Remove talent from user by talent id. *Auth-token*

PUT:*/:talentId*
```
{

}
```

Expected result - status:201
```
    {
        message:'Talent removed successfully!',
        
        result: result
    }
```

### Delete talent from database by talent id. *Requirements {admin = true & auth-token}*

DELETE:*/:talentId*
```
{

}
```

Expected result - status:201
```
    {
        message:'Talent deleted successfully!',
        
        result: result
    }
```

## Talent Model:
```
{

    title: string

}
```