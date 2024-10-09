
// we check if there are users
// because in the backend, 
// we have send only those chats the current user is part of 
export const getSender = (loggedUser, users) => users && users[0]._id === loggedUser._id ? users[1].name : users[0].name
