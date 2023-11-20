
const EntitySchema = require("typeorm").EntitySchema

const User=new EntitySchema({
  name: "User",
  id: {
    primary: true,
    type: "int",
    generated: true
  },
  userId:{
    type: "varchar"
  },
  password:{
    type :'varchar'
  },
  userName:{
    type:"varchar"
  },
  lastLoginTime:{
    type:'varchar'
  },
  permission:{
    type:'varchar'
  },




})
module.exports = User;
