import { ADD_POST, ADD_ALL, DELETE, ADD_ON_ME_ALL } from '../types/posts';

function postsReducer(state =
  [], action) {
  switch (action.type) {
    case ADD_POST:
      return [...state, action.payload];

    case ADD_ALL:
      return action.payload;

    case ADD_ON_ME_ALL:
      return action.payload;

    case DELETE:
      console.log(state);
      console.log(action.payload);
      return state.filter(el => el._id !== action.payload);

    default:
      return state;
  }
}

export default postsReducer;
