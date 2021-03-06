// const initialState = {
//   queries: {
//     asdf_query: {
//       loading: false,
//       type: 'collection', // || 'document',
//       path: '',
//       // where ?
//       // orderBy ?
//       subscribed: true,
//       // save unsubscribe Function in pyrodux instance?
//       data: {
//         //...dataByIds
//       }
//     }
//     //...otherQueries
//   },
//   auth: {
//     didAuthRun: false // initially false, to be able to differentiate it from object null to know if auth has run
//     uid, email, ...
//   }
// };

const initialState_Query = {
  loading: false,
  data: {},
  knownQueries: [] // only filled on queries and collections
  // type: 'collection', // 'document'
  // path: '',
  // subscribed: false
};

const queryReducer = (state = initialState_Query, action) => {
  // single query level // state.pyrodux.queries.asdf_query
  switch (action.type) {
    case '@pyrodux_REGISTER_QUERY':
      return {
        ...state,
        type: action.queryType,
        path: action.path,
        subscribed: action.subscribed
      };
    case '@pyrodux_REGISTER_QUERYSTRING':
      return {
        ...state,
        knownQueries: state.knownQueries.concat(action.queryString)
      };
    case '@pyrodux_SET_LOADING':
      return {
        ...state,
        loading: action.isLoading === true
      };
    case '@pyrodux_SET_QUERY_DATA':
      return {
        ...state,
        data: action.data
      };
    case '@pyrodux_PATCH_QUERY_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data
        }
      };
    case '@pyrodux_REMOVE_DOCUMENT':
      const newData = { ...state.data };
      delete newData[action.id];
      return {
        ...state,
        data: newData
      };
    default:
      return state;
  }
};

const initialState_Data = {};

const dataReducer = (state = initialState_Data, action) => {
  // data level // state.pyrodux.queries
  switch (action.type) {
    case '@pyrodux_REGISTER_QUERY':
    case '@pyrodux_REGISTER_QUERYSTRING':
    case '@pyrodux_SET_LOADING':
    case '@pyrodux_SET_QUERY_DATA':
    case '@pyrodux_PATCH_QUERY_DATA':
    case '@pyrodux_REMOVE_DOCUMENT':
      const queryState = state[action.collectionOrQueryName];
      return {
        ...state,
        [action.collectionOrQueryName]: queryReducer(queryState, action)
      };
    case '@pyrodux_UNREGISTER_QUERY':
      const newState = { ...state };
      delete newState[action.collectionOrQueryName]; // TODO is there a better way to remove key-value-pair?
      return newState;
    default:
      return state;
  }
};

const initialState_Auth = {
  didAuthRun: false
};

const authReducer = (state = initialState_Auth, action) => {
  // auth level // state.pyrodux.auth
  switch (action.type) {
    case '@pyrodux_SET_AUTH_USER':
      if (action.loggedIn)
        return {
          didAuthRun: true,
          uid: action.uid,
          email: action.email,
          displayName: action.displayName,
          photoUrl: action.photoURL,
          emailVerified: action.emailVerified
        };
      return {
        didAuthRun: true
      };
    default:
      return state;
  }
};

const reducer = (state = {}, action) => {
  return {
    queries: dataReducer(state.queries, action),
    auth: authReducer(state.auth, action)
  };
};

export default reducer;
