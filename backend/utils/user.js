const users =[]

const addUser = ({name, userId, roomId, host, presenter}) => {
     
     const user ={name, userId, roomId, host, presenter};
     users.push(user);
     return users;
     
}

// remove user

const removeUser = (userId) => {
     const index = users.findIndex((user) => user.userId === userId);
     if(index !== -1){
          return users.splice(index, 1)[0];
     }
}

// get user
const getUser = (userId) => users.find((user) => user.userId === userId);


// get all users in a room
const getUsersInRoom = (roomId) => users.filter((user) => user.roomId === roomId);

module.exports = {addUser, removeUser, getUser, getUsersInRoom};
